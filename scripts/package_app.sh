#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/.build"
RELEASE_DIR="$ROOT_DIR/dist"
APP_NAME="MacIsland"
BUNDLE_ID="com.yeecannnn.macisland"
EXECUTABLE_NAME="MacDynamicIsland"
APP_DIR="$RELEASE_DIR/$APP_NAME.app"
CONTENTS_DIR="$APP_DIR/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
ZIP_PATH="$RELEASE_DIR/$APP_NAME.zip"
DMG_PATH="$RELEASE_DIR/$APP_NAME.dmg"

mkdir -p "$RELEASE_DIR"

echo "==> Building release binary"
cd "$ROOT_DIR"
swift build -c release

BIN_PATH="$BUILD_DIR/arm64-apple-macosx/release/$EXECUTABLE_NAME"
if [[ ! -x "$BIN_PATH" ]]; then
  echo "Release binary not found at: $BIN_PATH" >&2
  exit 1
fi

echo "==> Creating app bundle"
rm -rf "$APP_DIR" "$ZIP_PATH" "$DMG_PATH"
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR"
cp "$BIN_PATH" "$MACOS_DIR/$APP_NAME"

cat > "$CONTENTS_DIR/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>zh_CN</string>
  <key>CFBundleDisplayName</key>
  <string>$APP_NAME</string>
  <key>CFBundleExecutable</key>
  <string>$APP_NAME</string>
  <key>CFBundleIdentifier</key>
  <string>$BUNDLE_ID</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>$APP_NAME</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>0.1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>LSMinimumSystemVersion</key>
  <string>14.0</string>
  <key>LSUIElement</key>
  <true/>
  <key>NSCalendarsUsageDescription</key>
  <string>需要访问日历以在灵动岛中展示今日安排。</string>
  <key>NSRemindersUsageDescription</key>
  <string>需要访问提醒事项以在灵动岛中展示待办清单。</string>
  <key>NSUserNotificationUsageDescription</key>
  <string>需要通知权限以发送计时器和健康提醒。</string>
</dict>
</plist>
EOF

echo "==> Creating zip package"
ditto -c -k --sequesterRsrc --keepParent "$APP_DIR" "$ZIP_PATH"

echo "==> Creating dmg package"
hdiutil create -volname "$APP_NAME" -srcfolder "$APP_DIR" -ov -format UDZO "$DMG_PATH" >/dev/null

echo "==> Done"
echo "App bundle: $APP_DIR"
echo "Zip package: $ZIP_PATH"
echo "DMG package: $DMG_PATH"
