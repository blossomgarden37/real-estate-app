# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Supabase認証付きの不動産管理Webアプリ。メールアドレス＋パスワードでの会員登録・ログインに対応し、ログイン後は自分が登録した物件の一覧・新規登録・編集・削除ができる。未ログイン時はログイン画面へリダイレクトする。

## デプロイ情報

- 本番URL: https://real-estate-app-eight-peach.vercel.app/
- Supabaseプロジェクト名: realestate-app
- ホスティング: Vercel(`vercel.json` でSPAのルーティングをすべて `index.html` にリライト)

## 技術スタック

- React 19 + Vite 8(`@vitejs/plugin-react`)
- 言語は JavaScript / JSX(TypeScriptの型定義パッケージ `@types/react` 等は入っているが `.ts`/`.tsx` は未使用)
- スタイリングは素の CSS(CSSフレームワーク・CSS-in-JS不使用)
- ルーティングは `react-router-dom`
- 認証・データベースは Supabase(`@supabase/supabase-js`)。Auth(メール＋パスワード)と Postgres の `properties` テーブルを利用
- Lint は oxlint、自動テストは未導入
- SupabaseのProject URL・Publishable keyは `.env`(`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`)で管理し、`.gitignore` で除外している。Vercel上では同名の環境変数をダッシュボードで設定する(`vercel.json` には含めない)

## 命名規約

- コンポーネントファイルは `PascalCase.jsx`(例: [LoginPage.jsx](src/pages/LoginPage.jsx))。コンポーネント名とファイル名を一致させる。
- ページコンポーネントは `src/pages/`、再利用可能なUI部品は `src/components/` に置く。
- 状態更新関数・イベントハンドラは `動詞+対象` の camelCase(例: `handleSubmit`, `handleDelete`, `loadProperties`)。
- Supabaseとの通信ロジックは `src/lib/`(例: `supabaseClient.js`, `properties.js`)にまとめ、コンポーネントから直接 `supabase.from()` を呼ばずAPI関数経由にする。
- CSSクラス名は kebab-case(例: `.property-card`, `.auth-form`)。画面ごとに接頭辞を揃える(認証系は `.auth-`、物件系は `.property-`)。
- Supabaseのテーブル・カラム名は snake_case(例: `properties` テーブルの `user_id`, `created_at`)。

## よく使うコマンド

```
npm install       # 依存関係のインストール
npm run dev        # 開発サーバー起動 (http://localhost:5173、使用中なら自動で次のポート)
npm run build       # 本番ビルド (dist/ に出力)
npm run preview     # ビルド結果のプレビュー
npm run lint       # oxlint によるLint
```

このプロジェクトに自動テストは未導入。

## アーキテクチャ

- [src/main.jsx](src/main.jsx) がエントリーポイントで、`App` を `#root` にマウントする。
- [src/App.jsx](src/App.jsx) が `react-router-dom` の `BrowserRouter` と `AuthProvider` を設定し、`/login`・`/signup`・`/properties` のルーティングを行う。`/properties` は `ProtectedRoute` でラップされ、未ログイン時は `/login` へリダイレクトする。
- [src/context/AuthContext.jsx](src/context/AuthContext.jsx) が Supabase の認証セッションを管理する。`useAuth()` で `user`・`session`・`loading`・`signUp`/`signIn`/`signOut` を取得できる。
- [src/lib/supabaseClient.js](src/lib/supabaseClient.js) が `.env` の値から Supabase クライアントを生成する。
- [src/lib/properties.js](src/lib/properties.js) が `properties` テーブルへのCRUD関数(`fetchProperties`/`createProperty`/`updateProperty`/`deleteProperty`)を提供する。
- [src/pages/PropertyListPage.jsx](src/pages/PropertyListPage.jsx) が物件一覧画面。一覧表示・新規登録・編集・削除のUIを持ち、[src/components/PropertyForm.jsx](src/components/PropertyForm.jsx) を新規登録・編集の両方で共用する。
- [supabase/schema.sql](supabase/schema.sql) に `properties` テーブルの作成SQLとRLSポリシー(自分が登録した物件のみ select/insert/update/delete可能)を定義している。SupabaseのSQL Editorで実行して適用する。
- スタイルは [src/App.css](src/App.css) の素の CSS クラスで管理(CSSフレームワーク不使用)。

## デプロイ (Vercel)

- 本番URLは https://real-estate-app-eight-peach.vercel.app/ 。
- `vercel.json` で全パスを `index.html` にリライトし、`react-router-dom` によるクライアントサイドルーティングがリロード・直接アクセスでも動作するようにしている。
- 環境変数(`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`)はVercelダッシュボードで設定し、リポジトリやビルド設定ファイルには含めない。

## Git運用ルール

- **コードを変更したら、そのたびに変更をコミットし、GitHubへプッシュすること。** 変更を溜め込まず、意味のある単位(1機能・1修正など)ごとにコミット→プッシュまで行う。
- コミットメッセージは何をなぜ変更したかが分かるように簡潔に書く。
- プッシュ前に `git status` / `git diff` で意図しない差分やファイルが含まれていないか確認する。`.env` など秘匿情報を含むファイルがステージされていないか特に注意する。
- `--force` プッシュや `git reset --hard` などの破壊的操作は行わない。
- リモートリポジトリが未設定の場合は、ユーザーに確認してから設定する。
