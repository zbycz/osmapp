#!/bin/bash

# Courtesy of ChatGPT

cd public

# Define the high-resolution logo image
logo_image="logo-map-et.png"

# Check if the logo image exists
if [ ! -f "$logo_image" ]; then
    echo "Error: $logo_image not found in the current directory."
    exit 1
fi

# Find all image files (.png, .ico, .svg) in the osmapp directory and its subdirectories
find osmapp -type f \( -name "*.png" -o -name "*.ico" -o -name "*.svg" \) | while read -r image_file; do
   if [[ "$image_file" == *osmapp-screenshot*.png ]]; then
        echo "Skipping $image_file (osmapp-screenshot.png)..."
        continue
    fi

    # Check if the file is an SVG
    if [[ "$image_file" == *.svg ]]; then
        echo "Copying $logo_image to $image_file (SVG file)..."
        cp "$logo_image" "$image_file"
        continue
    fi

    # Get the width and height of the original image for PNG/ICO files
    original_size=$(identify -format "%wx%h" "$image_file")

    if [ $? -ne 0 ]; then
        echo "Error: Could not identify the size of $image_file"
        continue
    fi

    # If the filename contains "maskable", add a white background
    if [[ "$image_file" == *maskable* ]]; then
        echo "Adding white background to $image_file (maskable)..."
        convert "$logo_image" -resize "$original_size" \
            -background white -gravity center -extent "$original_size" \
            "$image_file"
        continue
    fi

    # If the filename contains "splash", resize the logo to 10% and center it with a white background
    if [[ "$image_file" == *splash* ]]; then
        echo "Handling splash screen for $image_file..."

        # Resize the logo to 10% of the original image's size
        splash_logo_size=$(identify -format "%wx%h" "$image_file" | awk -F'x' '{printf "%.0fx%.0f", $1*0.2, $2*0.2}')

        # Create a white background and place the resized logo at the center
        convert -size "$original_size" canvas:white \
            \( "$logo_image" -resize "$splash_logo_size" \) \
            -gravity center -composite \
            "$image_file"
        continue
    fi

    # For all other PNG/ICO files, simply resize the logo and replace the file
    echo "Replacing $image_file with scaled $logo_image ($original_size)..."
    convert "$logo_image" -resize "$original_size" "$image_file"
done
