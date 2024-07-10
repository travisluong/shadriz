#!/bin/bash
npx create-next-app $1 --ts --eslint --tailwind --app --no-src-dir --no-import-alias
cd $1
npm i drizzle-orm --legacy-peer-deps
npm i -D drizzle-kit
npm i dotenv uuidv7
npm i zod
npm i drizzle-zod
npm i @tanstack/react-table
npx shadcn-ui@latest init -y -d
npx shadcn-ui@latest add -y -o table
npx shadcn-ui@latest add -y -o label
npx shadcn-ui@latest add -y -o input
npx shadcn-ui@latest add -y -o button
npx shadcn-ui@latest add -y -o textarea
