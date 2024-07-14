import { test, expect } from "vitest";
import { ScaffoldProcessor } from "../lib/scaffold-processor";
import { SqliteDialectStrategy } from "../db-dialects/sqlite-dialect-strategy";

test("common fk arg handler", () => {
  const strategy = new SqliteDialectStrategy();
  const s = new ScaffoldProcessor({
    table: "post",
    columns: ["id:serial:pk", "user_id:bigint:fk-users.id", "title:text"],
    dbDialectStrategy: strategy,
  });
  const res = s.commonFkArgHandler(["fk-users.id"]);
  expect(res).toBe(".references(() => users.id)");
});

test("includes item that starts with pk", () => {
  const strategy = new SqliteDialectStrategy();
  const s = new ScaffoldProcessor({
    table: "post",
    columns: ["id:serial:pk", "user_id:bigint:fk-users.id", "title:text"],
    dbDialectStrategy: strategy,
  });
  const res = s.includesItemThatStartsWithPk(["id", "serial", "pk"]);
  expect(res).toBe(true);
  const res2 = s.includesItemThatStartsWithPk(["user_id:bigint:fk-users.id"]);
  expect(res2).toBe(false);
});
