SHADRIZZ_PATH="$HOME/code/shadrizz/index.ts"

shadrizz() {
    tsx "$SHADRIZZ_PATH" "$@"
}

rm -rf ~/code/demo-sqlite
cd ~/code
shadrizz new demo-sqlite -p pnpm --latest
cd ~/code/demo-sqlite
shadrizz init -p pnpm --latest \
    --db-dialect sqlite \
    -pk nanoid \
    --auth-solution authjs \
    --auth-providers github,google,postmark,nodemailer,credentials \
    --no-admin \
    --pluralize
cp ~/code/shadrizz-env/.env.local.sqlite .env.local
shadrizz add tiptap
shadrizz scaffold -a private private_scaffold -c text_type:text integer_type:integer real_type:real boolean_type:boolean file_type:file timestamp_type:timestamp
shadrizz scaffold -a public public_scaffold -c text_type:text integer_type:integer real_type:real boolean_type:boolean file_type:file timestamp_type:timestamp
shadrizz scaffold -a private category -c name:text
shadrizz scaffold -a private post -c category_id:references_select title:text likes:integer published_at:timestamp content:text_tiptap
# shadrizz add stripe
npm run generate
npm run migrate
npx tsx scripts/create-user.ts user@example.com pw
npx tsx scripts/create-user.ts admin@example.com pw
# npx tsx scripts/grant-admin.ts admin@example.com
# npx tsx scripts/create-price.ts
npm run build
npm run start