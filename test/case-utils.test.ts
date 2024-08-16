import { expect, test } from "vitest";
import { caseFactory } from "../lib/case-utils";

test("case utils", () => {
  const caseObj = caseFactory("foo_bar");
  expect(caseObj.original).toBe("foo_bar");
  expect(caseObj.capitalCase).toBe("Foo Bar");
  expect(caseObj.pluralCapitalCase).toBe("Foo Bars");
  expect(caseObj.singularCapitalCase).toBe("Foo Bar");
  expect(caseObj.singularSnakeCase).toBe("foo_bar");
  expect(caseObj.singularCamelCase).toBe("fooBar");
  expect(caseObj.singularPascalCase).toBe("FooBar");
  expect(caseObj.singularKebabCase).toBe("foo-bar");
  expect(caseObj.pluralSnakeCase).toBe("foo_bars");
  expect(caseObj.pluralCamelCase).toBe("fooBars");
  expect(caseObj.pluralPascalCase).toBe("FooBars");
  expect(caseObj.pluralKebabCase).toBe("foo-bars");
});
