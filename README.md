# internship-ts-web

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## ディレクトリ構成

### /app

nextの app router で使用するページを配置するディレクトリです

### /const

アプリケーションで利用する定数を配置するディレクトリです

### /domain

アプリケーションで利用するドメインを配置するディレクトリです

### /infrastructure

インフラストラクチャ層のコードを配置します。  
各種clientやrepositoryはdomain層で定義されているinterfaceに依存させる形で実装します。

バックエンドの場合は主に DB とのやりとりを repositoryで定義していましたが、 front では主に API とのやりとりを repository
で定義します。

### /ui

アプリケーションで利用するUIコンポーネントを配置するディレクトリです

#### /components

uiコンポーネントを配置します

#### /hooks

カスタムフックを配置するディレクトリです

#### /view_model

VMを配置するディレクトリです VMは画面の状態を管理するために利用します

基本的に1画面1ファイルで作成しますが例外的にglobalなVMも存在します (認証など)

UseCaseを切ることも多くありますが、今回はVMがUseCaseの機能を持つ形で作成していきます

## DI

今回状態管理として zustand を選定しており class を利用していないため DI はなくても大丈夫です。



