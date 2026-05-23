# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.0] - 2026-05-23

### Added
- Fill handle dot on active cell
- Clear cell content with Delete and Backspace keys
- Hover style on sheet tab chevron icon
- Custom text selection color

### Changed
- Cell editor border replaced with accent glow shadow
- Table cells now use Roboto font; Manrope weights adjusted

### Fixed
- Visual layout bugs

## [1.0.0] - 2026-05-14

### Added
- Initial project setup: Vite + Vue 3 + TypeScript + Tailwind CSS
- Main page: table list with creation, renaming, deletion
- Dark theme with toggle and smooth transition
- Responsive layout for main page
- Header with search/filter inputs
- Sorting tables by title and date (ascending/descending)
- Dropdown menu with floating-vue
- Table page: full layout — header, toolbar, formula bar, table grid, sheets footer
- IndexedDB persistence for tables, sheets, columns, rows, cells
- Sheet CRUD (create, rename, delete)
- Column and row resizing
- Active cell with multiline input support
- 30 custom SVG icons
- Font: Manrope

### Fixed
- Footer overlap on mobile