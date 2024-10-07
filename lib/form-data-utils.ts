import { caseFactory } from "./case-utils";

export const formDataUtils = {
  integer(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") ? parseInt(formData.get("${col}") as string) : null,`;
  },

  boolean(key: string, col: string): string {
    return `    ${key}: !!formData.get("${col}"),`;
  },

  string(key: string, col: string): string {
    return `    ${key}: (formData.get("${col}") as string) || null,`;
  },

  json(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") ? JSON.parse(formData.get("${col}") as string) : null,`;
  },

  date(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") ? new Date(formData.get("${col}") as string) : null,`;
  },

  float(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") ? parseFloat(formData.get("${col}") as string) : null,`;
  },

  bigint(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") ? BigInt(formData.get("${col}") as string) : null,`;
  },

  references(key: string, col: string): string {
    return `    ${key}: (formData.get("${col}") as string) || null,`;
  },

  file(key: string, col: string): string {
    return `    ${key}: ${caseFactory(col).singularCamelCase}Uri,`;
  },
};
