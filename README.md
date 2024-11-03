# shad.ts

Full Stack TypeScript Scaffolding Framework

Build Next.js Apps Easier and Faster With:

✅ Automated Scaffolding<br>
✅ Customizable Full Stack Components<br>
✅ Authentication and Authorization<br>
✅ Admin Dashboard<br>
✅ Type Safety<br>

[Documentation](https://www.shadts.com)

## Quick Start

### Step 1: Create new project

Start by creating a new Next.js project using `create-next-app`.

```bash
npx create-next-app@latest my-app --typescript --eslint --tailwind --app --no-src-dir --no-import-alias --turbopack
```

### Step 2: Run the CLI

Run the `shadts init` command to setup your project.

```bash
npx shadts@latest init
```

### Step 3: Configure project

You will be asked a few questions to configure the app:

```
? Which package manager do you want to use? npm
? Do you want to install latest packages or pinned packages? pinned
? Which database dialect would you like to use? sqlite
? Which primary key generation strategy would you like to use? cuid2
? Which authentication solution do you want to use? authjs
? Which auth providers would you like to use? credentials
? Do you want to add an admin dashboard with role-based authorization? yes
```

### Step 4: Project checklist

After initialization, you will be prompted to complete a few additional checklist items.

Generate and run the drizzle migrations:

```bash
npm run generate
npm run migrate
```

Create a test user and grant admin role:

```bash
npx tsx scripts/create-user.ts user@example.com password123
npx tsx scripts/grant-admin.ts user@example.com
```

### Step 5: Run the dev server

```bash
npm run dev
```

## Step 6: Scaffold an app

```bash
npx shadts@latest scaffold post -c title:text content:text is_draft:boolean published_at:timestamp
```

## Author

Built by [travisluong](https://www.travisluong.com).

## License

MIT
