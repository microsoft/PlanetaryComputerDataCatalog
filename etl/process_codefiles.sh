#!/bin/bash

if ! command -v jupyter nbconvert &> /dev/null
then
    echo "nbconvert could not be found. Did you install requirements.txt?"
    exit
fi

# Download all the notebooks and markdown files specified
wget -i codefiles_urls.txt -P ./processing

# Convert the notebooks to a basic html output, without body or style tags
jupyter nbconvert --to html --template basic ./processing/*.ipynb 

# Clean up processing files
rm processing/*.ipynb