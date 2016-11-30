#!/bin/bash

# This script increments patch version number in package.json according to a SEMVER spec.

# Find package.json inside project tree.
# This allows to call bash scripts within any folder inside project.
PROJECT_DIR=$(git rev-parse --show-toplevel)
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo "[E] Can't find '${PROJECT_DIR}/package.json'"
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

# Increment patch version
# Source: https://github.com/fmahnke/shell-semver/blob/master/increment_version.sh
a=( ${PROJECT_VERSION//./ } )
((a[2]++))
NEW_PROJECT_VERSION="${a[0]}.${a[1]}.${a[2]}"

echo "[I] Incrementing project version from '${PROJECT_VERSION}' to '${NEW_PROJECT_VERSION}' in 'package.json'."
sed -i'' -e "s/\"version\": \"${PROJECT_VERSION}\"/\"version\": \"${NEW_PROJECT_VERSION}\"/g" "${PROJECT_DIR}/package.json"
# Here you can modify other files (for eg. README.md) that contains version.
