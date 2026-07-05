# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-07-06

### Added

- Online playground: `examples/basic` runnable directly on StackBlitz / CodeSandbox,
  linked from the README
- More npm keywords and GitHub topics for discoverability

## [1.1.0] - 2026-07-05

### Added

- Mouse wheel scrolling on spinner columns, with debounced snap-to-nearest (desktop)
- Tap/click an item to select it directly (drag gestures do not trigger it)
- iOS-style rubber-band resistance when dragging past the first/last item
- `Escape` key dismisses the picker modal
- Focus management: focus moves into the sheet on open, `Tab` cycles within it
  (focus trap), and focus returns to the trigger on close
- New `clampMonthToRange()` utility (exported)
- CI workflow running tests and builds on every push/PR
- `prepublishOnly` script so `npm publish` always ships a freshly built, tested dist

### Fixed

- **Out-of-range confirm**: opening the picker with a `modelValue` (or today's
  date) outside `[minMonth, maxMonth]` and pressing Confirm immediately could
  emit an out-of-range value. Initial position is now clamped into range on
  open, and Confirm clamps as a final guard.
- Year items whose months are all outside `[minMonth, maxMonth]` are now disabled
- `teleportTo` prop was declared but ignored; the modal now actually teleports
  to the given target (default `body`)
- `document` mouse listeners and the pending wheel-snap timer are cleaned up
  when a spinner unmounts mid-interaction
- README theming docs now list the CSS variable names the code actually reads
  (`--vmp-backdrop`, `--vmp-spinner-highlight-bg`, `--vmp-spinner-fade-color`),
  and the documented `yearRange` default was corrected to `[now-10, now+5]`

## [1.0.1] - 2026-02-20

### Added

- `repository`, `homepage`, and `bugs` fields in package.json for npm page links

## [1.0.0] - 2026-02-20

### Added

- Initial release: iOS-style drum-roll spinner month picker for Vue 3
- `MonthPicker` component with bottom sheet modal, inertia scrolling,
  min/max month constraints, year range, error state, custom trigger slot
- Built-in locales: English, Korean, Japanese + `mergeLocale()` for custom locales
- CSS Custom Properties theming
- ESM + CJS builds with TypeScript declarations

[1.1.1]: https://github.com/jlc488/vue-month-spinner-picker/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/jlc488/vue-month-spinner-picker/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/jlc488/vue-month-spinner-picker/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/jlc488/vue-month-spinner-picker/releases/tag/v1.0.0
