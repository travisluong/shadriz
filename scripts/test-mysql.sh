SHADRIZZ_PATH="$HOME/code/shadrizz/index.ts"

shadrizz() {
    tsx "$SHADRIZZ_PATH" "$@"
}

mysqlsh.exe -u root -e "drop database demo;" --sql
mysqlsh.exe -u root -e "create database demo;" --sql
rm -rf ~/code/demo-mysql
cd ~/code
shadrizz new demo-mysql -p pnpm --latest
cd demo-mysql
shadrizz init -p pnpm --latest --db-dialect mysql -pk uuidv7 --auth-solution authjs --auth-providers github,google,postmark,nodemailer,credentials --admin
cp ~/code/shadrizz-env/.env.local.mysql .env.local
shadrizz add tiptap
shadrizz scaffold -a admin admin_scaffold -c int_type:int tinyint_type:tinyint smallint_type:smallint mediumint_type:mediumint bigint_type:bigint real_type:real decimal_type:decimal double_type:double float_type:float char_type:char varchar_type:varchar text_type:text boolean_type:boolean date_type:date datetime_type:datetime time_type:time year_type:year timestamp_type:timestamp json_type:json file_type:file
shadrizz scaffold -a private private_scaffold -c text_field:text integer_field:int real_field:real decimal_field:decimal boolean_field:boolean file_field:file timestamp_field:timestamp
shadrizz scaffold -a public public_scaffold -c text_field:text integer_field:int real_field:real decimal_field:decimal boolean_field:boolean file_field:file timestamp_field:timestamp
shadrizz scaffold -a admin post_status -c status:varchar
shadrizz scaffold -a admin post -c post_status:references_select title:varchar likes:int published_at:timestamp content:text_tiptap
# shadrizz add stripe 
npm run generate
npm run migrate
npx tsx scripts/create-user.ts user@example.com pw
npx tsx scripts/create-user.ts admin@example.com pw
npx tsx scripts/grant-admin.ts admin@example.com
# npx tsx scripts/create-price.ts
npm run build
npm run start