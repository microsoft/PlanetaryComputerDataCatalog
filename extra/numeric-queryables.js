const ref = require("@apidevtools/json-schema-ref-parser");
const fetch = require("node-fetch");

async function get() {
  const resp = await fetch(
    "https://planetarycomputer-staging.microsoft.com/api/stac/v1/collections"
  );
  const cp = await resp.json();
  const urls = await Promise.all(
    cp.collections.map(
      c =>
        `https://planetarycomputer-staging.microsoft.com/api/stac/v1/collections/${c.id}/queryables`
    )
  );
  const schemas = await Promise.all(
    urls.map(async url => {
      try {
        return await ref.dereference(url);
      } catch {
        return false;
      }
    })
  );

  const ids = await Promise.all(
    schemas.filter(Boolean).flatMap(q =>
      Object.entries(q.properties)
        .filter(([_, v]) => ["number", "integer"].includes(v.type))
        .map(([k, _]) => k)
    )
  );

  ids.sort();
  const unqIds = new Set(ids);
  console.log(unqIds);
}

get();
