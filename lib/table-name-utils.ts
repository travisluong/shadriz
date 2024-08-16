import pluralize from "pluralize";
import * as changeCase from "change-case";

export function tableNameFactory(table: string) {
  return {
    original: table,
    singularSnakeCase: changeCase.snakeCase(pluralize.singular(table)),
    singularCamelCase: changeCase.camelCase(pluralize.singular(table)),
    singularPascalCase: changeCase.pascalCase(pluralize.singular(table)),
    singularKebabCase: changeCase.kebabCase(pluralize.singular(table)),
    pluralSnakeCase: changeCase.snakeCase(pluralize.plural(table)),
    pluralCamelCase: changeCase.camelCase(pluralize.plural(table)),
    pluralPascalCase: changeCase.pascalCase(pluralize.plural(table)),
    pluralKebabCase: changeCase.kebabCase(pluralize.plural(table)),
  };
}
