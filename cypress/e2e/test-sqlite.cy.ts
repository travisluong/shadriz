/// <reference types="cypress" />

describe("shadriz e2e test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/signin");
    cy.get('input[name="email"]').first().type("admin@example.com");
    cy.get('input[name="password"]').first().type("pw");
    cy.contains("Sign in with Credentials").click();
  });

  it("home page", () => {
    cy.visit("http://localhost:3000");
    cy.get("h1").first().should("have.text", "shadrizz");
  });

  it("private scaffold happy path", () => {
    cy.contains("Dashboard").click();
    cy.contains("Private Scaffold").click();
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
    cy.contains("Dashboard").click();
    cy.contains("Categor").click();
    cy.contains("New").click();
    cy.get('input[name="name"]').type("my_category");
    cy.get('button[type="submit"]').click();
    cy.contains("Categor").should("exist");
    cy.contains("my_category").should("exist");
  });

  it("create post", () => {
    cy.contains("Dashboard").click();
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
