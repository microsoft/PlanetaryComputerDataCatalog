/* eslint-disable no-undef */
const disabledClass = "is-disabled";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes("Failed to retrieve the style definitions")) {
    return false;
  }
});

describe("URL state is loaded to Explorer", () => {
  it("can specify a single collection only", () => {
    cy.intercept("/api/stac/v1/collections/sentinel-2-l2a").as("getS2");
    cy.intercept("/api/data/v1/mosaic/info?collection=sentinel-2-l2a").as(
      "getS2mosaic"
    );
    cy.intercept("/api/stac/v1/search").as("getS2search");

    cy.visit({
      url: "/explore",
      qs: {
        d: "sentinel-2-l2a",
      },
    });

    cy.wait(["@getS2", "@getS2mosaic"]);

    cy.getBySel("mosaic-selector").not("have.class", disabledClass);
    cy.getBySel("render-selector").not("have.class", disabledClass);
    cy.getBySel("reset").should("be.visible");

    cy.wait(["@getS2search"]);
    cy.contains("matched your filter");
  });

  it("can specify a collection, mosaic, and render option ", () => {
    cy.intercept("/api/stac/v1/collections/sentinel-2-l2a").as("getS2");
    cy.intercept("/api/data/v1/mosaic/info?collection=sentinel-2-l2a").as(
      "getS2mosaic"
    );
    cy.intercept("/api/stac/v1/search").as("getS2search");

    cy.visit({
      url: "/explore",
      qs: {
        d: "sentinel-2-l2a",
        m: "Dec – Feb, 2022 (low cloud)",
        r: "Color infrared",
        ae: "0",
      },
    });

    cy.wait(["@getS2", "@getS2mosaic"]);

    cy.getBySel("mosaic-selector").not("have.class", disabledClass);
    cy.getBySel("render-selector").not("have.class", disabledClass);
    cy.getBySel("reset").should("be.visible");

    cy.wait(["@getS2search"]);
    cy.contains("matched your filter");
  });

  it("can specify a sort direction", () => {
    cy.intercept("/api/stac/v1/collections/sentinel-2-l2a").as("getS2");
    cy.intercept("/api/data/v1/mosaic/info?collection=sentinel-2-l2a").as(
      "getS2mosaic"
    );
    cy.intercept("/api/stac/v1/search").as("getS2search");

    cy.visit({
      url: "/explore",
      qs: {
        d: "sentinel-2-l2a",
        m: "Dec – Feb, 2022 (low cloud)",
        r: "Color infrared",
        ae: "0",
        sr: "asc",
      },
    });

    cy.wait(["@getS2", "@getS2mosaic"]);

    cy.wait(["@getS2search"]);
    cy.contains("matched your filter");

    cy.getBySel("explore-results-menu-button").click();
    cy.contains("Sort order").click();
    cy.get("[title='Show oldest results first']").should("have.class", "is-checked");
  });

  it("can specify a custom searchid", () => {
    cy.intercept("/api/stac/v1/collections/sentinel-2-l2a").as("getS2");
    cy.intercept("/api/data/v1/mosaic/info?collection=sentinel-2-l2a").as(
      "getS2mosaic"
    );
    cy.intercept("/api/stac/v1/search").as("getS2search");

    cy.visit({
      url: "/explore",
      qs: {
        d: "sentinel-2-l2a",
        // Note: this search id must be registered in the backend
        // It can be replaced with any other search id that does exist
        m: "cql:540763d2886e640eb1220ca949518ced",
        r: "Color infrared",
      },
    });

    cy.wait(["@getS2", "@getS2mosaic"]);

    cy.getBySel("mosaic-selector").not("be.visible");
    cy.getBySel("render-selector")
      .not("have.class", disabledClass)
      .contains("Color infrared");
    cy.getBySel("reset").should("be.visible");

    cy.wait(["@getS2search"]);
    cy.contains("matched your filter");
  });

  it("can specify multiple layers", () => {
    cy.intercept("/api/stac/v1/collections/nasadem").as("getnasadem");
    cy.intercept("/api/stac/v1/collections/chloris-biomass").as("getchloris");

    cy.visit({
      url: "/explore",
      qs: {
        v: 2,
        d: "nasadem||chloris-biomass",
        s: "true::100::true||true::100::true",
        m: "Most recent||All years",
        r: "Elevation (terrain)||Aboveground Biomass (tonnes)",
        ae: "1",
      },
    });

    cy.wait(["@getnasadem", "@getchloris"]);

    cy.getBySel("mosaic-selector").should("have.class", disabledClass);
    cy.getBySel("render-selector").should("have.class", disabledClass);

    cy.getBySel("explore-legend")
      .should("be.visible")
      .and("contain", "Chloris Biomass")
      .and("contain", "NASADEM");

    cy.getBySel("collection-selector").contains("Chloris Biomass");
  });
});
