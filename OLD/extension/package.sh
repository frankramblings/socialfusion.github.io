#!/bin/bash

# Create a zip file of the extension for distribution
mkdir -p dist
zip -r dist/transparent-classroom-mobile-skin.zip manifest.json popup.html popup.js content.js mobile-style.css icons/*
echo "Extension packaged to dist/transparent-classroom-mobile-skin.zip"