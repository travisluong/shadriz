import { log } from "./log";
import { StripeProcessorOpts } from "./types";
import {
  appendToFileIfTextNotExists,
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
    this.addConfirmationPage();
    this.addCreatePriceScript();
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
      await spawnCommand("pnpm dlx shadcn-ui@latest add alert");
    } else {
      await spawnCommand("npx shadcn-ui@latest add card");
      await spawnCommand("npx shadcn-ui@latest add badge");
      await spawnCommand("npx shadcn-ui@latest add alert");
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
    appendToFileIfTextNotExists(".env.local", text);
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

  addConfirmationPage() {
    renderTemplate({
      inputPath: "stripe/app/(public)/confirmation/page.tsx.hbs",
      outputPath: "app/(public)/confirmation/page.tsx",
    });
  }

  addCreatePriceScript() {
    renderTemplate({
      inputPath: "stripe/scripts/create-price.ts.hbs",
      outputPath: "scripts/create-price.ts",
    });
  }

  printCompletionMessage() {
    log.white("\nstripe setup:");
    log.dash("go to stripe > developers > api keys");
    log.dash("update NEXT_STRIPE_PUBLISHABLE_KEY in .env.local");
    log.dash("update STRIPE_SECRET_KEY in .env.local");

    log.white("\nstripe webhook setup:");
    log.dash("go to stripe > developers > webhooks");
    log.dash("update STRIPE_WEBHOOK_SECRET in .env.local");

    log.white("\nstart local stripe listener:");
    log.cmd("stripe login");
    log.cmd("stripe listen --forward-to localhost:3000/api/webhook");
    log.cmd("strip trigger payment_intent.succeeded");

    log.white("\nsee all supported events:");
    log.cmd("stripe trigger --help");

    log.white("\ncreate products in stripe and db:");
    log.cmd("npx tsx scripts/create-price.ts");

    log.white("\nsave customer portal settings:");
    log.dash("https://dashboard.stripe.com/test/settings/billing/portal");
  }
}
