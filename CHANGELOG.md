# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.2.0] - 2026-05-30

### Added
- Multi-cell range selection with Shift+Click and Shift+Arrow keys
- Multi-range selection with Ctrl/Cmd+Click (non-contiguous ranges)
- Mouse drag selection with Shift and Ctrl/Cmd support
- Active selection range displayed in formula bar name box

### Fixed
- Prevent default on Enter/Shift+Enter when opening cell editor
- Clear selection before extending on Shift+Click

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