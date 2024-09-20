import pluralize from "pluralize";
import { Case } from "change-case-all";

export interface Cases {
  original: string;
  originalCamelCase: string;
  originalCapitalCase: string;
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
    originalCamelCase: Case.camel(str),
    originalCapitalCase: Case.capital(str),
    singularCapitalCase: Case.capital(pluralize.singular(str)),
    pluralCapitalCase: Case.capital(pluralize.plural(str)),
    singularSnakeCase: Case.snake(pluralize.singular(str)),
    singularCamelCase: Case.camel(pluralize.singular(str)),
    singularPascalCase: Case.pascal(pluralize.singular(str)),
    singularKebabCase: Case.kebab(pluralize.singular(str)),
    pluralSnakeCase: Case.snake(pluralize.plural(str)),
    pluralCamelCase: Case.camel(pluralize.plural(str)),
    pluralPascalCase: Case.pascal(pluralize.plural(str)),
    pluralKebabCase: Case.kebab(pluralize.plural(str)),
  };

  cache[str] = obj;

  return obj;
}
