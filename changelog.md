# The Way Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Unreleased

In this version the library was refactored and this is the new beginning.

### Added

- **changelog.md:** Was been added.

### Changed

- **Repository changed:** Now the project is under UmberWare organization;
- **the-way.server.file.assets & the-way.server.file.static:** Now to use assets and/or static property, you must pass true in the property field "enabled". Ex.: the-way.server.file.static=true.
Also, when full = false the *file path* will be concated in the static/assets path. If the path haven't slash at the begging will be appended (when full = false)
- **the-way.server.file.path:** If the path haven't slash at the begging will be appended (when full = false)

### Removed

- Nothing to document;

### Fixed

- **static properties:** The static properties now will receive the correct property from the application.properties.yml
