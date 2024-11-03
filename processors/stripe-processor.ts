import { log } from "../lib/log";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import {
  DbDialect,
  ShadjsProcessor,
  ShadjsConfig,
  DbDialectStrategy,
} from "../lib/types";
import {
  appendToEnvLocal,
  insertTextBeforeIfNotExists,
  prependToFileIfNotExists,
  renderTemplate,
} from "../lib/utils";
import {
  pkFunctionInvoke,
  pkStrategyImportTemplates,
} from "../lib/pk-strategy";
import { ScaffoldProcessor } from "./scaffold-processor";

export class StripeProcessor implements ShadjsProcessor {
  opts: ShadjsConfig;

  constructor(opts: ShadjsConfig) {
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.opts = opts;
  }

  dependencies = ["@stripe/stripe-js", "stripe"];

  devDependencies = [];

  shadcnComponents: string[] = ["card", "badge"];

  dbDialectStrategy: DbDialectStrategy;

  async init() {
    log.init("initializing stripe...");
    await this.render();
  }

  async render(): Promise<void> {
    this.addAccountPage();
    this.addPricingPage();
    this.addAccessUtil();
    this.appendStripeSecretsToEnvLocal();
    this.addCheckOutSessionsApiRoute();
    this.addCustomerPortalApiRoute();
    this.addWebhookApiRoute();
    this.addConfirmationPage();
    this.addCreatePriceScript();
    this.scaffold();
    this.addLinkToPrivateSidebar();
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

  scaffold() {
    const stripeWebhooksColumns: Record<DbDialect, string[]> = {
      postgresql: ["payload:text"],
      mysql: ["payload:text"],
      sqlite: ["payload:text"],
    };
    const stripeWebhooksProcessor = new ScaffoldProcessor({
      ...this.opts,
      authorizationLevel: "admin",
      columns: stripeWebhooksColumns[this.opts.dbDialect],
      table: "stripe_webhooks",
      enableCompletionMessage: false,
    });
    stripeWebhooksProcessor.process();

    const productsColumns: Record<DbDialect, string[]> = {
      postgresql: [
        "slug:text",
        "stripe_product_id:text",
        "stripe_price_id:text",
        "name:text",
        "price:integer",
        "description:text",
        "mode:text",
      ],
      mysql: [
        "slug:varchar",
        "stripe_product_id:varchar",
        "stripe_price_id:varchar",
        "name:varchar",
        "price:int",
        "description:text",
        "mode:varchar",
      ],
      sqlite: [
        "slug:text",
        "stripe_product_id:text",
        "stripe_price_id:text",
        "name:text",
        "price:integer",
        "description:text",
        "mode:text",
      ],
    };
    const productsProcessor = new ScaffoldProcessor({
      ...this.opts,
      authorizationLevel: "admin",
      columns: productsColumns[this.opts.dbDialect],
      table: "products",
      enableCompletionMessage: false,
    });
    productsProcessor.process();

    const ordersColumns: Record<DbDialect, string[]> = {
      postgresql: [
        "user:references",
        "product:references",
        "note:text",
        "amount_total:integer",
      ],
      mysql: [
        "user:references",
        "product:references",
        "note:text",
        "amount_total:int",
      ],
      sqlite: [
        "user:references",
        "product:references",
        "note:text",
        "amount_total:integer",
      ],
    };
    const ordersProcessor = new ScaffoldProcessor({
      ...this.opts,
      authorizationLevel: "admin",
      columns: ordersColumns[this.opts.dbDialect],
      table: "orders",
      enableCompletionMessage: false,
    });
    ordersProcessor.process();

    const subscriptionsColumns: Record<DbDialect, string[]> = {
      postgresql: [
        "user:references",
        "stripe_customer_id:text",
        "product:references",
        "start_date:date",
        "end_date:date",
      ],
      mysql: [
        "user:references",
        "stripe_customer_id:varchar",
        "product:references",
        "start_date:date",
        "end_date:date",
      ],
      sqlite: [
        "user:references",
        "stripe_customer_id:text",
        "product:references",
        "start_date:timestamp",
        "end_date:timestamp",
      ],
    };
    const subscriptionsProcessor = new ScaffoldProcessor({
      ...this.opts,
      authorizationLevel: "admin",
      columns: subscriptionsColumns[this.opts.dbDialect],
      table: "subscriptions",
      enableCompletionMessage: false,
    });
    subscriptionsProcessor.process();
  }

  addLinkToPrivateSidebar() {
    prependToFileIfNotExists(
      "components/private/private-sidebar.tsx",
      `import { CreditCardIcon } from "lucide-react";`
    );

    insertTextBeforeIfNotExists(
      "components/private/private-sidebar.tsx",
      "// [CODE_MARK private-sidebar-items]",
      `  { title: "Account", url: "/account", icon: CreditCardIcon }`
    );
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
