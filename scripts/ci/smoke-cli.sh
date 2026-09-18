#!/usr/bin/env bash
set -euo pipefail

PACKAGE="${1:?Usage: smoke-cli.sh <package.tgz>}"
PACKAGE="$(realpath "$PACKAGE")"

TEST_DIR="$(mktemp -d)"
trap 'rm -rf "$TEST_DIR"' EXIT

cd "$TEST_DIR"

npm init --yes >/dev/null 2>&1
npm install --ignore-scripts "$PACKAGE" >/dev/null 2>&1

SHAPIT="./node_modules/.bin/shapit"

if [[ ! -x "$SHAPIT" ]]; then
  echo "shapit binary was not installed"
  exit 1
fi

echo "Testing --help"
"$SHAPIT" --help >/dev/null

echo "Testing --version"
"$SHAPIT" --version >/dev/null

echo "Testing invalid CLI option"
set +e
"$SHAPIT" --definitely-invalid-option >/dev/null 2>&1
CODE=$?
set -e

if [[ "$CODE" -ne 2 ]]; then
  echo "Expected exit code 2, got $CODE"
  exit 1
fi

echo "CLI smoke tests passed"