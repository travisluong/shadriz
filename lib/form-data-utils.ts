import { caseFactory } from "./case-utils";

export const formDataUtils = {
  integer(key: string, col: string): string {
    return `    ${key}: parseInt(formData.get("${col}") as string),`;
  },

  boolean(key: string, col: string): string {
    return `    ${key}: !!formData.get("${col}"),`;
  },

  string(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") as string,`;
  },

  json(key: string, col: string): string {
    return `    ${key}: JSON.parse(formData.get("${col}") as string),`;
  },

  date(key: string, col: string): string {
    return `    ${key}: new Date(formData.get("${col}") as string),`;
  },

  float(key: string, col: string): string {
    return `    ${key}: parseFloat(formData.get("${col}") as string),`;
  },

  bigint(key: string, col: string): string {
    return `    ${key}: BigInt(formData.get("${col}") as string),`;
  },

  references(key: string, col: string): string {
    return `    ${key}: formData.get("${col}") as string,`;
  },

  file(key: string, col: string): string {
    return `    ${key}: ${caseFactory(col).singularCamelCase}Uri,`;
  },
};
