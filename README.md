# 不動産管理アプリ

Supabase認証を用いた不動産管理Webアプリ。メール＋パスワードでの会員登録・ログインを行い、ログイン後に物件一覧(ダミーデータ)を表示する。

## 機能

- メールアドレス＋パスワードでの会員登録・ログイン(Supabase Auth)
- 未ログイン時は `/properties` へのアクセスをログイン画面へリダイレクト
- ログイン後は物件一覧画面(物件名・家賃・エリアをカード表示)へ遷移
- ログアウトボタン

## セットアップ

```bash
npm install
cp .env.example .env   # Supabaseのプロジェクト情報を設定する
npm run dev
```

`.env` には SupabaseのProject URLとPublishable keyを設定する。

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

## 技術スタック

- React + Vite
- react-router-dom(ルーティング)
- @supabase/supabase-js(認証)

## よく使うコマンド

```
npm run dev       # 開発サーバー起動
npm run build      # 本番ビルド
npm run preview    # ビルド結果のプレビュー
npm run lint      # oxlint によるLint
```
