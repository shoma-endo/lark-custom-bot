#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// カラー表示用
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// 実行コマンドを出力ありで実行
function exec(command, cwd) {
  console.log(`${colors.cyan}> ${command}${colors.reset}`);
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd || process.cwd(),
    });
    return true;
  } catch (error) {
    console.error(`${colors.red}コマンド実行エラー: ${command}${colors.reset}`);
    return false;
  }
}

// パッケージの一覧を取得
function getPackages() {
  const packagesDir = path.join(process.cwd(), 'packages');
  return fs
    .readdirSync(packagesDir)
    .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory())
    .map(dir => ({
      name: dir,
      path: path.join(packagesDir, dir),
      hasTests: fs.existsSync(path.join(packagesDir, dir, 'src', '__tests__')),
    }));
}

// テスト処理の実行
async function test() {
  console.log(`${colors.bright}${colors.green}Larkプラグインのテストを開始します...${colors.reset}\n`);

  // Lint実行
  console.log(`${colors.yellow}リントを実行しています...${colors.reset}`);
  const lintSuccess = exec('eslint packages/*/src --ext .ts,.tsx');
  
  if (!lintSuccess) {
    console.error(`${colors.red}リントでエラーが検出されました。${colors.reset}\n`);
  } else {
    console.log(`${colors.green}リントが完了しました。${colors.reset}\n`);
  }
  
  // 各パッケージのテスト実行
  const packages = getPackages().filter(p => p.hasTests);
  
  if (packages.length === 0) {
    console.log(`${colors.blue}テスト可能なパッケージが見つかりませんでした。${colors.reset}`);
    return;
  }
  
  for (const pkg of packages) {
    console.log(`${colors.yellow}${pkg.name}のテストを実行しています...${colors.reset}`);
    
    // package.jsonにテストスクリプトが定義されているか確認
    const pkgJsonPath = path.join(pkg.path, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    
    if (pkgJson.scripts && pkgJson.scripts.test) {
      const success = exec('pnpm run test', pkg.path);
      
      if (success) {
        console.log(`${colors.green}${pkg.name}のテストが成功しました。${colors.reset}\n`);
      } else {
        console.error(`${colors.red}${pkg.name}のテストが失敗しました。続行します。${colors.reset}\n`);
      }
    } else {
      console.log(`${colors.blue}${pkg.name}にはテストスクリプトが定義されていません。スキップします。${colors.reset}\n`);
    }
  }

  console.log(`${colors.bright}${colors.green}テストが完了しました！${colors.reset}`);
}

// スクリプト実行
test().catch(err => {
  console.error(`${colors.red}エラーが発生しました:${colors.reset}`, err);
  process.exit(1);
}); 