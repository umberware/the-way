[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/handler/file.handler.ts)

## FileHandler

FileHandler is responsible to scan and 'import' the files that has [CoreDecorators](documentation/the-way/core/decorator/application-components-decorators.md)
and match to the [scan properties](documentation/the-way/core/application-properties.md#the-waycorescan)

**The FileHandler will change when [TheWayCli](https://github.com/umberware/the-way/issues/47) is created,
because TheWayCli will be the responsible to generate: the final code, and the bundle with the "scanned" components**

## Summary
 - [Method: initialize](#method-initialize)

## Method: initialize

This method is called in the Core to scan the directory and import files decorated with [CoreDecorators](documentation/the-way/core/decorator/application-components-decorators.md)
The [scan properties](documentation/the-way/core/application-properties.md#the-waycorescan) will be used to determine the place to scan and files/directories to be excluded. Also, the property "path" will be contextualized in a built code execution