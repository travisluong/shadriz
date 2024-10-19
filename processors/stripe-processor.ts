import { log } from "../lib/log";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import {
  DbDialect,
  ShadrizProcessor,
  ShadrizConfig,
  DbDialectStrategy,
} from "../lib/types";
import {
  appendToEnvLocal,
  insertSchemaToSchemaIndex,
  renderTemplate,
} from "../lib/utils";
import {
  pkFunctionInvoke,
  pkStrategyImportTemplates,
} from "../lib/pk-strategy";

interface StripeDbDialectStrategy {
  stripeSchemaTemplatePath: string;
}

const stripeDbDialectStrategy: Record<DbDialect, StripeDbDialectStrategy> = {
  postgresql: {
    stripeSchemaTemplatePath:
      "stripe-processor/schema/stripe-tables.ts.postgresql.hbs",
  },
  mysql: {
    stripeSchemaTemplatePath:
      "stripe-processor/schema/stripe-tables.ts.mysql.hbs",
  },
  sqlite: {
    stripeSchemaTemplatePath:
      "stripe-processor/schema/stripe-tables.ts.sqlite.hbs",
  },
};

export class StripeProcessor implements ShadrizProcessor {
  opts: ShadrizConfig;

  constructor(opts: ShadrizConfig) {
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.opts = opts;
  }

  dependencies = ["@stripe/stripe-js", "stripe"];

  devDependencies = [];

  shadcnComponents: string[] = ["card", "badge", "alert"];

  dbDialectStrategy: DbDialectStrategy;

  async init() {
    log.init("initializing stripe...");
    await this.render();
  }

  async render(): Promise<void> {
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
    insertSchemaToSchemaIndex("stripe_tables");
  }

  addAccountPage() {
    renderTemplate({
      inputPath: "stripe-processor/app/(private)/account/page.tsx.hbs",
      outputPath: "app/(private)/account/page.tsx",
    });
  }

  addPricingPage() {
    renderTemplate({
      inputPath: "stripe-processor/app/(public)/pricing/page.tsx.hbs",
      outputPath: "app/(public)/pricing/page.tsx",
    });
  }

  addAccessUtil() {
    renderTemplate({
      inputPath: "stripe-processor/lib/access.ts.hbs",
      outputPath: "lib/access.ts",
    });
  }

  addStripeSchema() {
    const pkText =
      this.dbDialectStrategy.pkStrategyTemplates[this.opts.pkStrategy];
    const pkStrategyImport = pkStrategyImportTemplates[this.opts.pkStrategy];
    renderTemplate({
      inputPath:
        stripeDbDialectStrategy[this.opts.dbDialect].stripeSchemaTemplatePath,
      outputPath: "schema/stripe-tables.ts",
      data: {
        pkText: pkText,
        pkStrategyImport: pkStrategyImport,
        createdAtTemplate: this.dbDialectStrategy.createdAtTemplate,
        updatedAtTemplate: this.dbDialectStrategy.updatedAtTemplate,
      },
    });
  }

  appendStripeSecretsToEnvLocal() {
    appendToEnvLocal(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "{NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"
    );
    appendToEnvLocal("STRIPE_SECRET_KEY", "{STRIPE_SECRET_KEY}");
    appendToEnvLocal("STRIPE_WEBHOOK_SECRET", "{STRIPE_WEBHOOK_SECRET}");
  }

  addCheckOutSessionsApiRoute() {
    renderTemplate({
      inputPath: "stripe-processor/app/api/checkout_sessions/route.ts.hbs",
      outputPath: "app/api/checkout_sessions/route.ts",
      data: {
        pkFunctionInvoke: pkFunctionInvoke[this.opts.pkStrategy],
        pkStrategyImport: pkStrategyImportTemplates[this.opts.pkStrategy],
      },
    });
  }

  addCustomerPortalApiRoute() {
    renderTemplate({
      inputPath: "stripe-processor/app/api/customer_portal/route.ts.hbs",
      outputPath: "app/api/customer_portal/route.ts",
    });
  }

  addWebhookApiRoute() {
    renderTemplate({
      inputPath: "stripe-processor/app/api/webhook/route.ts.hbs",
      outputPath: "app/api/webhook/route.ts",
    });
  }

  addConfirmationPage() {
    renderTemplate({
      inputPath: "stripe-processor/app/(public)/confirmation/page.tsx.hbs",
      outputPath: "app/(public)/confirmation/page.tsx",
    });
  }

  addCreatePriceScript() {
    renderTemplate({
      inputPath: "stripe-processor/scripts/create-price.ts.hbs",
      outputPath: "scripts/create-price.ts",
    });
  }

  printCompletionMessage() {
    log.checklist("stripe checklist");

    log.task("stripe setup");
    log.subtask("go to stripe > developers > api keys");
    log.subtask("update NEXT_STRIPE_PUBLISHABLE_KEY in .env.local");
    log.subtask("update STRIPE_SECRET_KEY in .env.local");

    log.task("stripe webhook setup");
    log.subtask("go to stripe > developers > webhooks");
    log.subtask("update STRIPE_WEBHOOK_SECRET in .env.local");

    log.task("start local stripe listener");
    log.cmdsubtask("stripe login");
    log.cmdsubtask("stripe listen --forward-to localhost:3000/api/webhook");

    log.task("test stripe webhook");
    log.cmdsubtask("stripe trigger payment_intent.succeeded");
    log.cmdsubtask("stripe trigger --help");

    log.task("create products in stripe and db");
    log.cmdsubtask("npx tsx scripts/create-price.ts");

    log.task("save customer portal settings");
    log.subtask("https://dashboard.stripe.com/test/settings/billing/portal");
  }
}
