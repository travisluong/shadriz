import { expect, test } from "vitest";
import { caseFactory } from "../lib/case-utils";

test("case utils", () => {
  const caseObj = caseFactory("foo_bar", { pluralize: true });
  expect(caseObj.original).toBe("foo_bar");
  expect(caseObj.originalCamelCase).toBe("fooBar");
  expect(caseObj.originalCapitalCase).toBe("Foo Bar");
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

test("case utils with id", () => {
  const caseObj = caseFactory("foo_bar_id", { pluralize: true });
  expect(caseObj.singularCamelCase).toBe("fooBarId");
});

test("case utils with pluralize disabled", () => {
  const caseObj = caseFactory("foo_bar", { pluralize: false });
  expect(caseObj.original).toBe("foo_bar");
  expect(caseObj.originalCamelCase).toBe("fooBar");
  expect(caseObj.originalCapitalCase).toBe("Foo Bar");
  expect(caseObj.pluralCapitalCase).toBe("Foo Bar");
  expect(caseObj.singularCapitalCase).toBe("Foo Bar");
  expect(caseObj.singularSnakeCase).toBe("foo_bar");
  expect(caseObj.singularCamelCase).toBe("fooBar");
  expect(caseObj.singularPascalCase).toBe("FooBar");
  expect(caseObj.singularKebabCase).toBe("foo-bar");
  expect(caseObj.pluralSnakeCase).toBe("foo_bar");
  expect(caseObj.pluralCamelCase).toBe("fooBar");
  expect(caseObj.pluralPascalCase).toBe("FooBar");
  expect(caseObj.pluralKebabCase).toBe("foo-bar");
});
