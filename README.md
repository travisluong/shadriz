# 🤖 shadriz

## Full Stack TypeScript Scaffolding Inspired by Ruby on Rails

📚 shadriz is a full stack automation tool for building TypeScript web applications using a curated selection of technologies.

💵 Spend more time creating, 🍽️ less time on boilerplate.

🆓 Free. 📖 Open Source.

## ⌨️ Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Drizzle ORM](https://orm.drizzle.team/) - Object Relational Mapper
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Auth.js](https://authjs.dev/) - Authentication
- [zod](https://zod.dev/) - Validation

## 🚀 Getting started

### 🆕 Create a new project

This command will create a new Next.js project using the latest version, along with a number of pre-selected options. It will also install core dependencies, generate required files, and initialize shadcn/ui. Once you cd into the project, you'll see the non-committed changes applied to a fresh Next.js installation.

```bash
npx shadriz new demo
cd demo
```

### 💧 Initialize Drizzle ORM database configuration

Set up one of the following supported database packages. This command will install dependencies and generate the necessary configuration files for Drizzle ORM. After running the command, remember to update the `.env.local` file with your `DB_URL`.

```bash
npx shadriz db pg
npx shadriz db mysql2
npx shadriz db better-sqlite3
```

### 📚 Scaffold a full stack component

This command will generate the CRUD UI, database migrations, server actions, and server components of a full stack component. The columns option `-c` or `--columns` takes a space-separated string of column configurations in the following format: `column_name:data_type:column_arg1:column_arg2`.

Shadriz supports a variety of primary key configurations, basic foreign key configuration, and default functions as shown in the "blog" examples below. See [Drizzle ORM documentation](https://orm.drizzle.team/) for a comprehensive list of data types and more advanced configurations.

After scaffolding, you'll have to run `npx drizzle-kit generate`. Then you will have to run `npx drizzle-kit migrate` to apply the migrations. Alternatively, you can also run `npx tsx scripts/migrate.ts`, which is a script shadriz provides as an example to programmatically trigger a migration.

```bash
# postgresql uuid primary key examples:
scaffold post -d postgresql -c id:uuid:pk:default-uuidv7 title:text created_at:timestamp:default-now
scaffold post -d postgresql -c id:uuid:pk:default-uuidv4 title:text created_at:timestamp:default-now

# postgresql auto increment primary key examples:
scaffold post -d postgresql -c id:bigserial:pk title:text created_at:timestamp:default-now
scaffold post -d postgresql -c id:serial:pk title:text created_at:timestamp:default-now

# mysql uuid primary key examples:
scaffold post -d mysql -c id:varchar:pk:default-uuidv7 title:varchar created_at:timestamp:default-now
scaffold post -d mysql -c id:varchar:pk:default-uuidv4 title:varchar created_at:timestamp:default-now

# mysql auto increment primary key examples:
scaffold post -d mysql -c id:serial:pk title:varchar created_at:timestamp:default-now
scaffold post -d mysql -c id:integer:pk-auto title:varchar created_at:timestamp:default-now

# sqlite uuid primary key examples:
scaffold post -d sqlite -c id:text:pk:default-uuidv7 title:text created_at:text:default-now
scaffold post -d sqlite -c id:text:pk:default-uuidv4 title:text created_at:text:default-now

# sqlite auto increment primary key examples:
scaffold post -d sqlite -c id:integer:pk-auto title:text created_at:text:default-now

# postgresql foreign key examples:
scaffold post -d postgresql -c id:bigserial:pk title:text
scaffold comment -d postgresql -c id:bigserial:pk post_id:bigint:fk-post.id content:text

# mysql foreign key examples:
scaffold post -d mysql -c id:serial:pk title:varchar
scaffold comment -d mysql -c id:serial:pk post_id:bigint:fk-post.id content:text

# sqlite foreign key examples:
scaffold post -d sqlite -c id:integer:pk-auto title:text
scaffold post -d sqlite -c id:integer:pk-auto post_id:integer:fk-post.id content:text
```

## 🔒 Set up authentication

This command will generate the Auth.js configurations. The Auth.js docs recommend using an OAuth solution like google or github for security reasons. However, shadriz also provides a quick credentials solution of email/password, which is useful for prototyping.

```bash
# postgresql example with github, google, and credentials provider:
npx shadriz auth github google credentials -d postgresql

# mysql example with github and google provider:
npx shadriz auth github google -d mysql

# sqlite example with credentials provider:
npx shadriz auth credentials -d sqlite
```

## 💡 Inspirations

### 🚂 Ruby on Rails

shadriz is inspired by the **convention over configuration** philosophy of Ruby on Rails, which allows anyone to rapidly prototype applications in minutes.

🍣 shadriz is an [omakase](https://dhh.dk/2012/rails-is-omakase.html) of the author's preferred TypeScript ingredients.

Nostalgia for Ruby on Rails style development is one motivation that led to the creation of shadriz.

### ⏭️ Next.js

shadriz generates Next.js and React code that uses latest techniques, such as **server components and server actions**.

Next.js provides many conveniences out of the box, such file system routing, server side rendering, code bundling, and more.

### ⬛ shadcn/ui

shadriz is inspired by the **non-dependency and transparency** of shadcn/ui, the tool that allows anyone to automatically copy and paste beautifully styled radix ui components into their projects.

shadriz essentially generates full stack components into your Next.js project. You have full control of the code that is generated instead of the code being hidden behind an external package.

Like shadcn/ui, shadriz is not a dependency that you add to your node project. Instead, it is a CLI tool that installs third party packages and generates code.

### 💧 Drizzle ORM

shadriz uses Drizzle ORM for the best-of-both world of **sql-like** and **relational queres**, as well as automatic **schema generation** and **database migrations**.

shadriz takes the automations one step further by generating the configuration files required to start using Drizzle ORM.

Like Drizzle ORM, shadriz supports 3 database dialects: postgresql, mysql, and sqlite.

### 🍃 TailwindCSS

shadriz is based on shadcn/ui which has it's **styling based on TailwindCSS**, a CSS framework which provides reusable utility classes. TailwindCSS is chosen for it's benefits on **development speed** and **composability**.

TailwindCSS simplifies and improves scalability of styling by coupling markup with style.

### 🔒 Auth.js

shadriz uses Auth.js for it's authentication solution. However, running the Auth.js automation is totally optional, as some applications may not need authentication or a different auth solution is preferred.

With one command, you can have authentication mostly setup and configured. Just add the client ids and secrets to the `.env.local` file and you're good to go.

shadriz also provides a `script/create-user.ts` script to create users. This is also provided as an example on how to leverage Drizzle ORM in backend scripting using TypeScript. Note: this script is only generated if `credentials` is chosen as a provider.

### 🔐 Zod

shadriz uses `zod` and `drizzle-zod` for data validations. Each server action that is generated by the scaffolding tool will also contain zod validations to check for the correctness of data being submitted.

`drizzle-zod` automatically creates a zod schema based on a drizzle table. This reduces boilerplate. However, if specific validations are needed, the generated zod schemas can be extended to have custom validation rules.

## 🧑‍💻 Author

Built by [travisluong](https://www.travisluong.com). Source code available on [github](https://www.github.com/travisluong/shadriz).

## License

MIT
