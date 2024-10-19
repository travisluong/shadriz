import { StripeProcessor } from "../processors/stripe-processor";

export const ADD_ON_REGISTRY = {
  stripe: {
    Processor: StripeProcessor,
    name: "stripe",
    description:
      "a basic stripe integration with one-time, recurring, and dynamic payment examples",
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
