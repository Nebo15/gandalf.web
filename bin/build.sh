#!/bin/bash

# This script builds an image based on a Dockerfile and package.json that is located in root of git working tree.

# Find package.json inside project tree.
# This allows to call bash scripts within any folder inside project.
PROJECT_DIR=$(git rev-parse --show-toplevel)
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo "[E] Can't find '${PROJECT_DIR}/package.json'."
    echo "    Check that you run this script inside git repo or init a new one in project root."
fi

# Extract project name and version from package.json
PROJECT_NAME=$(cat "${PROJECT_DIR}/package.json" \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
PROJECT_VERSION=$(cat "${PROJECT_DIR}/package.json" \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "[I] Build a WebApp"

npm run build

echo "[I] Building a Docker container '${PROJECT_NAME}' (version '${PROJECT_VERSION}') from path '${PROJECT_DIR}'.."

docker build --tag "${PROJECT_NAME}:${PROJECT_VERSION}" \
             --file "${PROJECT_DIR}/Dockerfile" \
             $PROJECT_DIR
