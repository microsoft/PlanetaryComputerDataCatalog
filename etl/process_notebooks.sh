#!/bin/bash

if ! command -v jupyter nbconvert &> /dev/null
then
    echo "nbconvert could not be found. Did you install requirements.txt?"
    exit
fi

# Download all the notebooks specified
wget -i notebook_urls.txt -P ./downloaded

# Convert the notebooks to a basic html output, without body or style tags
jupyter nbconvert --to html --template basic ./downloaded/*.ipynb 

# Move into an accessible folder for the app at build-time
mv downloaded/*.html ../metadata/notebooks

# Clean up downloaded files
rm downloaded/*.ipynb