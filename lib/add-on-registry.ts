import { StripeProcessor } from "../processors/stripe-processor";
import { TiptapProcessor } from "../processors/tiptap-processor";
import { ShadrizProcessor } from "./types";

type ClassType<T> = new (...args: any[]) => T;

interface ShadrizAddOn {
  Processor: ClassType<ShadrizProcessor>;
  name: string;
  description: string;
}

interface ClassMap {
  [key: string]: ShadrizAddOn;
}

export const ADD_ON_REGISTRY: ClassMap = {
  stripe: {
    Processor: StripeProcessor,
    name: "stripe",
    description:
      "a basic stripe integration with one-time, recurring, and dynamic payment examples",
  },
  tiptap: {
    Processor: TiptapProcessor,
    name: "tiptap",
    description: "a starting point for the tiptap wysiwyg editor",
  },
};

export function getAddOnHelpText() {
  let res = "";
  for (const key in ADD_ON_REGISTRY) {
    const addOn = ADD_ON_REGISTRY[key as keyof typeof ADD_ON_REGISTRY];
    res += `${addOn.name} - ${addOn.description}\n`;
  }
  return res;
}
