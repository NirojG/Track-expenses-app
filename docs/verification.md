# Verification notes

## Foundation checks

Run `npm run check`, `npx expo-doctor`, and
`npx expo export --platform all` before pushing the foundation.
Exports validate JavaScript bundling; they do not prove native compilation,
device behavior, accessibility, or App Store readiness.

## Known dependency advisory

The initial npm audit reports three moderate findings for one dependency chain:
`expo` → `@expo/fingerprint` → `minimatch`.
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
concerns denial of service from glob pattern amplification. This is in Expo's
fingerprinting tooling; the application does not accept glob patterns from users.
The finding is not resolved. Follow upstream fixes and re-run `npm audit` after
dependency updates. Do not apply `npm audit fix --force`: the proposed fix
downgrades Expo to SDK 52 and breaks the selected SDK baseline.

## Device checks still required

- Open on Android and iOS; verify navigation and system back gestures.
- Check small screens, landscape, larger text, and screen-reader labels.
- Confirm that the foundation requests no camera or microphone permission.
- Verify native builds before treating the application as ready for release.
