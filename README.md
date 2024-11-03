# shadriz

Full Stack TypeScript Scaffolding Framework

Build Next.js Apps Faster With:<br>
✅ Ruby on Rails Inspired Scaffolding Automations<br>
✅ shadcn/ui Inspired Customizable Components<br>
✅ Django Inspired Admin Dashboard

[Docs](https://travisluong.github.io/shadriz)

## Quick Start

### Step 1: Create new project

Start by creating a new Next.js project using `create-next-app`.

```bash
npx create-next-app@latest my-app --typescript --eslint --tailwind --app --no-src-dir --no-import-alias --turbopack
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
? Do you want to add an admin dashboard with role-based authorization? yes
```

### Step 4: Project checklist

After initialization, you will be prompted to complete a few additional checklist items depending on the options you chose. For example:

- Update secrets in `.env.local`.
- Run database migrations.
- Set up the auth providers.
- Create a test user.
- Grant admin privilege.

## Scaffold

```bash
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:timestamp
```

## Author

Built by [travisluong](https://www.travisluong.com).

## License

MIT
