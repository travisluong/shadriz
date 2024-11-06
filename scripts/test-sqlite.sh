SHADRIZZ_PATH="$HOME/code/shadrizz/index.ts"

shadrizz() {
    tsx "$SHADRIZZ_PATH" "$@"
}

rm -rf ~/code/demo-sqlite
cd ~/code
shadrizz new demo-sqlite -p pnpm --latest
cd ~/code/demo-sqlite
shadrizz init -p pnpm --latest --db-dialect sqlite -pk cuid2 --auth-solution authjs --auth-providers github,google,postmark,nodemailer,credentials --admin
cp ~/code/shadrizz-env/.env.local.sqlite .env.local
shadrizz add tiptap
shadrizz scaffold -a admin admin_scaffold -c integer_type:integer real_type:real text_type:text boolean_type:boolean timestamp_type:timestamp file_type:file
shadrizz scaffold -a private private_scaffold -c text_field:text integer_field:integer real_field:real boolean_field:boolean file_field:file timestamp_field:timestamp
shadrizz scaffold -a public public_scaffold -c text_field:text integer_field:integer real_field:real boolean_field:boolean file_field:file timestamp_field:timestamp
shadrizz scaffold -a admin category -c title:text
shadrizz scaffold -a admin post_status -c status:text
shadrizz scaffold -a admin post -c category:references_combobox post_status:references_select title:text likes:integer published_at:timestamp content:text_tiptap
shadrizz scaffold -a admin tags -c name:text
shadrizz scaffold -a admin posts_tags -c post:references tag:references
shadrizz join -a admin posts posts_tags tags
npm run generate
npm run migrate
npx tsx scripts/create-user.ts user@example.com pw
npx tsx scripts/create-user.ts admin@example.com pw
npx tsx scripts/grant-admin.ts admin@example.com
npm run build
npm run start