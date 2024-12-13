SHADRIZZ_PATH="$HOME/code/shadrizz/index.ts"

shadrizz() {
    tsx "$SHADRIZZ_PATH" "$@"
}

rm -rf ~/code/shadrizz-demo
cd ~/code
shadrizz new shadrizz-demo -p pnpm --latest
cd ~/code/shadrizz-demo
shadrizz init -p pnpm --latest \
    --db-dialect sqlite \
    -pk cuid2 \
    --auth-solution authjs \
    --auth-providers credentials \
    --admin \
    --pluralize
cp ~/code/shadrizz-env/.env.local.sqlite .env.local
shadrizz add tiptap
shadrizz scaffold -a admin category -c name:text
shadrizz scaffold -a admin post -c category_id:references_select title:text published_at:timestamp content:text_tiptap
shadrizz scaffold -a admin contact_message -c name:text email:text message:text
shadrizz scaffold -a private todo -c user_id:references title:text completed:boolean
shadrizz scaffold -a private note -c user_id:references title:text content:text_tiptap
shadrizz scaffold -a public contact_message -c name:text email:text message:text
# shadrizz add stripe
npm run generate
npm run migrate
npx tsx scripts/create-user.ts test@example.com pw
npx tsx scripts/grant-admin.ts test@example.com
# npx tsx scripts/create-price.ts
npm run build
npm run start