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

The text-first version stores expenses in local SQLite. Open **Type expense**,
try “Paid €35 for groceries at Lidl yesterday”, review the result, and save.
Separate multiple purchases with semicolons. Use EUR, USD, or GBP and include
a currency for each amount. Dates can be today, yesterday, or YYYY-MM-DD.

The dashboard shows totals by currency, category, and time period. History
supports search, category filters, editing, and deletion. You can undo the
latest change during the current app session.

Receipt scanning and voice recording remain previews. No account, backend, or
paid service is required. Local data is stored in app storage on native devices
or in browser storage on web. The app has no sync or export. Clearing app or
site data can remove expenses.

Shared screen spacing lives in `src/components/screen.tsx`, design tokens in
`src/theme/theme.ts`, and route screens in `src/app/`. See
[architecture](docs/architecture.md) for the planned data boundaries and
[verification notes](docs/verification.md) for checks and known limitations.

Run `npm test` for parser, spending summary, and SQLite repository tests.
For web use `npm run web`. A deployed static web build needs cross-origin
isolation headers for SQLite, as documented by Expo.

The project was initialized from Expo's default template. Its MIT license and
copyright notice are retained in `LICENSE`.
