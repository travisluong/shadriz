/// <reference types="cypress" />

describe("shadriz e2e test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/admin-login");
    cy.get('input[name="email"]').type("admin@example.com");
    cy.get('input[name="password"]').type("pw");
    cy.contains("Sign in").click();
  });

  it("home page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Full Stack TypeScript Scaffolding Framework");
  });

  it("admin scaffold happy path", () => {
    cy.contains("Admin");
    cy.contains("Users").click();
    cy.contains("Users");
    cy.contains("user@example.com").should("exist");
    cy.contains("admin@example.com").should("exist");
    cy.contains("Admin Scaffolds").click();
    cy.contains("New").click();
    cy.get('input[name="integerType"]').type("1");
    cy.get('input[name="smallintType"]').type("2");
    cy.get('input[name="bigintType"]').type("3");
    cy.get('input[name="serialType"]').type("4");
    cy.get('input[name="bigserialType"]').type("5");
    cy.get('input[name="booleanType"]').check({ force: true });
    cy.get('input[name="textType"]').type("foobar");
    cy.get('input[name="varcharType"]').type("b");
    cy.get('input[name="charType"]').type("c");
    cy.get('input[name="numericType"]').type("6");
    cy.get('input[name="decimalType"]').type("7");
    cy.get('input[name="realType"]').type("8");
    cy.get('input[name="doublePrecisionType"]').type("9");
    cy.get('input[name="jsonType"]').type("{}");
    cy.get('input[name="jsonbType"]').type("{}");
    cy.get('input[name="timeType"]').type("08:08");
    cy.get('input[name="timestampType"]').type("2008");
    cy.get('input[name="dateType"]').type("2024-08-08");
    cy.get('button[type="submit"]').click();
    cy.get("td").contains("foobar");
  });

  it("create category", () => {
    cy.contains("Categories").click();
    cy.contains("New").click();
    cy.get('input[name="title"]').type("foo");
    cy.get('button[type="submit"]').click();
    cy.contains("Categories");
    cy.contains("foo").should("exist");
  });

  it("create post status", () => {
    cy.contains("Post Statuses").click();
    cy.contains("New").click();
    cy.get('input[name="status"]').type("bar");
    cy.get('button[type="submit"]').click();
    cy.contains("Post Statuses").should("exist");
    cy.contains("bar").should("exist");
  });

  it("create post", () => {
    cy.contains("Posts").click();
    cy.contains("New").click();
    cy.contains("Select Category").click();
    cy.get("[cmdk-item]").first().click();
    // need to select the hidden vanilla select since radix ui uses portals
    cy.get('select[name="postStatusId"]').select(2, { force: true });
    cy.get('input[name="title"]').type("hello world", { force: true });
    cy.get('input[name="likes"]').type("123", { force: true });
    cy.get('input[name="publishedAt"]').type("2008-08-08", { force: true });
    cy.get(".tiptap.ProseMirror").type("hello", { force: true });
    cy.contains("Submit").click();
    cy.contains("Posts").should("exist");
  });
});
