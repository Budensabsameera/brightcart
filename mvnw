#!/usr/bin/env sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BACKEND_DIR="$SCRIPT_DIR/brightcart-main/backend"

if [ ! -x "$BACKEND_DIR/mvnw" ]; then
  chmod +x "$BACKEND_DIR/mvnw"
fi

"$BACKEND_DIR/mvnw" -f "$BACKEND_DIR/pom.xml" "$@"

JAR_NAME="ecommerce-backend-0.0.1-SNAPSHOT.jar"
SOURCE_JAR="$BACKEND_DIR/target/$JAR_NAME"

if [ -f "$SOURCE_JAR" ]; then
  mkdir -p "$SCRIPT_DIR/target"
  cp "$SOURCE_JAR" "$SCRIPT_DIR/target/$JAR_NAME"
fi
