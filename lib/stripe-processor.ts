import { StripeProcessorOpts } from "./types";
import {
  appendToFile,
  compileTemplate,
  renderTemplate,
  spawnCommand,
} from "./utils";

export class StripeProcessor {
  opts: StripeProcessorOpts;

  constructor(opts: StripeProcessorOpts) {
    this.opts = opts;
  }

  async init() {
    await this.installDependencies();
    await this.addShadcnComponents();
    this.addAccountPage();
    this.addPricingPage();
    this.addAccessUtil();
    this.addStripeSchema();
    this.appendStripeSecretsToEnvLocal();
    this.addCheckOutSessionsApiRoute();
    this.addCustomerPortalApiRoute();
    this.addWebhookApiRoute();
  }

  async installDependencies() {
    if (!this.opts.install) {
      return;
    }

    if (this.opts.pnpm) {
      await spawnCommand("pnpm add @stripe/stripe-js");
      await spawnCommand("pnpm add stripe");
    } else {
      await spawnCommand("npm install @stripe/stripe-js");
      await spawnCommand("npm install stripe");
    }
  }

  async addShadcnComponents() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      await spawnCommand("pnpm dlx shadcn-ui@latest add card");
      await spawnCommand("pnpm dlx shadcn-ui@latest add badge");
    } else {
      await spawnCommand("npx shadcn-ui@latest add card");
      await spawnCommand("npx shadcn-ui@latest add badge");
    }
  }

  addAccountPage() {
    renderTemplate({
      inputPath: "stripe/app/(private)/account/page.tsx.hbs",
      outputPath: "app/(private)/account/page.tsx",
    });
  }

  addPricingPage() {
    renderTemplate({
      inputPath: "stripe/app/(public)/pricing/page.tsx.hbs",
      outputPath: "app/(public)/pricing/page.tsx",
    });
  }

  addAccessUtil() {
    renderTemplate({
      inputPath: "stripe/lib/access.ts.hbs",
      outputPath: "lib/access.ts",
    });
  }

  addStripeSchema() {
    renderTemplate({
      inputPath: this.opts.dbDialectStrategy.stripeSchemaTemplatePath,
      outputPath: "schema/stripe.ts",
    });
  }

  appendStripeSecretsToEnvLocal() {
    const text = compileTemplate({ inputPath: "stripe/.env.local.hbs" });
    appendToFile(".env.local", text);
  }

  addCheckOutSessionsApiRoute() {
    renderTemplate({
      inputPath: "stripe/app/api/checkout_sessions/route.ts.hbs",
      outputPath: "app/api/checkout_sessions/route.ts",
    });
  }

  addCustomerPortalApiRoute() {
    renderTemplate({
      inputPath: "stripe/app/api/customer_portal/route.ts.hbs",
      outputPath: "app/api/customer_portal/route.ts",
    });
  }

  addWebhookApiRoute() {
    renderTemplate({
      inputPath: "stripe/app/api/webhook/route.ts.hbs",
      outputPath: "app/api/webhook/route.ts",
    });
  }
}
