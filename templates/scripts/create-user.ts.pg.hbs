import { user } from "@/schema/user";
import bcrypt from "bcrypt";
import { client, sdb } from "./sdb";

async function main() {
  await client.connect();
  const email = process.argv[2];
  const password = process.argv[3];
  const hash = bcrypt.hashSync(password, 10);
  await sdb.insert(user).values({ email: email, password: hash });
  await client.end();
}

main();
