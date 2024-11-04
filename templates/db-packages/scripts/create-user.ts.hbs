import { users } from "@/schema/users";
import bcrypt from "bcrypt";
import { openConnection } from "./sdb";

async function main() {
  const { sdb, closeConnection } = await openConnection();
  const email = process.argv[2];
  const password = process.argv[3];
  const hash = bcrypt.hashSync(password, 10);
  await sdb.insert(users).values({ email: email, password: hash, role: "user" });
  console.log("created user " + email);
  await closeConnection();
}

main();
