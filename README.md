# MONSTERBATTLE / ASTRA CROWN

モンスター収集 × コマンドRPGのブラウザゲーム試作です。

## 開発構成

- `src/types.ts` — TypeScriptの型定義
- `src/data.ts` — モンスター・クエストデータ
- `src/app.ts` — セーブ、画面遷移、クエスト開始
- `src/game.ts` — 戦闘、育成、進化、ガチャ
- `styles.css` — UI
- `dist/*.js` — GitHub Pagesで実行するJavaScript
- `index.html` — GitHub Pagesエントリーポイント

```bash
npm install
npm run typecheck
npm run build
```

GitHub Pagesはルートの `index.html` から `dist/data.js`、`dist/app.js`、`dist/game.js` を読み込みます。

## v5

各モンスターに種族・役割・固有パッシブを追加しました。低レアもキラー、周回、バリア破壊、軽減などの特化性能を持ち、クエストによって編成理由が生まれる設計です。
