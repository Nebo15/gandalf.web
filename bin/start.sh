#!/bin/bash

# This script starts a local Docker container with created image.

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
HOST_IP=`ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' | head -n 1`
HOST_NAME="travis"

echo "[I] Starting a Docker container '${PROJECT_NAME}' (version '${PROJECT_VERSION}') from path '${PROJECT_DIR}'.."
echo "[I] Assigning parent host '${HOST_NAME}' with IP '${HOST_IP}'."

echo "${HOST_NAME}:${HOST_IP}"

docker run -p 8080:8080 \
       -d \
       --restart=always \
       --env .env \
       --name ${PROJECT_NAME} \
       "${PROJECT_NAME}:${PROJECT_VERSION}"
