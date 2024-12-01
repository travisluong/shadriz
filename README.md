# shadrizz

## Full Stack TypeScript Scaffolding Framework

Build [Next.js](https://nextjs.org/) Apps Easier and Faster With:

✅ [shadcn/ui](https://ui.shadcn.com/) - Customizable Components<br>
✅ [Drizzle ORM](https://orm.drizzle.team/) - Database Migrations and Queries<br>
✅ [Ruby on Rails Inspired](https://rubyonrails.org/) - Scaffold Automations<br>
✅ [Auth.js](https://authjs.dev/) - Authentication and Authorization<br>
✅ [Django Inspired](https://www.djangoproject.com/) - Admin Dashboard<br>
✅ [Zod](https://zod.dev/) - Data Validation

## Documentation

https://docs.shadrizz.com

## Introduction

shadrizz is a full stack automation tool for building TypeScript web applications. This is an ephemeral web framework. You do not install it into your project as a dependency. It is a command line interface code generation tool. You use it to generate customizable code for full stack projects. You can scaffold database schemas and user interfaces to use as a reference to build your own full stack application.

## Usage Examples

Create a new Next.js app using the required configurations:

```
npx shadrizz@latest new my-app
```

Initialize shadrizz after changing into the app directory:

```
cd my-app
npx shadrizz@latest init
```

Scaffold a CRUD application:

```
npx shadrizz@latest scaffold post -c title:text content:text is_draft:boolean published_at:timestamp
npx shadrizz@latest scaffold tags -c name:text
npx shadrizz@latest scaffold posts_tags -c post_id:references tag_id:references
```

Add an optional add-on extension:

```
npx shadrizz@latest add stripe
npx shadrizz@latest add tiptap
```

## License

MIT
