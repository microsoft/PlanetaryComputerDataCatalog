#!/bin/bash

# Build the docs directory with the JSON output type.
sphinx-build -b json . _build -v

# Copy over all of the *.fjson files to our src/docs directory,
# preserving the directory structure.
pushd _build
find . -name '*.fjson' -exec cp --parents \{\} ../../src/docs \;
popd

# Not currently using these files, remove them so they aren't imported
# into the app.
rm ../src/docs/genindex.fjson
rm ../src/docs/search.fjson
rm ../src/docs/README.json

# Rename all fjson files to json.
# See: https://mywiki.wooledge.org/BashFAQ/030
find ../src/docs -type f -name '*.fjson' -print0 | while IFS= read -r -d '' f; do
  mv -- "$f" "${f%.fjson}.json"
done

# We also need the contents of the _images directory moved to the static build
# directory. Since these aren't imported into the app, they are not put in the
# src tree.
pushd _build
cp --parents _images/*.png ../../public
popd
