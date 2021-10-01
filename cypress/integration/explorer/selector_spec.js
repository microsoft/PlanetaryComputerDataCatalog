/* eslint-disable no-undef */
const disabledClass = "is-disabled";

describe("Explorer selector tests", () => {
  it("has collection selectors", () => {
    cy.intercept("/api/stac/v1/collections", { fixture: "collections" }).as(
      "getCollections"
    );

    cy.visit("/explore");

    cy.getBySel("collection-selector")
      .should("be.visible")
      .not("have.class", disabledClass);
    cy.getBySel("mosaic-selector")
      .should("be.visible")
      .should("have.class", disabledClass);
    cy.getBySel("render-selector")
      .should("be.visible")
      .should("have.class", disabledClass);
    cy.getBySel("reset").should("be.visible").should("be.disabled");

    cy.wait(["@getCollections"]);
    cy.getBySel("collection-selector").click();

    cy.get(".ms-Callout")
      .contains("Imagery")
      .parent()
      .parent()
      .contains("Sentinel-2 Level-2A");
  });

  it("loads mosaic spec for selected collection", () => {
    cy.intercept("/stac/sentinel-2-l2a/mosaicInfo.json", { fixture: "s2mosaic" }).as(
      "getS2mosaic"
    );
    cy.intercept("/api/stac/v1/search", { fixture: "s2search" }).as("getS2search");

    cy.contains("Sentinel-2 Level-2A").click();
    cy.wait(["@getS2mosaic"]);

    cy.getBySel("mosaic-selector").not("have.class", disabledClass);
    cy.getBySel("render-selector").not("have.class", disabledClass);

    cy.wait(["@getS2search"]);
    cy.contains("matched your search");
  });

  it("searches and opens a detail dialog", function () {
    cy.getBySel("item-result")
      .as("itemResults")
      .then(() => {
        cy.get("@itemResults").its("length").should("be.gt", 5);
        cy.get("@itemResults").first().click();
      });
  });

  it("has item detail controsl", () => {
    cy.getBySel("detail-dialog")
      .find("[data-cy=preview-thumbnail]")
      .first()
      .should("be.visible")
      .and($img => {
        expect($img[0].naturalWidth).to.be.greaterThan(300);
      });

    // Item map preview exists
    cy.getBySel("item-map-button").click();
    cy.getBySel("item-map-button").click();

    // Code snippet button exists and opens dialog with python import
    cy.getBySel("item-snippet-button").click();
    cy.contains("import planetary_computer");
    cy.contains("Copy");
    cy.contains("Launch Hub").focus().type("{esc}");

    // Typing escape has closed the dialog
    cy.contains("import planetary_computer").should("not.exist");

    // Check that both metadata and assets tabs exist
    cy.contains("Metadata");
    cy.contains("Assets").click();

    // Switch to assets, scroll to bottom and ensure the back to list button still exists
    cy.getBySel("detail-dialog-list").scrollTo("bottom");
    cy.getBySel("back-to-list").should("be.visible").click();
  });

  it("has query action buttons", () => {
    cy.getBySel("query-detail-button").click();
    cy.contains("Filters Applied");
    cy.contains("Rendering");
    cy.getBySel("query-detail-button").click();
    cy.contains("Filters Applied").should("not.exist");

    cy.getBySel("search-results-list").scrollTo("center");
    cy.getBySel("explore-in-hub").click();
    cy.contains("import planetary_computer");
    cy.get("body").type("{esc}");
  });

  it("resets to default state", () => {
    cy.getBySel("reset").click();
    cy.getBySel("collection-selector").should("not.have.class", disabledClass);
    cy.getBySel("mosaic-selector").should("have.class", disabledClass);
    cy.getBySel("render-selector").should("have.class", disabledClass);
    cy.getBySel("reset").should("be.disabled");
  });
});
