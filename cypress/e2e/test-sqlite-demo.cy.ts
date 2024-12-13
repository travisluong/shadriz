/// <reference types="cypress" />

describe("shadriz e2e test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/admin-login");
    cy.get('input[name="email"]').first().type("test@example.com");
    cy.get('input[name="password"]').first().type("password123");
    cy.contains("Sign in").click();
  });

  it("home page", () => {
    cy.visit("http://localhost:3000");
    cy.get("h1").first().should("have.text", "shadrizz");
  });

  it("contact message happy path", () => {
    cy.visit("http://localhost:3000/contact-messages/new");
    cy.get('input[name="name"]').type("john smith");
    cy.get('input[name="email"]').type("johnsmith@example.com");
    cy.get('input[name="message"]').type("hello world");
    cy.get('button[type="submit"]').click();
    cy.get("td").contains("john smith");
  });

  it("create category", () => {
    cy.get("a").contains("Categories").click();
    cy.get("button").contains("New").click();
    cy.get('input[name="name"]').type("my_category");
    cy.get('button[type="submit"]').click();
    cy.get("td").contains("my_category").should("exist");
  });

  it("create post", () => {
    cy.get("a").contains("Posts").click();
    cy.get("button").contains("New").click();
    // need to select the hidden vanilla select since radix ui uses portals
    cy.get('select[name="categoryId"]').select(1, { force: true });
    cy.get('input[name="title"]').type("hello world", { force: true });
    cy.get('input[name="publishedAt"]').type("2008-08-08", { force: true });
    cy.get(".tiptap.ProseMirror").type("hello", { force: true });
    cy.contains("Submit").click();
    cy.get("div").contains("hello").should("exist");
  });
});
