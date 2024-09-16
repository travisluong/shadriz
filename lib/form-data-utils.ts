import { caseFactory } from "./case-utils";

export const formDataUtils = {
  integer(col: string): string {
    return `    ${col}: parseInt(formData.get("${col}") as string),`;
  },

  boolean(col: string): string {
    return `    ${col}: !!formData.get("${col}"),`;
  },

  string(col: string): string {
    return `    ${col}: formData.get("${col}") as string,`;
  },

  json(col: string): string {
    return `    ${col}: formData.get("${col}") ? JSON.parse(formData.get("${col}") as string) : "",`;
  },

  date(col: string): string {
    return `    ${col}: new Date(formData.get("${col}") as string),`;
  },

  float(col: string): string {
    return `    ${col}: parseFloat(formData.get("${col}") as string),`;
  },

  bigint(col: string): string {
    return `    ${col}: BigInt(formData.get("${col}") as string),`;
  },

  references(col: string): string {
    return `    ${col}_id: (formData.get("${col}_id") as string) || null,`;
  },

  image(col: string): string {
    return `    ${col}: ${caseFactory(col).singularCamelCase}UploadPath,`;
  },

  file(col: string): string {
    return `    ${col}: ${caseFactory(col).singularCamelCase}UploadPath,`;
  },
};
