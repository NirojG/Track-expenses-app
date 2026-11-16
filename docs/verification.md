# Verification notes

## Foundation checks

Validated on Windows with Node 26.13.1 and npm 11.20.0:

- `npm run check`: TypeScript and ESLint passed.
- `npx expo-doctor`: 20/20 checks passed.
- `npx expo export --platform all --max-workers 2`: Android, iOS, and web
  exports passed, including all five application routes.

Exports validate JavaScript bundling; they do not prove native compilation,
device behavior, accessibility, or App Store readiness.
The in-app browser could not attach to the preview, so visual layout and
interactive navigation have not been verified in a browser or on a device.

For a manual smoke test, run `npm run web`. Open each of Scan receipt, Record by
voice, and Type expense; confirm the preview explains that nothing is saved.
Use Back to home, then View history. Also try browser back/forward and direct
navigation to `/history` and `/record/type`.

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
