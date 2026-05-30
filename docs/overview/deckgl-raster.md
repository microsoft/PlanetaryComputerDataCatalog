# Rendering Planetary Computer rasters in the browser with deck.gl-raster

[deck.gl-raster](https://github.com/developmentseed/deck.gl-raster) renders Cloud Optimized GeoTIFFs directly in the browser. The library reads the COG header over HTTP, then streams only the tiles visible in the current viewport, decodes them client-side, and renders in WebGL2. No tile server, no intermediate downloads — the same model as [Lonboard](https://developmentseed.org/lonboard/), but in TypeScript for standalone web apps.

The full example built below lives at [planetary-computer/deckgl-raster-example](#) — `git clone`, `npm install`, `npm run dev` to see it running.

## Scaffold a Vite + React + TypeScript app

```bash
npm create vite@latest my-pc-viewer -- --template react-ts
cd my-pc-viewer
npm install @deck.gl/core @deck.gl/react @developmentseed/deck.gl-geotiff maplibre-gl
```

`@developmentseed/deck.gl-geotiff` is the high-level package used here. `@developmentseed/deck.gl-raster` provides lower-level primitives for custom render pipelines. The archived `@kylebarron/deck.gl-raster` repo is the predecessor — ignore it.

## A minimal deck.gl mental model

deck.gl is a WebGL rendering engine built around composable *layers*. A `Deck` instance takes an array of layers and renders them against a viewport. Layers are cheap to recreate: deck.gl diffs props and reruns expensive work only on actual changes. You'll lean on this when swapping COG URLs in response to user input.

## Sign Planetary Computer URLs from a backend

The browser can't hold your Planetary Computer subscription key safely. Stand up a minimal proxy that signs asset URLs server-side:

```ts
// server/sign.ts (Node, Express)
import express from "express";

const app = express();
const PC_KEY = process.env.PC_SDK_SUBSCRIPTION_KEY!;

app.get("/sign", async (req, res) => {
  const href = req.query.href as string;
  const r = await fetch(
    `https://planetarycomputer.microsoft.com/api/sas/v1/sign?href=${encodeURIComponent(href)}`,
    { headers: { "Ocp-Apim-Subscription-Key": PC_KEY } }
  );
  res.json(await r.json());
});

app.listen(3001);
```

Cache signed URLs server-side until ~5 minutes before their expiry. Long-running browser sessions need to re-fetch when SAS tokens lapse (~60 min).

## Render a single NAIP COG

```tsx
// src/App.tsx
import { Deck } from "@deck.gl/core";
import { COGLayer } from "@developmentseed/deck.gl-geotiff";
import { useEffect, useRef } from "react";

const PORTLAND_VIEW = { longitude: -122.65, latitude: 45.55, zoom: 13 };

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/sign?href=https://naipeuwest.blob.core.windows.net/naip/...tif");
      const { href } = await r.json();

      new Deck({
        canvas: canvasRef.current!,
        initialViewState: PORTLAND_VIEW,
        controller: true,
        layers: [new COGLayer({ id: "naip", url: href })],
      });
    })();
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />;
}
```

As the user pans and zooms, `COGLayer` walks the overview pyramid in the COG header and fetches only the tiles needed for the current viewport.

> **📷 Screenshot:** Browser DevTools Network tab filtered to the COG host, showing HTTP range requests (status 206) firing as the user zooms in. Proof that nothing is downloaded that isn't rendered.

> **📷 Screenshot:** The rendered NAIP scene over Portland in the browser.

## Render multiple scenes

Bbox-search the Planetary Computer for NAIP items, sign each href via the proxy, then pass one `COGLayer` per scene:

```tsx
const layers = signedHrefs.map(
  (href, i) => new COGLayer({ id: `naip-${i}`, url: href })
);
deck.setProps({ layers });
```

Browser memory is the practical limit. For larger mosaics, switch to a server-side tiler like [titiler](https://developmentseed.org/titiler/).

## Add a MapLibre basemap

`@deck.gl/react` wraps `Deck` so React owns the view state. Pair it with a MapLibre basemap so the user sees context outside your imagery:

```tsx
import { DeckGL } from "@deck.gl/react";
import Map from "react-map-gl/maplibre";

export default function App() {
  return (
    <DeckGL initialViewState={PORTLAND_VIEW} controller layers={layers}>
      <Map mapStyle="https://demotiles.maplibre.org/style.json" />
    </DeckGL>
  );
}
```

> **📷 Screenshot:** Final React app with NAIP imagery rendered over a MapLibre basemap, with a sidebar of date/filter controls (sketch the UI even if minimal). Anchors the "real app" feel.

## Customize the render

The auto-inferred pipeline covers most cases. For single-band data (NDVI, classification), pass a colormap:

```tsx
new COGLayer({
  url: href,
  colormap: "viridis",
  rescale: [-1, 1],
});
```

To compose render modules (e.g. add a sigmoidal contrast pass), reach into the lower-level `@developmentseed/deck.gl-raster` package.

## Ship it

A few things to confirm before the app leaves your laptop:

- **Bundler.** Vite handles WebGL shaders out of the box. If you switch to webpack, configure `raw-loader` for `.glsl` files.
- **Token refresh.** Re-fetch signed URLs from the proxy on a timer (or on layer remount) so SAS expiry doesn't break the map mid-session.
- **Memory.** For >50 simultaneous COGs, profile in DevTools and consider falling back to server-side tiling.
- **Failures.** Wrap layer construction in error boundaries — a 404 on one COG shouldn't break the whole map.
- **Tests.** Playwright visual regression snapshots catch rendering issues that unit tests can't.

## Reach for something else when…

deck.gl-raster is a renderer for standalone web apps. For interactive notebook work in Python, [Lonboard](https://developmentseed.org/lonboard/) wraps the same renderer. For pre-rendered tiles that any frontend can consume, see [titiler](https://developmentseed.org/titiler/). For pixel-level analysis in Python, reach for [async-geotiff](https://github.com/developmentseed/async-geotiff).
