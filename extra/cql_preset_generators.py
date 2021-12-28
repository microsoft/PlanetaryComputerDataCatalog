import xmltodict
import json
import webcolors
import click


@click.command()
@click.argument("file", type=click.Path(exists=True))
def qml(file):
    with open(file) as f:
        d = xmltodict.parse(f.read())
        cm = d["qgis"]["pipe"]["rasterrenderer"]["colorPalette"]["paletteEntry"]
        pyc = dict()
        for c in cm:
            r, g, b = list(webcolors.hex_to_rgb(c["@color"]))
            pyc[int(c["@value"])] = (r, g, b, 255)

        print(json.dumps(pyc))


def season_repeater():
    seasons = [
        {"l": "Winter", "s": "12-01T00:00:00Z", "e": "02-28T23:59:59Z"},
        {"l": "Spring", "s": "03-01T00:00:00Z", "e": "05-31T23:59:59Z"},
        {"l": "Summer", "s": "06-01T00:00:00Z", "e": "08-31T23:59:59Z"},
        {"l": "Fall", "s": "09-01T00:00:00Z", "e": "11-30T23:59:59Z"},
    ]

    chunks = []
    for year in range(2018, 2022):
        for i, season in enumerate(seasons):
            syear = year - 1 if i == 0 else year
            x = {
                "name": f"{season['l']} {year} (low cloud)",
                "description": "",
                "cql": [
                    {
                        "anyinteracts": [
                            {"property": "datetime"},
                            [f"{syear}-{season['s']}", f"{year}-{season['e']}"],
                        ]
                    },
                    {"op": "<=", "args": [{"property": "eo:cloud_cover"}, 10]},
                ],
            }
            chunks.append(x)
    chunks.reverse()
    print(json.dumps(chunks))


def year_repeater():
    years = []
    for year in range(2009, 2019):
        stock = {
            "name": f"{year}",
            "description": "",
            "cql": [
                {
                    "op": "anyinteracts",
                    "args": [
                        {"property": "datetime"},
                        [f"{year}-01-01:T00:00:00Z", f"{year}-12-31T23:59:59Z"],
                    ],
                }
            ],
        }
        years.append(stock)

    years.reverse()
    print(json.dumps(years))


if __name__ == "__main__":
    season_repeater()
