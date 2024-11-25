SHADRIZZ_PATH="$HOME/code/shadrizz/index.ts"

shadrizz() {
    tsx "$SHADRIZZ_PATH" "$@"
}

PGPASSWORD=postgres dropdb -p 5433 -U postgres demo
PGPASSWORD=postgres createdb -p 5433 -U postgres demo
rm -rf ~/code/demo-postgresql
cd ~/code
shadrizz new demo-postgresql -p pnpm --latest
cd demo-postgresql
shadrizz init -p pnpm --latest --db-dialect postgresql -pk auto_increment --auth-solution none
cp ~/code/shadrizz-env/.env.local.postgresql .env.local
shadrizz add tiptap
shadrizz scaffold -a public admin_scaffold -c integer_type:integer smallint_type:smallint bigint_type:bigint serial_type:serial bigserial_type:bigserial boolean_type:boolean text_type:text varchar_type:varchar char_type:char numeric_type:numeric decimal_type:decimal real_type:real double_precision_type:doublePrecision json_type:json jsonb_type:jsonb time_type:time timestamp_type:timestamp: date_type:date file_type:file
shadrizz scaffold -a public private_scaffold -c text_field:text integer_field:integer real_field:real decimal_field:decimal boolean_field:boolean file_field:file timestamp_field:timestamp
shadrizz scaffold -a public public_scaffold -c text_field:text integer_field:integer real_field:real decimal_field:decimal boolean_field:boolean file_field:file timestamp_field:timestamp
shadrizz scaffold -a public post_status -c status:text
shadrizz scaffold -a public post -c post_status_id:references_select title:text likes:integer published_at:timestamp content:text_tiptap
npm run generate
npm run migrate
npm run build
npm run start