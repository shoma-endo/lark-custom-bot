import { basekit, Component, ParamType } from '@lark-opdev/block-basekit-server-api';

basekit.addAction({
  formItems: [
    // 1. テキスト入力 (Input)
    {
      itemId: 'textInput',
      label: 'テキスト入力',
      required: true,
      component: Component.Input,
      componentProps: {
        mode: 'textarea',
        placeholder: 'テキストを入力してください'
      }
    },

    // 2. 日時選択 (DateTimePicker)
    {
      itemId: 'dateTime',
      label: '日時選択',
      component: Component.DateTimePicker
    },

    // 3. ユーザー/グループ選択 (ContactPicker)
    {
      itemId: 'contact',
      label: 'メンバー選択',
      component: Component.ContactPicker,
      componentProps: {
        supportTypes: ['user', 'group'],
        mode: 'multiple',
        placeholder: 'メンバーを選択してください'
      }
    },

    // 4. 折りたたみセクション (Collapse)
    {
      itemId: 'collapseSection',
      component: Component.Collapse,
      componentProps: {
        displayItems: ['hiddenField1', 'hiddenField2']
      }
    },

    // 5. チェックボックス (Checkbox)
    {
      itemId: 'checkbox',
      label: '確認チェック',
      component: Component.Checkbox
    },

    // 6. 情報表示 (Tips)
    {
      itemId: 'tips',
      component: Component.Tips,
      componentProps: {
        message: '入力時の注意事項をここに表示します'
      }
    },

    // 7. 単一選択 (SingleSelect)
    {
      itemId: 'singleSelect',
      label: '選択してください',
      required: true,
      component: Component.SingleSelect,
      componentProps: {
        options: [
          { label: '選択肢1', value: '1' },
          { label: '選択肢2', value: '2' },
          { label: '選択肢3', value: '3' }
        ]
      }
    },

    // 8. 複数選択 (MultipleSelect)
    {
      itemId: 'multiSelect',
      label: '複数選択',
      component: Component.MultipleSelect,
      componentProps: {
        options: [
          { label: 'タグ1', value: 'tag1' },
          { label: 'タグ2', value: 'tag2' },
          { label: 'タグ3', value: 'tag3' }
        ]
      }
    },

    // 9. 添付ファイル (Attachment)
    {
      itemId: 'attachment',
      label: 'ファイル添付',
      component: Component.Attachment,
      componentProps: {
        placeholder: 'ファイルを選択してください'
      }
    },

    // 10. ラジオボタン (Radio)
    {
      itemId: 'radio',
      label: 'ラジオ選択',
      component: Component.Radio,
      componentProps: {
        options: [
          { value: 'option1', label: 'オプション1' },
          { value: 'option2', label: 'オプション2' }
        ]
      }
    },

    // 11. キーバリューペア (KeyValuePair)
    {
      itemId: 'keyValue',
      label: 'キーバリューペア',
      component: Component.KeyValuePair,
      componentProps: {
        itemsLimit: 5,
        addText: 'ペアを追加',
        keyText: 'キー名',
        valueText: '値'
      }
    }
  ],

  // 実行ロジック
  execute: async function(args, context) {
    console.log('フォーム入力値:', args);
    
    // 各フィールドの値を取得
    const {
      textInput,
      dateTime,
      contact,
      checkbox,
      singleSelect,
      multiSelect,
      attachment,
      radio,
      keyValue
    } = args;

    // 処理結果を整形
    const result = {
      textInput,
      dateTime: new Date(dateTime).toLocaleString('ja-JP'),
      contact: Array.isArray(contact) ? contact.join(', ') : contact,
      checkbox: checkbox ? '✓' : '✗',
      singleSelect,
      multiSelect: Array.isArray(multiSelect) ? multiSelect.join(', ') : multiSelect,
      attachment: Array.isArray(attachment) ? `${attachment.length}個のファイル` : '添付なし',
      radio,
      keyValue: Array.isArray(keyValue) ? 
        keyValue.map(pair => `${pair.key}: ${pair.value}`).join('\n') : 
        'データなし'
    };

    return {
      result: JSON.stringify(result, null, 2)
    };
  },

  // 出力パラメータ定義
  resultType: {
    type: ParamType.Object,
    properties: {
      result: {
        type: ParamType.String,
        label: '処理結果'
      }
    }
  }
});

export default basekit;
