// @ts-nocheck

import Handlebars from "handlebars";

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("switch", function (value, options) {
    this._switch_value_ = value;
    this._switch_case_matched_ = false;
    return options.fn(this);
  });

  Handlebars.registerHelper("case", function (value, options) {
    if (value === this._switch_value_) {
      this._switch_case_matched_ = true;
      return options.fn(this);
    }
  });

  Handlebars.registerHelper("default", function (options) {
    if (!this._switch_case_matched_) {
      return options.fn(this);
    }
  });
}
