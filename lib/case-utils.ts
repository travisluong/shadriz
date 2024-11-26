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

interface CaseFactoryOpts {
  pluralize: boolean;
}

const defaultOpts: CaseFactoryOpts = {
  pluralize: true,
};

export function caseFactory(str: string, opts: CaseFactoryOpts) {
  const mergedOpts: CaseFactoryOpts = {
    ...defaultOpts,
    ...opts,
  };

  let obj;

  if (mergedOpts.pluralize) {
    obj = {
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
  } else {
    obj = {
      original: str,
      originalCamelCase: Case.camel(str),
      originalCapitalCase: Case.capital(str),
      singularCapitalCase: Case.capital(str),
      pluralCapitalCase: Case.capital(str),
      singularSnakeCase: Case.snake(str),
      singularCamelCase: Case.camel(str),
      singularPascalCase: Case.pascal(str),
      singularKebabCase: Case.kebab(str),
      pluralSnakeCase: Case.snake(str),
      pluralCamelCase: Case.camel(str),
      pluralPascalCase: Case.pascal(str),
      pluralKebabCase: Case.kebab(str),
    };
  }

  return obj;
}
