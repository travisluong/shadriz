SHADTS_PATH="$HOME/code/shadts/index.ts"

shadts() {
    tsx "$SHADTS_PATH" "$@"
}

rm -rf ~/code/demo-sqlite
cd ~/code
shadts new demo-sqlite -p bun --latest
cd ~/code/demo-sqlite
shadts init -p bun --latest --db-dialect sqlite -pk cuid2 --auth-solution authjs --auth-providers github,google,postmark,nodemailer,credentials --admin
cp ~/code/shadts-env/.env.local.sqlite .env.local
shadts add tiptap
shadts scaffold -a admin admin_scaffold -c integer_type:integer real_type:real text_type:text boolean_type:boolean bigint_type:bigint timestamp_type:timestamp file_type:file
shadts scaffold -a private private_scaffold -c text_field:text integer_field:integer real_field:real boolean_field:boolean file_field:file timestamp_field:timestamp
shadts scaffold -a public public_scaffold -c text_field:text integer_field:integer real_field:real boolean_field:boolean file_field:file timestamp_field:timestamp
shadts scaffold -a admin category -c title:text
shadts scaffold -a admin post_status -c status:text
shadts scaffold -a admin post -c category:references_combobox post_status:references_select title:text likes:integer published_at:timestamp content:text_tiptap
shadts scaffold -a admin tags -c name:text
shadts scaffold -a admin posts_tags -c post:references tag:references
shadts join -a admin posts posts_tags tags
npm run generate
npm run migrate
npx tsx scripts/create-user.ts user@example.com pw
npx tsx scripts/create-user.ts admin@example.com pw
npx tsx scripts/grant-admin.ts admin@example.com
npm run dev