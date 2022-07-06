import aiohttp
import asyncio
import io
import logging

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import List
from mercantile import tiles
from PIL import Image

from .AnimationFrame import AnimationFrame


class PcMosaicAnimation:
    registerUrl = "https://planetarycomputer.microsoft.com/api/data/v1/mosaic/register"
    async_limit = asyncio.Semaphore(34)

    def __init__(self, bbox: List[float], zoom: int, render_params: str):
        self.bbox = bbox
        self.zoom = zoom
        self.render_params = render_params
        self.tiles = list(tiles(*bbox, zoom))
        self.tile_size = 256

    async def _get_tilejson(self, daterange: List[str]) -> str:
        cql = {
            "filter-lang": "cql2-json",
            "filter": {
                "op": "and",
                "args": [
                    {
                        "op": "anyinteracts",
                        "args": [{"property": "datetime"}, {"interval": daterange}],
                    },
                    {"op": "=", "args": [{"property": "collection"}, "modis-09A1-061"]},
                ],
            },
        }

        async with aiohttp.ClientSession() as session:
            # Register the search and get the tilejson_url back
            async with session.post(self.registerUrl, json=cql) as resp:
                mosaic_info = await resp.json()
                tilejson_href = [
                    link["href"]
                    for link in mosaic_info["links"]
                    if link["rel"] == "tilejson"
                ][0]
                tilejson_url = f"{tilejson_href}?{self.render_params}"

            # Get the full tile path template
            async with session.get(tilejson_url) as resp:
                tilejson = await resp.json()
                return tilejson["tiles"][0]

    async def _get_tile(self, url):
        async with aiohttp.ClientSession() as session:
            async with self.async_limit:
                # Download the image tile, block if exceeding concurrency limits
                async with session.get(url) as resp:
                    if self.async_limit.locked():
                        logging.info("Concurrency limit reached, waiting...")
                        await asyncio.sleep(1)

                    if resp.status == 200:
                        img_bytes = await resp.read()
                        return io.BytesIO(img_bytes)
                    else:
                        img_bytes = Image.new(
                            "RGB", (self.tile_size, self.tile_size), "white"
                        )
                        empty = io.BytesIO()
                        img_bytes.save(empty, format="png")
                        return empty

    async def get(self, increments: int, unit: str, start: datetime, total_frames: int):
        frames = []

        delta = {
            "days": relativedelta(days=increments),
            "weeks": relativedelta(weeks=increments),
            "months": relativedelta(months=increments),
            "years": relativedelta(years=increments),
        }[unit]

        next_date = start
        for frame_num in range(total_frames - 1):
            logging.debug(f"Generating frame {frame_num}")
            frames.append(asyncio.ensure_future(self._get_frame(next_date)))
            next_date += delta

        image_frames = await asyncio.gather(*frames)
        gif = image_frames[0]
        output = io.BytesIO()
        gif.save(
            output,
            format="GIF",
            append_images=image_frames[1:],
            optimize=False,
            save_all=True,
            duration=500,
            loop=0,
        )

        return output

    async def _get_frame(self, date: datetime) -> io.BytesIO:
        date_buffer_pre = date - timedelta(days=3)
        date_buffer_post = date + relativedelta(days=3)
        tile_path = await self._get_tilejson(
            [date_buffer_pre.isoformat(), date_buffer_post.isoformat()]
        )

        tasks = []
        for tile in self.tiles:
            url = (
                tile_path.replace("{x}", str(tile.x))
                .replace("{y}", str(tile.y))
                .replace("{z}", str(tile.z))
            )
            tasks.append(asyncio.ensure_future(self._get_tile(url)))

        tile_images = await asyncio.gather(*tasks)
        frame = AnimationFrame(self.tiles, tile_images, self.bbox)
        return frame.get_mosaic()
