## DependencyHandler

DependencyHandler is responsible to generate the tree dependencies. This tree will be used in the [InstanceHandler](instance-handler.md)
to resolve all the dependencies and injections of the application.

### Summary

 - [ Method: buildDependenciesTree](#method-builddependenciestree)
 - [ Method: getDependenciesTree](#method-getdependenciestree)

### Method: buildDependenciesTree

This method is called to build the tree. When a class has a property decorated with [@Inject](documentation/the-way/core/decorator/core-decorators.md),
the [RegisterHandler](register-handler.md) will be called to register this dependency and this dependency will be used to in this method to generate the
[DependencyTree](documentation/the-way/core/shared/model/dependency-tree-model.md)

### Method: getDependenciesTree

When a dependencies tree is built, you can get the tree with this method.

Return:

DEPENDENCIES_TREE: [DependencyTree](documentation/the-way/core/shared/model/dependency-tree-model.md)