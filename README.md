# shadriz

## Introduction

shadriz is a full stack automation tool for building TypeScript web applications using a curated selection of technologies.

This is **NOT** a web framework.

Rather, it is a command line interface code generation tool.

You do not install it as a dependency.

Initialize common full stack requirements such as authentication, authorization, and payments.

Scaffold database schemas and user interfaces to use as a reference to build your own full stack application.

The code is yours.

## The shadriz tech stack

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Drizzle ORM](https://orm.drizzle.team/) - Object Relational Mapper
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Auth.js](https://authjs.dev/) - Authentication
- [Stripe](https://www.stripe.com) - Payments
- [zod](https://zod.dev/) - Validation

## Installation

### Step 1: Create new project

Start by creating a new Next.js project using `create-next-app`.

```bash
npx create-next-app@latest my-app --typescript --eslint --tailwind --app --no-src-dir --no-import-alias
```

### Step 2: Run the CLI

Run the `shadriz` init command to setup your project.

```bash
npx shadriz@latest init
```

### Step 3: Configure project

You will be asked a few questions to configure the app.

```
? Which database library would you like to use? pg
? Do you want to use Auth.js for authentication? yes
? Which primary key generation strategy would you like to use? uuidv7
? Which auth providers would you like to use? github, google, credentials, postmark, nodemailer
? Which session strategy would you like to use? jwt
? Do you want to add an Admin dashboard with role-based authorization? yes
? Do you want to enable Stripe for payments? yes
? Do you want to add a dark mode toggle? yes
```

### Step 4: Complete project configuration

After initialization, you may be prompted to complete a few additional tasks depending on the options you chose. For example:

- Update the database url in `.env.local`.
- Run database migrations.
- Set up the auth providers.
- Create a test user.
- Create an admin user.
- Add secrets to `.env.local`.
- Set up Stripe.

## Scaffold a full stack component

After the initial configuration is completed, you can scaffold full stack components with the `scaffold` command.

This command will generate the user interface, database migrations, server actions, and server components of a full stack component.

The `-c` option takes a space-separated string of column configurations in the following format: `column_name:data_type:column_arg1:column_arg2`.

Shadriz supports a variety of primary key configurations, foreign key configuration, and default functions as shown in the "blog" examples below.

See [Drizzle ORM docs](https://orm.drizzle.team/docs/column-types/pg) for a comprehensive list of data types and more advanced configurations.

## Scaffold examples

### postgresql examples

```bash
# postgresql uuidv7 primary key example:
scaffold post -d postgresql -c id:uuid:pk:default-uuidv7 title:text created_at:timestamp:default-now

# postgresql uuidv4 primary key example:
scaffold post -d postgresql -c id:uuid:pk:default-uuidv4 title:text created_at:timestamp:default-now

# postgresql bigserial auto increment primary key example:
scaffold post -d postgresql -c id:bigserial:pk title:text created_at:timestamp:default-now

# postgresql serial auto increment primary key example:
scaffold post -d postgresql -c id:serial:pk title:text created_at:timestamp:default-now

# postgresql foreign key example:
scaffold post -d postgresql -c id:bigserial:pk title:text
scaffold comment -d postgresql -c id:bigserial:pk post_id:bigint:fk-post.id content:text
```

### mysql examples

```bash
# mysql uuidv7 primary key example:
scaffold post -d mysql -c id:varchar:pk:default-uuidv7 title:varchar created_at:timestamp:default-now

# mysql uuidv4 primary key example:
scaffold post -d mysql -c id:varchar:pk:default-uuidv4 title:varchar created_at:timestamp:default-now

# mysql serial auto increment primary key example:
scaffold post -d mysql -c id:serial:pk title:varchar created_at:timestamp:default-now

# mysql integer auto increment primary key example:
scaffold post -d mysql -c id:integer:pk-auto title:varchar created_at:timestamp:default-now

# mysql foreign key example:
scaffold post -d mysql -c id:serial:pk title:varchar
scaffold comment -d mysql -c id:serial:pk post_id:bigint:fk-post.id content:text
```

### sqlite examples

```bash
# sqlite uuidv7 primary key example:
scaffold post -d sqlite -c id:text:pk:default-uuidv7 title:text created_at:text:default-now

# sqlite uuidv4 primary key example:
scaffold post -d sqlite -c id:text:pk:default-uuidv4 title:text created_at:text:default-now

# sqlite integer auto increment primary key example:
scaffold post -d sqlite -c id:integer:pk-auto title:text created_at:text:default-now

# sqlite foreign key example:
scaffold post -d sqlite -c id:integer:pk-auto title:text
scaffold post -d sqlite -c id:integer:pk-auto post_id:integer:fk-post.id content:text
```

## Auth

If Auth.js was enabled during initialization, you will be able to scaffold using a `private` authorization level. The pages will be put into the `(private)` route group. These pages along with the server actions will require a user to be authenticated to access.

If the Admin dashboard was enabled during initialization, you will be able to scaffold using an `admin` authorization level. The pages will be put into the `(admin)` route group. These pages along with the server actions will require a user with the `admin` role to access.

Additional roles can be added to the `user_role` table according to project needs. Additional access control functions can be added to `lib/authorization.ts` and used throughout the application.

## Stripe

If Stripe was enabled during initialization, all the code needed for a simple one-time purchase and monthly subscription model will be generated. This includes the webhook, checkout session, and customer portal api endpoints.

Also, a basic pricing page with the one-time purchase and subscription is included. A `scripts/create-price.ts` script is provided to create the initial products on Stripe and on the local database.

Any of the code and content can be changed to fit your business model. The goal of this Stripe automation is to provide a fully functional example to use as a starting point. If the payment requirements are simple, then it may be sufficient to start using right away to start accepting payments.

## FAQ

**Why not a web framework?**

Next.js is the underlying web framework. However, despite all of the conveniences it offers, you still have to write a significant amount of boilerplate code when you start a project.

Things like setting up the database and the UI library. For some projects, you may need authentication, role-based authorization, and payment processing. These things take time to do.

shadriz differs in that it provides a higher level abstraction for building apps. It's like a low-code solution where you own the concrete implementation so you can customize it according to your project requirements. The code is written to your Next.js repo and you can review it before committing to anything.

**Why not a boilerplate?**

Boilerplates have one problem. They go obsolete fast. Within a few months, many of your dependencies may already be behind the latest version.

That is why shadriz offers a `--latest` option to install latest dependencies. This means you'll get the latest version of Drizzle ORM, shadcn/ui components, Auth.js, Stripe, TailwindCSS, Zod, and more.

If you prefer a more stable version, leave out the `--latest` flag and you'll get the pinned versions of each top-level dependency. The pinned versions can be found in `package-shadriz.json` in the shadriz GitHub repo.

## Inspirations

### Ruby on Rails

shadriz is inspired by the **convention over configuration** philosophy of Ruby on Rails, which allows anyone to rapidly prototype applications in minutes.

shadriz is an [omakase](https://dhh.dk/2012/rails-is-omakase.html) of the author's preferred TypeScript ingredients.

Nostalgia for Ruby on Rails style development is one motivation that led to the creation of shadriz.

### Next.js

shadriz generates Next.js and React code that uses latest techniques, such as **server components and server actions**.

Next.js provides many conveniences out of the box, such file system routing, server side rendering, code bundling, and more.

### shadcn/ui

shadriz is inspired by the **non-dependency and transparency** of shadcn/ui, the tool that allows anyone to automatically copy and paste beautifully styled radix ui components into their projects.

shadriz essentially generates full stack components into your Next.js project. You have full control of the code that is generated instead of the code being hidden behind an external package.

Like shadcn/ui, shadriz is not a dependency that you add to your node project. Instead, it is a CLI tool that installs third party packages and generates code.

### Drizzle ORM

shadriz uses Drizzle ORM for the best-of-both world of **sql-like** and **relational queres**, as well as automatic **schema generation** and **database migrations**.

shadriz takes the automations one step further by generating the configuration files required to start using Drizzle ORM.

Like Drizzle ORM, shadriz supports 3 database dialects: postgresql, mysql, and sqlite.

### TailwindCSS

shadriz is based on shadcn/ui which has it's **styling based on TailwindCSS**, a CSS framework which provides reusable utility classes. TailwindCSS is chosen for it's benefits on **development speed** and **composability**.

TailwindCSS simplifies and improves scalability of styling by coupling markup with style.

### Auth.js

shadriz uses Auth.js for it's authentication solution. However, running the Auth.js automation is totally optional, as some applications may not need authentication or a different auth solution is preferred.

With one command, you can have authentication mostly setup and configured. Just add the client ids and secrets to the `.env.local` file and you're good to go.

shadriz also provides a `script/create-user.ts` script to create users. This is also provided as an example on how to leverage Drizzle ORM in backend scripting using TypeScript. Note: this script is only generated if `credentials` is chosen as a provider.

### Zod

shadriz uses `zod` and `drizzle-zod` for data validations. Each server action that is generated by the scaffolding tool will also contain zod validations to check for the correctness of data being submitted.

`drizzle-zod` automatically creates a zod schema based on a drizzle table. This reduces boilerplate. However, if specific validations are needed, the generated zod schemas can be extended to have custom validation rules.

## Author

Built by [travisluong](https://www.travisluong.com). Source code available on [github](https://www.github.com/travisluong/shadriz).

## License

MIT
