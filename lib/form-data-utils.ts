import { caseFactory } from "./case-utils";

export const formDataUtils = {
  integer(col: string): string {
    return `    ${col}: formData.get("${col}") ? parseInt(formData.get("${col}") as string) : null,`;
  },

  boolean(col: string): string {
    return `    ${col}: !!formData.get("${col}"),`;
  },

  string(col: string): string {
    return `    ${col}: (formData.get("${col}") as string) || null,`;
  },

  json(col: string): string {
    return `    ${col}: formData.get("${col}") ? JSON.parse(formData.get("${col}") as string) : null,`;
  },

  date(col: string): string {
    return `    ${col}: formData.get("${col}") ? new Date(formData.get("${col}") as string) : null,`;
  },

  float(col: string): string {
    return `    ${col}: formData.get("${col}") ? parseFloat(formData.get("${col}") as string) : null,`;
  },

  bigint(col: string): string {
    return `    ${col}: formData.get("${col}") ? BigInt(formData.get("${col}") as string) : null,`;
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
