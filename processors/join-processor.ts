import { caseFactory, Cases } from "../lib/case-utils";
import { log } from "../lib/log";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import {
  AuthorizationLevel,
  DbDialectStrategy,
  ShadjsConfig,
  ShadjsProcessor,
} from "../lib/types";
import { insertTextAfterIfNotExists, renderTemplate } from "../lib/utils";

interface JoinOpts {
  leftTable: string;
  joinTable: string;
  rightTable: string;
  authorizationLevel: AuthorizationLevel;
}

export class JoinProcessor implements ShadjsProcessor {
  opts: ShadjsConfig;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = [];
  dbDialectStrategy: DbDialectStrategy;
  joinOpts: JoinOpts;
  leftCaseVariants: Cases;
  joinCaseVariants: Cases;
  rightCaseVariants: Cases;

  constructor(opts: ShadjsConfig, joinOpts: JoinOpts) {
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.opts = opts;
    this.joinOpts = joinOpts;
    this.leftCaseVariants = caseFactory(joinOpts.leftTable);
    this.joinCaseVariants = caseFactory(joinOpts.joinTable);
    this.rightCaseVariants = caseFactory(joinOpts.rightTable);
  }

  async init() {
    await this.render();
  }
  async render() {
    // add link to table
    insertTextAfterIfNotExists(
      `components/${this.joinOpts.authorizationLevel}/${this.leftCaseVariants.pluralKebabCase}/${this.leftCaseVariants.singularKebabCase}-table.tsx`,
      "{/* [CODE_MARK table-actions] */}",
      `\n              <Link href={\`/admin/${this.leftCaseVariants.pluralKebabCase}/\${${this.leftCaseVariants.singularCamelCase}.id}/${this.joinCaseVariants.pluralKebabCase}\`}>
                <Button variant="outline">
                  <ListTodoIcon /> ${this.joinCaseVariants.pluralCapitalCase}
                </Button>
              </Link>`
    );

    // create the management page
    renderTemplate({
      inputPath: "join-processor/app/table/[id]/join/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        this.leftCaseVariants.pluralKebabCase
      }/[id]/${this.joinCaseVariants.pluralKebabCase}/page.tsx`,
      data: {
        leftCaseVariants: this.leftCaseVariants,
        joinCaseVariants: this.joinCaseVariants,
        rightCaseVariants: this.rightCaseVariants,
      },
    });

    // create the update action
    renderTemplate({
      inputPath: "join-processor/actions/update-joins.ts.hbs",
      outputPath: `actions/${this.joinOpts.authorizationLevel}/${this.leftCaseVariants.pluralKebabCase}/update-${this.joinCaseVariants.pluralKebabCase}.ts`,
      data: {
        leftCaseVariants: this.leftCaseVariants,
        joinCaseVariants: this.joinCaseVariants,
        rightCaseVariants: this.rightCaseVariants,
      },
    });

    // create the update form
    renderTemplate({
      inputPath: "join-processor/components/table/update-joins-form.tsx.hbs",
      outputPath: `components/${this.joinOpts.authorizationLevel}/${this.leftCaseVariants.pluralKebabCase}/${this.joinCaseVariants.pluralKebabCase}-update-form.tsx`,
      data: {
        leftCaseVariants: this.leftCaseVariants,
        joinCaseVariants: this.joinCaseVariants,
        rightCaseVariants: this.rightCaseVariants,
      },
    });
  }

  authorizationRouteGroup() {
    switch (this.joinOpts.authorizationLevel) {
      case "admin":
        return "(admin)/admin/";
      case "private":
        return "(private)/";
      case "public":
        return "(public)/";
      default:
        throw new Error(
          "invalid authorization level " + this.joinOpts.authorizationLevel
        );
    }
  }
  printCompletionMessage() {
    log.success("join scaffold success");
  }
}
