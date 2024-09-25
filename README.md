# shadriz

Build full stack Next.js apps super fast.

- [Docs](https://travisluong.github.io/shadriz)
- [GitHub](https://github.com/travisluong/shadriz)

## Introduction

shadriz is a full stack automation tool for building TypeScript web applications using a curated selection of technologies.

This is an ephemeral web framework.

You do not install it into your project as a dependency.

It is a command line interface code generation tool.

You use it to generate full stack features including authentication, authorization, and payments.

You can scaffold database schemas and user interfaces to use as a reference to build your own full stack application.

The code is yours.

## Philosophy

shadriz offers an opinionated foundation to be built upon.

shadriz focuses on writing simple and easy-to-read code that you can customize.

It is up to the developer to build the interesting parts.

### Technology curation

Many decisions happen at the beginnings of projects. For example, a developer must decide on: a web framework, a database, UI component library, object relational mapper (ORM), CSS framework, authentication solution, validation library, payment solution, and other technologies relevant to the project.

This can be time consuming and lead to decision fatigue. In the JavaScript world, this is known as JavaScript fatigue. It is a phenomenon describing the overwhelming array of technology choices in the JavaScript ecosystem.

shadriz offers a preferred list of technologies to be used as a foundation for web app projects.

### Configuration automation

Typically, once the technologies are decided on, the next step is to wire everything together such that the application works as a cohesive whole. This means making sure the database connection is working, the UI component library is integrated properly into the framework code, and that integrations with external services are working.

Developers will often use libraries to handle common functionality such as authentication, data validations, and payments. However, setting these up can be challenging even for an experienced developer. shadriz provides an `init` command which allows you to choose from a short menu of features that you can add to your Next.js app. shadriz will write all the code necessary for the selected features.

By having a simple working example, you'll save time not having to build it entirely from scratch. You can customize the generated code to fit your project requirements. Additionally, shadriz will display a checklist of tasks to complete the initial configuration. The `init` command is intended to be run once at the beginning of a new project.

### Scaffold automation

Once the technologies are selected and configured, the next step is to begin building the actual app itself. Typically, this involves a number of tasks including creating the database tables, API endpoints or server actions, user interface, layouts, pages, and web forms. This process may involve referencing documentation and writing the "boilerplate" or "skeleton" code that the rest of the app will be built upon. This too is a time consuming process.

shadriz provides a `scaffold` command to automate the entire process of setting up the initial "skeleton" code. You only have to provide the table name along with the columns and data types. shadriz will generate the database migration files, back end code, and front end code for the provided database schema.

What is the purpose of the scaffolded code? It is to provide a fully working full stack Create Read Update Delete (CRUD) feature that you can use as a reference to build the rest of your app. The `scaffold` command is intended to be run as many times as you need to generate full stack scaffolding, typically at the beginning of a project. This automation is heavily inspired by the Ruby on Rails scaffold command.

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

Alternatively, you can use shadriz to generate a new Next.js project using the recommended settings:

```
npx shadriz@latest new my-app
```

### Step 2: Run the CLI

Run the `shadriz init` command to setup your project.

```bash
npx shadriz@latest init
```

### Step 3: Configure project

You will be asked a few questions to configure the app.

```
? Which package manager do you want to use? npm
? Do you want to install latest packages or pinned packages? pinned
? Which database dialect would you like to use? sqlite
? Which primary key generation strategy would you like to use? cuid2
? Which authentication solution do you want to use? authjs
? Which auth providers would you like to use? github, google, credentials
? Which session strategy would you like to use? database
? Do you want to add an admin dashboard with role-based authorization? yes
? Do you want to add Stripe for payments? yes
? Do you want to add a dark mode toggle? yes
```

Alternatively, you can also run the command non-interactively:

```
npx shadriz@latest init -p npm --latest --db-dialect sqlite -pk cuid2 --auth-solution authjs --auth-providers github,google,credentials --session-strategy database --admin --stripe --dark-mode
```

### Step 4: Project checklist

After initialization, you will be prompted to complete a few additional checklist items depending on the options you chose. For example:

- Update secrets in `.env.local`.
- Run database migrations.
- Set up the auth providers.
- Create a test user.
- Grant admin privilege.
- Set up Stripe.

## Scaffold

After the initial configuration is completed, you can scaffold full stack features with the `scaffold` command.

This command will generate the user interface, database migration and schema, server actions, server components, and client components of a full stack feature.

The `-c` option takes a space-separated string of column configurations in the following format: `column_name:datatype`.

The `id` field is automatically generated by shadriz, and should be omitted from the command.

The `created_at` and `updated_at` timestamps are also automatically generated.

After scaffolding, you can review the schema and make any necessary changes before running the database migrations.

## Scaffold examples

For example, this command generates a typical blog application:

### sqlite example

```bash
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:text
```

### postgresql example

```bash
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:timestamp
```

### mysql example

```bash
npx shadriz@latest scaffold post -c title:varchar content:text is_draft:boolean published_at:timestamp
```

## Data types

**postgresql data types**

integer, smallint, bigint, serial, smallserial, bigserial, boolean, text, varchar, char, numeric, decimal, real, doublePrecision, json, jsonb, time, timestamp, date, uuid

**mysql data types**

int, tinyint, smallint, mediumint, bigint, real, decimal, double, float, serial, binary, varbinary, char, varchar, text, boolean, date, datetime, time, year, timestamp, json

**sqlite data types**

integer, real, text, boolean, bigint

## Primary key generation strategy

shadriz supports the following primary key generation strategies:

- `cuid2` - Uses the `@paralleldrive/cuid2` package
- `uuidv7` - Uses the `uuidv7` package
- `uuidv4` - Uses the `crypto` package
- `nanoid` - Uses the `nanoid` package

The strategy that you choose during the `init` process will be saved in `shadriz.config.json`. This will be used for the authentication, stripe, and scaffold schemas.

## Foreign key constraints

shadriz supports adding foreign key constraints using a special `references` data type.

### References Input

This will use an Input component that accepts a foreign key string.

```bash
npx shadriz@latest scaffold product_type -c type:text
npx shadriz@latest scaffold product -c product_type:references name:text
```

### References Combobox

This will use a Combobox component where you can search for and select the related item.

```bash
npx shadriz@latest scaffold product_type -c type:text
npx shadriz@latest scaffold product -c product_type:references_combobox name:text
```

### References Select

This will use a Select component where you can select from a dropdown list of items.

```bash
npx shadriz@latest scaffold product_type -c type:text
npx shadriz@latest scaffold product -c product_type:references_select name:text
```

## File and image uploads

shadriz supports the following special data types:

- `file` - creates a text db column to store the file path along with a basic ui for file uploads to the file system
- `image` - creates a text db column to store the file path along with a basic ui for image uploads to the file system

Example:

```bash
npx shadriz@latest scaffold media -c pdf:file thumbnail:image description:text
```

## Auth

If auth was enabled during initialization, you will be able to scaffold using a `private` authorization level. These pages along with the server actions will require a user to be authenticated to access.

shadriz provides a `create-user.ts` script to create test users. This script is only generated if `credentials` is chosen as a provider.

In addition, shadriz provides a `SESSION_STRATEGY` variable in `auth.ts` that allows you to use either the `jwt` or `database` session strategy with any auth provider.

You can easily switch strategy with one line of code.

Warning: if you only use `credentials`, Auth.js will limit you to the `jwt` strategy.

### Private Dashboard

If auth was enabled, users will be able to sign in and access a user dashboard at `/dashboard`.

Any pages scaffolded with a `private` authorization level will be placed into the the `(private)` route group.

After running a private scaffold, a new link to the resource list page will be added to `dashboard-sidebar.tsx`.

Users can sign in at `/signin`.

### Admin Dashboard

If admin was enabled, users with the `admin` role will be able to access the admin dashboard at `/admin`. The admin login is at `/admin-login`.

You will be able to scaffold using an `admin` authorization level. The pages will be put into the `(admin)` route group. These pages along with the server actions will require a user with the `admin` role to access.

After running an admin scaffold, a new link to the resource list page will be added to `admin-sidebar.tsx`.

A `grant-admin.ts` script is provided to grant users the admin role.

Additional roles can be added to the `users_roles` table according to project needs. Additional access control functions can be added to `authorization.ts` and used throughout the application.

## Stripe

If Stripe was enabled during initialization, all the code needed for a simple one-time purchase and monthly subscription model will be generated. This includes the webhook, checkout session, and customer portal api endpoints.

Also, a basic pricing page with the one-time purchase and subscription is included. A `create-price.ts` script is provided to create the initial products on Stripe and on the local database.

The file `access.ts` contain utility functions to check user access to products and subscriptions. You can use this as you build out the paywall for the paid features.

Any of the code and content can be changed to fit your business model. The goal of this Stripe automation is to provide a fully functional example to use as a starting point.

## Naming conventions

shadriz uses naming conventions as described in the table below. Number and case transformations will be applied to the generated code.

| Generated Code                     | Number           | Case         | Example                 |
| :--------------------------------- | :--------------- | :----------- | ----------------------- |
| Class names                        | singular         | pascal case  | FooBar                  |
| Database table names               | plural           | snake case   | foo_bars                |
| Database column names              | original         | snake case   | foo_bar                 |
| Database foreign keys              | singular         | snake case   | foo_bar_id              |
| Drizzle table variable names       | plural           | camel case   | fooBars                 |
| Drizzle column property names      | original         | camel case   | fooBar                  |
| Drizzle foreign key property names | singular         | camel case   | fooBarId                |
| Drizzle findMany variable names    | singular         | camel case   | fooBarList              |
| Drizzle findFirst variable names   | singular         | camel case   | fooBar                  |
| File names                         | singular, plural | kebab case   | foo-bar.ts, foo-bars.ts |
| Form input names                   | original         | camel case   | fooBar                  |
| React array props                  | singular         | camel case   | fooBarList              |
| React object props                 | singular         | camel case   | fooBar                  |
| URL pathnames                      | singular, plural | kebab case   | /foo-bar, /foo-bars     |
| Query string parameters            | original         | camel case   | ?fooBar=baz             |
| UI table and column names          | singular, plural | capital case | Foo Bar, Foo Bars       |

## FAQ

**What can I build with shadriz?**

shadriz is ideal for full stack monolithic server side rendered web applications.

Here are a few example use cases: blog, software as a service app, course platform, content website, digital product shop, social media app, bespoke ecommerce systems.

It is a full stack tool kit that automates away the time consuming things you need to do at the start of a new full stack Next.js project, saving you days worth of boilerplate coding.

**What is a scaffold?**

A scaffold is all of the starter code, including the UI and data layer, that is required to have a fully functional CRUD (Create Read Update Delete) application. Scaffolding was popular in MVC (Model View Controller) frameworks such as Ruby on Rails.

This was helpful as it saved time setting up the initial boilerplate of an application. It also served as a starting reference point for building out the actual web app. This is useful for people or organizations who start many projects.

With scaffolding, you spend less time looking things up because there is a point of reference to build upon. This frees up time and energy to focus on the service layer, which usually requires more custom business logic beyond basic CRUD.

**Why not a web framework?**

Next.js is the underlying web framework. However, despite all of the conveniences it offers, you still have to write a significant amount of boilerplate code when you start a project from a fresh Next.js installation.

shadriz differs in that it provides an opinionated abstraction for creating a solid starting point for app development. shadriz works by writing code to a new Next.js project.

You own the code so you can customize it according to your project requirements. The code is written to your Next.js repo and you can review it before committing to anything.

**Why not a boilerplate?**

Boilerplates go obsolete fast. Within a few months, many of your dependencies may already be behind the latest version.

That is why shadriz offers a `latest` option to install latest dependencies. This means you'll get the latest version of Drizzle ORM, shadcn/ui components, Auth.js, Stripe, TailwindCSS, Zod, and more.

If you prefer a more stable version, choose the `pinned` option during initialization and you'll get the pinned versions of each top-level dependency. The pinned versions can be found in `package-shadriz.json` in the shadriz GitHub repo.

The other problem with boilerplates is that it is usually a static hard-coded repo. It can't generate unique database schemas and user interfaces specific to your project.

## Technology and Inspiration

shadriz is inspired by a wide range of tools and technologies.

### Ruby on Rails

**Convention over configuration**

Nostalgia for Ruby on Rails style development is one motivation that led to the creation of shadriz. Specifically, the `shadriz scaffold` command was modeled after the `rails scaffold` command.

With a predefined set of conventions, you'll spend less time configuring things, and more time building.

Having standard conventions will prevent wasted time deciding on subjective preferences.

### Next.js

**Server components and server actions**

Many of the full stack patterns used in shadriz are based on the official Next.js documentation.

Server side rendering and interaction is recommended to reduce client side computation and improve performance.

Next.js provides many conveniences out of the box, such as file system routing, server side rendering, code bundling, and more.

### shadcn/ui

**Non-dependency and customizability**

shadcn/ui is the CLI tool that copies and pastes beautifully styled components into your projects.

Similarly, shadriz generates full stack components into your Next.js project. You have full control of the code that is generated instead of the code being hidden behind an external package.

This approach is the perfect balance of good defaults combined with flexibility of customization.

### Drizzle ORM

**SQL-like and relational queries**

Drizzle ORM provides both SQL-like and relational queries, as well as schema generation and database migrations.

If you know SQL, you know Drizzle. If you prefer an ORM, you can use their query API. Drizzle always outputs 1 query.

shadriz generates the configuration files required to start using Drizzle ORM. shadriz also generates the database schemas and migrations for the full stack scaffolding.

### TailwindCSS

**Development speed and composability**

TailwindCSS is a CSS framework which provides reusable utility classes.

TailwindCSS simplifies and improves scalability of styling by coupling markup with style. While this may seem counter-intuitive to the idea of separation-of-concern, the trade-offs are usually worth it in most projects.

Furthermore, TailwindCSS is enabled by default in Next.js projects and has become the standard CSS framework in many projects.

### Auth.js

**Open Source. Full Stack. Own Your Data.**

shadriz favors proven, open-source solutions that let you maintain control over your data.

Similarly, with shadriz, you own not only your data but also your code.

### Zod

**TypeScript-first schema validation**

shadriz uses `zod` and `drizzle-zod` for data validations. Each server action that is generated by the scaffolding tool will also contain zod validations to check for the correctness of data being submitted.

`drizzle-zod` automatically creates a zod schema based on a drizzle table. This reduces boilerplate. However, if specific validations are needed, the generated zod schemas can be extended to have custom validation rules.

## Author

Built by [travisluong](https://www.travisluong.com).

## License

MIT
