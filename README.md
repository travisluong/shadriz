# shadrizz

Full Stack TypeScript Scaffolding Framework

Build Next.js Apps Easier and Faster With:

✅ Automated Scaffolding<br>
✅ Customizable Full Stack Components<br>
✅ Authentication and Authorization<br>
✅ Admin Dashboard<br>
✅ Type Safety<br>

## Documentation

https://www.shadrizz.com/docs

## Introduction

shadrizz is a full stack automation tool for building TypeScript web applications. This is an ephemeral web framework. You do not install it into your project as a dependency. It is a command line interface code generation tool. You use it to generate customizable code for full stack projects. You can scaffold database schemas and user interfaces to use as a reference to build your own full stack application.

## Tech stack

- [TypeScript](https://www.typescriptlang.org) - JavaScript With Types
- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Drizzle ORM](https://orm.drizzle.team/) - Object Relational Mapper
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Auth.js](https://authjs.dev/) - Authentication
- [Stripe](https://www.stripe.com) - Payments
- [zod](https://zod.dev/) - Validation

## Usage

New:

```
npx shadrizz@latest new my-app
```

Init:

```
npx shadrizz@latest init
```

Scaffold:

```
npx shadrizz@latest scaffold post -c title:text content:text_tiptap is_draft:boolean published_at:timestamp

npx shadrizz@latest scaffold tags -c name:text

npx shadrizz@latest scaffold posts_tags -c post:references tag:references
```

Add:

```
npx shadrizz@latest add tiptap
```

Join:

```
npx shadrizz@latest join posts posts_tags tags
```

## License

MIT
