import { basekit, Component, ParamType } from '@lark-opdev/block-basekit-server-api';

basekit.addAction({
  formItems: [
    {
      itemId: 'text',
      label: '入力テキスト',
      required: true,
      component: Component.Input,
      componentProps: {
        mode: 'textarea',
        placeholder: 'テキストを入力するか、参照列を選択してください',
      }
    },
    {
      itemId: 'transformType',
      label: '変換タイプ',
      required: true,
      component: Component.SingleSelect,
      componentProps: {
        options: [
          {
            label: '大文字に変換',
            value: 'toUpperCase',
          },
          {
            label: '小文字に変換',
            value: 'toLowerCase',
          },
        ]
      }
    }
  ],
  // 実行ロジックを定義
  execute: async function(args, context) {
    // 実行時のパラメータargsから入力テキストtextと変換タイプtransformTypeを取得
    const { text = '', transformType } = args;
    // 変換タイプに基づいて入力テキストを大文字/小文字に変換
    const outputText = transformType === 'toUpperCase'
      ? text.toUpperCase()
      : text.toLowerCase();
    // 変換後のテキストを返却
    return {
      text: outputText,
    };
  },
  // ノードの出力パラメータを定義
  resultType: {
    // オブジェクトとして返却することを宣言
    type: ParamType.Object,
    properties: {
        // textプロパティを宣言
        text: {
          // textフィールドの型をstringとして宣言
          type: ParamType.String,
          // ノードUIに表示するラベルを「変換結果」として宣言
          label: '変換結果',
        },
    }
  }
});

export default basekit;
