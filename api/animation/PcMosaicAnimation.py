from copy import deepcopy
import os
import aiohttp
import asyncio
import io
import logging

from datetime import datetime
from typing import Dict, List
from mercantile import tiles
from PIL import Image


from .AnimationFrame import AnimationFrame
from .constants import MAX_TILE_COUNT
from .utils import BBoxTooLargeError, get_relative_delta


concurrency_limit = int(os.environ.get("ANIMATION_CONCURRENCY", 10))
api_url = os.environ.get(
    "ANIMATION_API_ROOT_URL", "https://planetarycomputer.microsoft.com/api/data/v1"
)


class PcMosaicAnimation:
    registerUrl = f"{api_url}/mosaic/register/"
    async_limit = asyncio.Semaphore(concurrency_limit)

    def __init__(
        self,
        bbox: List[float],
        zoom: int,
        cql: Dict[str, any],
        render_params: str,
        frame_duration: int = 250,
    ):
        self.bbox = bbox
        self.zoom = zoom
        self.cql = cql
        self.render_params = render_params
        self.tiles = list(tiles(*bbox, zoom))
        self.frame_duration = frame_duration
        self.tile_size = 512

        logging.info(f"Concurrency limit: {concurrency_limit}")
        logging.info(f"API URL: {api_url}")

        if len(self.tiles) > MAX_TILE_COUNT:
            raise BBoxTooLargeError(
                f"Export area is too large, please draw a smaller area or zoom out."
                f" ({len(self.tiles)} of {MAX_TILE_COUNT} max tiles requested)"
            )

    async def _get_tilejson(self, the_date: str) -> str:
        non_temporal_args = [
            arg
            for arg in self.cql["filter"]["args"]
            if arg["args"][0]["property"] != "datetime"
        ] + [
            {
                "op": "<=",
                "args": [{"property": "datetime"}, {"timestamp": the_date}],
            }
        ]

        frame_cql = deepcopy(self.cql)
        frame_cql["filter"]["args"] = non_temporal_args
        logging.info(f"Registering {the_date}")

        async with aiohttp.ClientSession() as session:
            # Register the search and get the tilejson_url back
            async with session.post(self.registerUrl, json=frame_cql) as resp:
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
                        logging.warning(f"Tile request: {resp.status} {url}")
                        img_bytes = Image.new(
                            "RGB", (self.tile_size, self.tile_size), "gray"
                        )
                        empty = io.BytesIO()
                        img_bytes.save(empty, format="png")
                        return empty

    async def get(self, step: int, unit: str, start: datetime, total_frames: int):
        frames = []

        delta = get_relative_delta(unit, step)
        next_date = start
        for frame_num in range(total_frames):
            frames.append(asyncio.ensure_future(self._get_frame(next_date)))
            next_date += delta

        image_frames = await asyncio.gather(*frames)
        gif = image_frames[0]
        output = io.BytesIO()
        gif.save(
            output,
            format="GIF",
            append_images=image_frames[1:],
            optimize=True,
            save_all=True,
            duration=self.frame_duration,
            loop=0,
        )

        return output

    async def _get_frame(self, date: datetime) -> io.BytesIO:
        tile_path = await self._get_tilejson(date.isoformat())

        tasks = []
        for tile in self.tiles:
            url = (
                tile_path.replace("{x}", str(tile.x))
                .replace("{y}", str(tile.y))
                .replace("{z}", str(tile.z))
            )
            tasks.append(asyncio.ensure_future(self._get_tile(url)))

        tile_images = await asyncio.gather(*tasks)
        frame = AnimationFrame(self.tiles, tile_images, self.bbox, self.tile_size)
        return frame.get_mosaic()
