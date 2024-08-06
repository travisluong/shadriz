# shadriz

## Introduction

shadriz is a full stack automation tool for building TypeScript web applications using a curated selection of technologies.

This is **NOT** a web framework.

Rather, it is a command line interface code generation tool.

You do not install it as a dependency.

Initialize common full stack features such as authentication, authorization, and payments.

Scaffold database schemas and user interfaces to use as a reference to build your own full stack application.

The code is yours.

## Tech stack

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
? Do you want to add an admin dashboard with role-based authorization? yes
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

## Scaffold

After the initial configuration is completed, you can scaffold full stack features with the `scaffold` command.

This command will generate the user interface, database migration and schema, server actions, server components, and client components of a full stack feature.

The `-c` option takes a space-separated string of column configurations in the following format: `column_name:data_type:column_arg1:column_arg2`.

shadriz supports a variety of primary key configurations, foreign key configuration, and default functions as shown in the "blog" examples below.

See [Drizzle ORM docs](https://orm.drizzle.team/docs/column-types/pg) for a comprehensive list of data types and more advanced configurations.

## Examples

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

**What can I build with shadriz?**

shadriz is ideal for full stack monolithic server side rendered web applications.

Here are a few example use cases: blog, productivity saas app, course platform, content website, ecommerce shop, social media app, the front end of an artificial intelligence app.

It is a full stack tool kit that automates away the time consuming things you need to do at the start of a new full stack Next.js project.

**What is a scaffold?**

A scaffold is all of the starter code, including the UI and data layer, that is required to have a fully functional CRUD (Create Read Update Delete) application. Scaffolding was popular in MVC (Model View Controller) frameworks such as Ruby on Rails.

This was helpful as it saved time setting up the initial boilerplate of an application. It also served as a starting reference point for building out the actual web app. This is particularly useful for people or organizations who start many projects.

With scaffolding, you spend less time looking things up because there is a point of reference to build upon. This frees up time and energy to focus on the service layer, which usually requires more custom business logic beyond basic CRUD.

**Why not a web framework?**

Next.js is the underlying web framework. However, despite all of the conveniences it offers, you still have to write a significant amount of boilerplate code when you start a project from a fresh Next.js installation.

shadriz differs in that it provides an opinionated abstraction for creating a solid starting point for app development. shadriz works by writing code to a new Next.js project.

You own the code so you can customize it according to your project requirements. The code is written to your Next.js repo and you can review it before committing to anything.

**Why not a boilerplate?**

Boilerplates go obsolete fast. Within a few months, many of your dependencies may already be behind the latest version.

That is why shadriz offers a `--latest` option to install latest dependencies. This means you'll get the latest version of Drizzle ORM, shadcn/ui components, Auth.js, Stripe, TailwindCSS, Zod, and more.

If you prefer a more stable version, leave out the `--latest` flag and you'll get the pinned versions of each top-level dependency. The pinned versions can be found in `package-shadriz.json` in the shadriz GitHub repo.

The other problem with boilerplates is that it is usually a static hard-coded repo. It can't generate unique database schemas and user interfaces specific to your project.

## Inspirations

### Ruby on Rails

shadriz is inspired by the **convention over configuration** philosophy of Ruby on Rails, which allows anyone to rapidly prototype applications in minutes.

Nostalgia for Ruby on Rails style development is one motivation that led to the creation of shadriz. Specially, the `shadriz scaffold` command was modeled after the `rails scaffold` command.

### Next.js

shadriz generates Next.js and React code that uses latest techniques, such as **server components and server actions**.

Next.js provides many conveniences out of the box, such file system routing, server side rendering, code bundling, and more.

### shadcn/ui

shadriz is inspired by the **non-dependency and customizability** of shadcn/ui, the tool that copies and paste beautifully styled components into your projects.

Similarly, shadriz essentially generates full stack components into your Next.js project. You have full control of the code that is generated instead of the code being hidden behind an external package.

### Drizzle ORM

shadriz uses Drizzle ORM for the best-of-both worlds of **sql-like and relational queres**, as well as automatic **schema generation and database migrations**.

shadriz takes the automations one step further by generating the configuration files required to start using Drizzle ORM, as well as the database schemas and migrations for the full stack scaffolds.

### TailwindCSS

shadriz is based on shadcn/ui which has it's styling based on TailwindCSS, a CSS framework which provides reusable utility classes. TailwindCSS is chosen for it's benefits on **development speed and composability**.

TailwindCSS simplifies and improves scalability of styling by coupling markup with style.

### Auth.js

shadriz uses Auth.js for it's authentication solution. However, running the Auth.js automation is totally optional, as some applications may not need authentication or a different auth solution is preferred.

With one command, you can have authentication mostly setup and configured. Just add the client ids and secrets to the `.env.local` file and you're good to go.

shadriz also provides a `script/create-user.ts` script to create test users. This script is only generated if `credentials` is chosen as a provider.

### Zod

shadriz uses `zod` and `drizzle-zod` for data validations. Each server action that is generated by the scaffolding tool will also contain zod validations to check for the correctness of data being submitted.

`drizzle-zod` automatically creates a zod schema based on a drizzle table. This reduces boilerplate. However, if specific validations are needed, the generated zod schemas can be extended to have custom validation rules.

## Author

Built by [travisluong](https://www.travisluong.com). Source code available on [github](https://www.github.com/travisluong/shadriz).

## License

MIT
