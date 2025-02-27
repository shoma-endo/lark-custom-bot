#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

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

// パッケージの一覧を取得
function getPackages() {
  const packagesDir = path.join(process.cwd(), 'packages');
  return fs
    .readdirSync(packagesDir)
    .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory())
    .map(dir => ({
      name: dir,
      path: path.join(packagesDir, dir),
    }));
}

// クリーン処理の実行
async function clean() {
  console.log(`${colors.bright}${colors.green}ビルド成果物をクリーンアップしています...${colors.reset}\n`);

  // 各パッケージのdistディレクトリを削除
  const packages = getPackages();
  
  for (const pkg of packages) {
    const distPath = path.join(pkg.path, 'dist');
    console.log(`${colors.yellow}${pkg.name} のdistディレクトリを削除しています...${colors.reset}`);
    
    try {
      if (fs.existsSync(distPath)) {
        rimraf.sync(distPath);
        console.log(`${colors.green}${pkg.name} のdistディレクトリを削除しました。${colors.reset}`);
      } else {
        console.log(`${colors.blue}${pkg.name} にdistディレクトリが見つかりませんでした。${colors.reset}`);
      }
    } catch (error) {
      console.error(`${colors.red}${pkg.name} のdistディレクトリの削除に失敗しました:${colors.reset}`, error);
    }
  }

  console.log(`\n${colors.bright}${colors.green}クリーンアップが完了しました！${colors.reset}`);
}

// スクリプト実行
clean().catch(err => {
  console.error(`${colors.red}エラーが発生しました:${colors.reset}`, err);
  process.exit(1);
}); 