SHADTS_PATH="$HOME/code/shadts/index.ts"

shadts() {
    tsx "$SHADTS_PATH" "$@"
}

PGPASSWORD=postgres dropdb -p 5433 -U postgres demo
PGPASSWORD=postgres createdb -p 5433 -U postgres demo
rm -rf ~/code/demo-postgresql
cd ~/code
shadts new demo-postgresql -p bun --latest
cd demo-postgresql
shadts init -p bun --latest --db-dialect postgresql -pk cuid2 --auth-solution authjs --auth-providers github,google,postmark,nodemailer,credentials --admin
cp ~/code/shadts-env/.env.local.postgresql .env.local
shadts add tiptap
shadts scaffold -a admin admin_scaffold -c integer_type:integer smallint_type:smallint bigint_type:bigint serial_type:serial bigserial_type:bigserial boolean_type:boolean text_type:text varchar_type:varchar char_type:char numeric_type:numeric decimal_type:decimal real_type:real double_precision_type:doublePrecision json_type:json jsonb_type:jsonb time_type:time timestamp_type:timestamp: date_type:date file_type:file
shadts scaffold -a private private_scaffold -c text_field:text integer_field:integer real_field:real decimal_field:decimal boolean_field:boolean file_field:file timestamp_field:timestamp
shadts scaffold -a public public_scaffold -c text_field:text integer_field:integer real_field:real decimal_field:decimal boolean_field:boolean file_field:file timestamp_field:timestamp
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