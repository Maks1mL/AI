#!/bin/bash

# Step 1: Navigate to the public folder, delete the build folder, and return to the parent directory
echo "Navigating to the public folder..."
cd public || { echo "Failed to navigate to the public folder. Exiting."; exit 1; }

if [ -d "build" ]; then
    echo "Deleting the existing build folder..."
    rm -rf build || { echo "Failed to delete the build folder. Exiting."; exit 1; }
else
    echo "Build folder does not exist, skipping deletion."
fi

echo "Returning to the parent directory..."
cd ..

# Step 2: Run the npm run build command
echo "Running 'npm run build'..."
npm run build || { echo "Failed to run 'npm run build'. Exiting."; exit 1; }

# Step 3: Create a zip of the full folder excluding node_modules and .git folders
FOLDER_NAME=$(basename "$PWD")
ZIP_FILE="${FOLDER_NAME}.zip"

echo "Creating a zip archive of the folder '$FOLDER_NAME' excluding 'node_modules' and '.git'..."

# Exclude node_modules and .git folders while creating the zip
zip -r "$ZIP_FILE" . -x "node_modules/*" ".git/*" || { echo "Failed to create the zip archive. Exiting."; exit 1; }

echo "Zip archive '$ZIP_FILE' created successfully."