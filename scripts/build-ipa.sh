#!/usr/bin/env bash
# Build a manually-signed App Store .ipa for Calks UK, ready to drop into Transporter.
# No Xcode automatic signing — uses your installed Apple Distribution cert + the
# App Store provisioning profile you create on developer.apple.com.
#
# Prereq (one-time, on developer.apple.com → Certificates, Identifiers & Profiles):
#   1. Identifiers → register App ID  uk.calks.app
#   2. Profiles → App Store → App ID uk.calks.app → cert "Apple Distribution"
#      → download → double-click to install.
# Then: bash scripts/build-ipa.sh   →   ios/build/export/App.ipa
set -euo pipefail
cd "$(dirname "$0")/.."

TEAM="SRKYS78RMQ"                 # your App Store team (same as Calk NZ)
BUNDLE="uk.calks.app"
PROJ="ios/App/App.xcodeproj"
SCHEME="App"
BUILD="ios/build"
ARCHIVE="$BUILD/App.xcarchive"
EXPORT="$BUILD/export"
INSTALL_DIR="$HOME/Library/MobileDevice/Provisioning Profiles"
PROFILE_DIRS=(
  "$INSTALL_DIR"
  "$HOME/Library/Developer/Xcode/UserData/Provisioning Profiles"
)
mkdir -p "$INSTALL_DIR"

# 1a) if you just downloaded the profile, auto-install it from ~/Downloads
while IFS= read -r dl; do
  plist=$(security cms -D -i "$dl" 2>/dev/null) || continue
  [ "$(printf '%s' "$plist" | plutil -extract Entitlements.application-identifier raw - 2>/dev/null)" = "$TEAM.$BUNDLE" ] || continue
  uuid=$(printf '%s' "$plist" | plutil -extract UUID raw - 2>/dev/null)
  cp -f "$dl" "$INSTALL_DIR/$uuid.mobileprovision"
  echo "→ installed profile from Downloads ($uuid)"
done < <(find "$HOME/Downloads" -maxdepth 1 -name '*.mobileprovision' 2>/dev/null)

# 1b) find the installed App Store profile for uk.calks.app and read its exact name
PROFILE_NAME=""
for D in "${PROFILE_DIRS[@]}"; do
  [ -d "$D" ] || continue
  while IFS= read -r p; do
    plist=$(security cms -D -i "$p" 2>/dev/null) || continue
    [ "$(printf '%s' "$plist" | plutil -extract Entitlements.application-identifier raw - 2>/dev/null)" = "$TEAM.$BUNDLE" ] || continue
    PROFILE_NAME=$(printf '%s' "$plist" | plutil -extract Name raw - 2>/dev/null)
    break 2
  done < <(find "$D" -name '*.mobileprovision' 2>/dev/null)
done

if [ -z "$PROFILE_NAME" ]; then
  echo "✗ No installed App Store provisioning profile for $BUNDLE."
  echo "  Create it at developer.apple.com (Profiles → App Store → App ID $BUNDLE),"
  echo "  download and double-click to install, then re-run this script."
  exit 1
fi
echo "✓ Profile: \"$PROFILE_NAME\"  (team $TEAM, cert Apple Distribution)"

# 2) refresh the bundled web + stamp a build id (so OTA only updates when the server is newer)
echo "→ building web bundle + syncing iOS…"
npm run build:ios

# 3) ExportOptions for a manually-signed App Store export
mkdir -p "$BUILD"
cat > "$BUILD/ExportOptions.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>teamID</key><string>$TEAM</string>
  <key>signingStyle</key><string>manual</string>
  <key>signingCertificate</key><string>Apple Distribution</string>
  <key>provisioningProfiles</key><dict>
    <key>$BUNDLE</key><string>$PROFILE_NAME</string>
  </dict>
  <key>uploadSymbols</key><true/>
  <key>destination</key><string>export</string>
</dict></plist>
PLIST

# 4) archive (Release, device) with manual signing
rm -rf "$ARCHIVE" "$EXPORT"
echo "→ archiving…"
# Signing is configured on the App target's Release config in the project
# (CODE_SIGN_STYLE=Manual + Apple Distribution + the profile), so we pass NO
# global signing settings here — that would wrongly hit the SPM library targets
# (Alamofire/ZIPFoundation) which can't take a provisioning profile.
xcodebuild -project "$PROJ" -scheme "$SCHEME" -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$ARCHIVE" \
  archive

# 5) export the .ipa
echo "→ exporting .ipa…"
xcodebuild -exportArchive -archivePath "$ARCHIVE" \
  -exportOptionsPlist "$BUILD/ExportOptions.plist" -exportPath "$EXPORT"

IPA=$(ls "$EXPORT"/*.ipa 2>/dev/null | head -1)
echo
echo "✅ Done:  $IPA"
echo "   Open Transporter → drag this .ipa in → Deliver."
