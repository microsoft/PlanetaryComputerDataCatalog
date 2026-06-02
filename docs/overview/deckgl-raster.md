# Rendering Planetary Computer rasters in the browser with deck.gl-raster

[deck.gl-raster](https://github.com/developmentseed/deck.gl-raster) renders Cloud Optimized GeoTIFFs directly in the browser. Its `COGLayer` reads the COG header over HTTP, then streams only the tiles visible in the current viewport, decodes them client-side, reprojects, and renders in WebGL2. No tile server, no intermediate downloads. It's the same model as [Lonboard](./lonboard.md), but in TypeScript for standalone web apps.

The whole thing fits in **one HTML file with no build step**. The complete example is committed alongside this tutorial at [`deckgl-raster-example/index.html`](deckgl-raster-example/index.html). Save it locally and open it in a browser, or follow along below.

## No build: an import map

Instead of npm and a bundler, an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) resolves every dependency from a CDN ([esm.sh](https://esm.sh)). Two rules make it work:

- Every `@deck.gl/*` and `@luma.gl/core` entry must be the **same version**, since mismatched patch versions throw `deck.gl - multiple versions detected`.
- The `deck.gl-geotiff` entry marks deck, luma, and geotiff as `external` so they resolve to the singletons above rather than being bundled a second time.

```html
<script type="importmap">
{
  "imports": {
    "maplibre-gl": "https://esm.sh/maplibre-gl@4.7.1",
    "@deck.gl/core": "https://esm.sh/@deck.gl/core@9.3.2",
    "@deck.gl/layers": "https://esm.sh/@deck.gl/layers@9.3.2",
    "@deck.gl/geo-layers": "https://esm.sh/@deck.gl/geo-layers@9.3.2",
    "@deck.gl/mesh-layers": "https://esm.sh/@deck.gl/mesh-layers@9.3.2",
    "@deck.gl/mapbox": "https://esm.sh/@deck.gl/mapbox@9.3.2?external=@deck.gl/core,maplibre-gl",
    "@luma.gl/core": "https://esm.sh/@luma.gl/core@9.3.2",
    "@developmentseed/geotiff": "https://esm.sh/@developmentseed/geotiff@0.7.0",
    "@developmentseed/deck.gl-geotiff": "https://esm.sh/@developmentseed/deck.gl-geotiff@0.7.0?external=@deck.gl/core,@deck.gl/layers,@deck.gl/geo-layers,@deck.gl/mesh-layers,@luma.gl/core,@developmentseed/geotiff"
  }
}
</script>
```

## Sign Planetary Computer URLs in the browser

The Planetary Computer signing endpoint is public, with no subscription key and no backend proxy. Search the STAC API for a scene, then sign the asset href client-side:

```js
const STAC = "https://planetarycomputer.microsoft.com/api/stac/v1";
const SIGN = "https://planetarycomputer.microsoft.com/api/sas/v1/sign?href=";

const search = await fetch(`${STAC}/search`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    collections: ["naip"],
    bbox: [-122.70, 45.50, -122.55, 45.57],
    datetime: "2022-01-01/2023-01-01",
    limit: 1,
  }),
}).then((r) => r.json());

const item = search.features[0];
const signed = await fetch(SIGN + encodeURIComponent(item.assets.image.href)).then((r) => r.json());
```

A signed SAS URL lasts ~60 minutes. Long-running sessions should re-sign before expiry.

## Render a single NAIP COG

`COGLayer` takes the signed COG URL as its `geotiff` prop. One detail matters for a no-build app: the default tile decoder spawns a Web Worker from the package's own URL, and browsers block constructing a worker from a cross-origin (CDN) script. Passing a `DecoderPool` with `size: 0` decodes on the main thread and sidesteps that:

```js
import { COGLayer } from "@developmentseed/deck.gl-geotiff";
import { DecoderPool } from "@developmentseed/geotiff";

const pool = new DecoderPool({ size: 0 });
const layer = new COGLayer({ id: "naip", geotiff: signed.href, pool });
```

As the user pans and zooms, `COGLayer` walks the overview pyramid in the COG header and fetches only the tiles the viewport needs. Watch the browser's Network tab and you'll see HTTP **range requests** (status `206`). The first reads the header, the rest pull individual tiles:

```text
206  bytes=0-65535          ← COG header
206  bytes=1826859-2729978  ← tile
206  bytes=2729987-3614432  ← tile
206  bytes=3767796-4663213  ← tile
…
```

Nothing is downloaded that isn't rendered.

## Add a MapLibre basemap

`@deck.gl/mapbox`'s `MapboxOverlay` adds `Deck` layers to a MapLibre map. With `interleaved: true`, deck draws into the same WebGL context as the basemap, so you can slot the imagery beneath the label layers with `beforeId` and keep place names legible on top. `COGLayer`'s `onGeoTIFFLoad` callback hands back the scene's bounds, so the map frames the COG once it loads:

```js
import maplibregl from "maplibre-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";

const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-122.62, 45.52],
  zoom: 11,
});

const overlay = new MapboxOverlay({ interleaved: true, layers: [] });
map.addControl(overlay);

map.on("load", () => {
  // draw imagery below the first label layer so basemap text stays on top
  const beforeId = map.getStyle().layers.find((l) => l.type === "symbol")?.id;

  overlay.setProps({
    layers: [new COGLayer({
      id: "naip",
      geotiff: signed.href,
      pool,
      opacity,
      beforeId,
      onGeoTIFFLoad: (tiff, { geographicBounds }) => {
        const { west, south, east, north } = geographicBounds;
        map.fitBounds([[west, south], [east, north]], { padding: 40 });
      },
    })],
  });
});
```

The [committed example](deckgl-raster-example/index.html) wires this together with a small control panel: an opacity slider and the active scene id:

```{image} images/deckgl-raster-full-app.png
:height: 460
:name: deck.gl-raster NAIP over Portland with a MapLibre basemap
:class: no-scaled-link
```

## Render multiple scenes

Bbox-search returns many items. Sign each href and pass one `COGLayer` per scene. `overlay.setProps({ layers })` diffs them and only reloads what changed:

```js
const layers = signedHrefs.map((href, i) => new COGLayer({ id: `naip-${i}`, geotiff: href, pool }));
overlay.setProps({ layers });
```

Browser memory is the practical limit. For large mosaics, reach for `MosaicLayer` / `MultiCOGLayer` from the same package, or fall back to a server-side tiler like [titiler](https://developmentseed.org/titiler/).

## Ship it

- **Token refresh.** Re-sign asset URLs before SAS tokens expire (~60 min) so long sessions don't break mid-map.
- **Throughput.** `size: 0` decodes on the main thread, which is fine for a few COGs. For heavier mosaics, give `DecoderPool` a `createWorker` factory backed by a *same-origin* worker so decoding moves off the main thread.
- **Failures.** Guard layer construction, since a 404 on one COG shouldn't break the whole map.
- **Going to production.** The import map is ideal for a demo or internal tool. For a shipped app, move to a bundler (Vite) so dependencies are pinned and served from your own origin.

## When to use something else

deck.gl-raster is a renderer for standalone web apps. For interactive notebook work in Python, [Lonboard](./lonboard.md) wraps the same renderer. For pre-rendered tiles that any frontend can consume, see [titiler](https://developmentseed.org/titiler/). For pixel-level analysis in Python, reach for [async-geotiff](./async-geotiff.md).
