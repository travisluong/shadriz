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
    cy.get("h1")
      .first()
      .should("have.text", "Full Stack TypeScript Scaffolding Framework");
  });

  it("admin scaffold happy path", () => {
    cy.contains("Admin");
    cy.contains("User").click();
    cy.contains("User");
    cy.contains("user@example.com").should("exist");
    cy.contains("admin@example.com").should("exist");
    cy.contains("Admin Scaffold").click();
    cy.contains("New").click();
    cy.get('input[name="integerType"]').type("1");
    cy.get('input[name="realType"]').type("2");
    cy.get('input[name="booleanType"]').check({ force: true });
    cy.get('input[name="textType"]').type("foobar");
    cy.get('input[name="timestampType"]').type("2008");
    cy.get('button[type="submit"]').click();
    cy.get("td").contains("foobar");
  });

  it("create category", () => {
    cy.contains("Category").click();
    cy.contains("New").click();
    cy.get('input[name="name"]').type("bar");
    cy.get('button[type="submit"]').click();
    cy.contains("Category").should("exist");
    cy.contains("bar").should("exist");
  });

  it("create post", () => {
    cy.contains("Post").click();
    cy.contains("New").click();
    // need to select the hidden vanilla select since radix ui uses portals
    cy.get('select[name="categoryId"]').select(1, { force: true });
    cy.get('input[name="title"]').type("hello world", { force: true });
    cy.get('input[name="likes"]').type("123", { force: true });
    cy.get('input[name="publishedAt"]').type("2008-08-08", { force: true });
    cy.get(".tiptap.ProseMirror").type("hello", { force: true });
    cy.contains("Submit").click();
    cy.contains("Post").should("exist");
  });
});
