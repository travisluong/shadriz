import { expect, test } from "vitest";
import { tableNameFactory } from "../lib/table-name-utils";

test("table name utils", () => {
  const tableNameVars = tableNameFactory("foo_bar");
  console.log(tableNameVars);
  expect(tableNameVars.original).toBe("foo_bar");
  expect(tableNameVars.singularSnakeCase).toBe("foo_bar");
  expect(tableNameVars.singularCamelCase).toBe("fooBar");
  expect(tableNameVars.singularPascalCase).toBe("FooBar");
  expect(tableNameVars.singularKebabCase).toBe("foo-bar");
  expect(tableNameVars.pluralSnakeCase).toBe("foo_bars");
  expect(tableNameVars.pluralCamelCase).toBe("fooBars");
  expect(tableNameVars.pluralPascalCase).toBe("FooBars");
  expect(tableNameVars.pluralKebabCase).toBe("foo-bars");
});
