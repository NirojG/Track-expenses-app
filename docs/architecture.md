# Application architecture

## Foundation

One Expo application targets Android and iOS. Expo Router owns navigation;
TypeScript uses strict mode. React Native styles and system fonts avoid a UI
framework or remote font dependency. Web is a convenient UI preview, not yet a
promise of feature parity with native storage and capture.

## Planned boundaries

- `src/app/`: route files and navigation layouts.
- `src/components/`: reusable presentation components.
- `src/theme/`: shared colors, spacing, and corner radii.
- `src/features/expenses/`: expense types, calculations, and pure parsing logic
  when expense recording is implemented.
- `src/storage/`: SQLite access and versioned migrations when persistence is added.

Add directories as they become useful rather than scaffolding empty layers.
Screens will call expense operations instead of containing SQL. Start with local
React state and context; add a state library only if there is a demonstrated need.

## Data decisions for the next milestones

- Store amounts as integer minor units with an explicit currency; never add
  totals across currencies without a defined conversion policy.
- Keep a purchase's local calendar date separate from record timestamps.
- Use stable record identifiers so synchronization can be added later.
- Persist receipt files in app-private storage before processing them. Track
  pending, processing, review-required, and completed states explicitly.
- A saved image does not mean an expense has been recorded. Failed extraction
  must preserve the image and offer correction without inventing amounts.
- Keep amount/date parsing pure and test it before using it to save records.

## Privacy

The foundation has no expense storage, camera, microphone, analytics, backend, or
upload integration. Future native capture permissions must be requested only in
response to a capture action. App-private storage alone must not be described as
encrypted storage. OCR and speech choices require a privacy and offline-support
review before implementation; no paid or cloud processing service is selected.

## Incremental milestones

1. Runnable Expo foundation, navigation, theme, and home screen shell.
2. SQLite persistence and a dashboard driven by real expense data.
3. Natural-language text recording, corrections, and calculations with tests.
4. Receipt capture, durable image storage, and background extraction.
5. Speech recognition feeding the same expense parser.
6. Search, duplicate detection, undo, accessibility, and performance refinement.
7. Android/iOS device testing and release preparation.

Work on `development`, commit coherent verified changes, and push completed
milestones. Do not merge into `main` without approval. Native build and device
checks remain distinct from successful JavaScript bundle exports.
