#!/bin/bash
# Package the Scripta project as a production-ready zip.
# Excludes: node_modules, .next, db/*.db, dev logs, base_repo, base.zip,
# agent-ctx, screenshots, .zscripts (these are env-specific).

set -e

cd /home/z/my-project

OUTPUT_ZIP="/home/z/my-project/download/scripta-production-ready.zip"
STAGE_DIR="/home/z/my-project/.stage-scripta-zip"

# Clean any prior stage
rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR/scripta"

# Copy project files (explicit list of what to include — safer than excluding)
rsync -av --quiet \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='base_repo' \
  --exclude='base.zip' \
  --exclude='.zscripts' \
  --exclude='.stage-scripta-zip' \
  --exclude='dev.log' \
  --exclude='server.log' \
  --exclude='db/*.db' \
  --exclude='db/*.db-journal' \
  --exclude='download' \
  --exclude='agent-ctx' \
  --exclude='tool-results' \
  --exclude='.turbo' \
  --exclude='coverage' \
  --exclude='out' \
  --exclude='build' \
  --exclude='tests' \
  --exclude='skills' \
  --exclude='examples' \
  ./ "$STAGE_DIR/scripta/"

# Ensure the db directory exists (empty) so the new owner can run db:push
mkdir -p "$STAGE_DIR/scripta/db"
echo "# SQLite database files will be created here by \`bun run db:push\`" > "$STAGE_DIR/scripta/db/.gitkeep"

# Create the zip
cd "$STAGE_DIR"
zip -rq "$OUTPUT_ZIP" "scripta"
cd /home/z/my-project

# Clean up the stage
rm -rf "$STAGE_DIR"

# Report
ls -lh "$OUTPUT_ZIP"
echo "✓ Production zip created at: $OUTPUT_ZIP"
echo ""
echo "Contents:"
unzip -l "$OUTPUT_ZIP" | tail -5
