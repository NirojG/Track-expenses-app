# Track Expenses

A local-first expense tracker for Android and iOS, built with Expo, React Native,
TypeScript, and Expo Router. The project is being developed incrementally.

## Local development

Use a supported Node.js LTS release and npm.

```sh
npm ci
npm start
```

Open the QR code in a compatible Expo Go installation on your phone. Use
`npm run android` with a configured Android emulator or `npm run web` for a
browser preview. A local iOS simulator requires macOS and Xcode.

```sh
npm run check
npx expo-doctor
npx expo export --platform all
```

Development takes place on `development`. Completed, checked milestones are
committed and pushed there; merging into `main` requires approval.

## Status

Foundation in progress. Expense storage, parsing, receipt scanning, and voice
recording are not implemented yet. No paid services or backend are required.

The project was initialized from Expo's default template. Its MIT license and
copyright notice are retained in `LICENSE`.
