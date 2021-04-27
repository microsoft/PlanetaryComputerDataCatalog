import os
import sys
from urllib.parse import urljoin

import requests
import yaml

# Default URL root prefix for relative notebook paths. Can be overridden with a URL
# provided as the first argument to this script.
DEFAULT_URL = (
    "https://raw.githubusercontent.com/microsoft/PlanetaryComputerExamples/main/"
)


def download_to(url, filepath):

    resp = requests.get(url)
    filename = filepath.split("/")[-1]

    if resp.status_code == 200:
        # Make the destination directory
        path = filepath[: filepath.rindex("/")]
        os.makedirs(path, exist_ok=True)

        print(f"Syncing {filename}")

        with (open(filepath, "wb")) as f:
            f.write(resp.content)
    else:
        print(resp.content)
        print(f"Error syncing {filename}, skipping")


def fetch_config_files(root_url):
    with open("config/external_docs_config.yml") as file:
        config = yaml.load(file, Loader=yaml.FullLoader)

        for entry in config:
            # Entry URLs are relative to the default root_url
            entry_url = entry["file_url"]
            download_url = urljoin(root_url, entry_url)
            local_path = os.path.join("_docs_working_dir", entry_url)

            download_to(download_url, local_path)

            for image in entry.get("image_urls", []):
                image_url = urljoin(root_url, image)
                image_path = os.path.join("_docs_working_dir", image)
                download_to(image_url, image_path)


if __name__ == "__main__":
    root_url = (len(sys.argv) > 1 and sys.argv[1]) or DEFAULT_URL
    fetch_config_files(root_url)
