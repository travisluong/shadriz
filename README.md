# shadrizz

## Full Stack [TypeScript](https://www.typescriptlang.org) Scaffolding Framework

Build [Next.js](https://nextjs.org/) Apps Easier and Faster With:

✅ [shadcn/ui](https://ui.shadcn.com/) - Customizable Components<br>
✅ [Drizzle ORM](https://orm.drizzle.team/) - Database Migrations and Queries<br>
✅ [Ruby on Rails Inspired](https://rubyonrails.org/) - Scaffold Automations<br>
✅ [Auth.js](https://authjs.dev/) - Authentication and Authorization<br>
✅ [Django Inspired](https://www.djangoproject.com/) - Admin Dashboard<br>
✅ [Zod](https://zod.dev/) - Data Validation

## Documentation

https://www.shadrizz.com/docs

## Introduction

shadrizz is a full stack automation tool for building TypeScript web applications. This is an ephemeral web framework. You do not install it into your project as a dependency. It is a command line interface code generation tool. You use it to generate customizable code for full stack projects. You can scaffold database schemas and user interfaces to use as a reference to build your own full stack application.

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
