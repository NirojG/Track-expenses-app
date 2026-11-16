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

The foundation includes a blue-and-white home screen, three recording preview
routes, and an empty expense history screen. All recording actions are clearly
marked as previews. Expense storage, parsing, receipt scanning, and voice
recording are not implemented yet. No paid services or backend are required.

Shared screen spacing lives in `src/components/screen.tsx`, design tokens in
`src/theme/theme.ts`, and route screens in `src/app/`. See
[architecture](docs/architecture.md) for the planned data boundaries and
[verification notes](docs/verification.md) for checks and known limitations.

The next milestone is SQLite storage and a dashboard driven by real expenses.

The project was initialized from Expo's default template. Its MIT license and
copyright notice are retained in `LICENSE`.
