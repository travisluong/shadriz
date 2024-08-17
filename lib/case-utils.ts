import pluralize from "pluralize";
import * as changeCase from "change-case";

interface Cases {
  original: string;
  originalCamelCase: string;
  capitalCase: string;
  singularCapitalCase: string;
  pluralCapitalCase: string;
  singularSnakeCase: string;
  singularCamelCase: string;
  singularPascalCase: string;
  singularKebabCase: string;
  pluralSnakeCase: string;
  pluralCamelCase: string;
  pluralPascalCase: string;
  pluralKebabCase: string;
}

const cache: { [key: string]: Cases } = {};

export function caseFactory(str: string) {
  if (str in cache) {
    return cache[str];
  }

  const obj = {
    original: str,
    originalCamelCase: changeCase.camelCase(str),
    capitalCase: changeCase.capitalCase(str),
    singularCapitalCase: changeCase.capitalCase(pluralize.singular(str)),
    pluralCapitalCase: changeCase.capitalCase(pluralize.plural(str)),
    singularSnakeCase: changeCase.snakeCase(pluralize.singular(str)),
    singularCamelCase: changeCase.camelCase(pluralize.singular(str)),
    singularPascalCase: changeCase.pascalCase(pluralize.singular(str)),
    singularKebabCase: changeCase.kebabCase(pluralize.singular(str)),
    pluralSnakeCase: changeCase.snakeCase(pluralize.plural(str)),
    pluralCamelCase: changeCase.camelCase(pluralize.plural(str)),
    pluralPascalCase: changeCase.pascalCase(pluralize.plural(str)),
    pluralKebabCase: changeCase.kebabCase(pluralize.plural(str)),
  };

  cache[str] = obj;

  return obj;
}
