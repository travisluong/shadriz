export const formDataUtils = {
  integer(col: string): string {
    return `    ${col}: parseInt(formData.get("${col}") as string),\n`;
  },

  boolean(col: string): string {
    return `    ${col}: !!formData.get("${col}"),\n`;
  },

  string(col: string): string {
    return `    ${col}: formData.get("${col}") as string,\n`;
  },

  json(col: string): string {
    return `    ${col}: formData.get("${col}") ? JSON.parse(formData.get("${col}") as string) : "",\n`;
  },

  date(col: string): string {
    return `    ${col}: new Date(formData.get("${col}") as string),\n`;
  },

  float(col: string): string {
    return `    ${col}: parseFloat(formData.get("${col}") as string),\n`;
  },

  bigint(col: string): string {
    return `    ${col}: BigInt(formData.get("${col}") as string),\n`;
  },

  references(col: string): string {
    return `    ${col}_id: formData.get("${col}_id") as string,\n`;
  },
};
