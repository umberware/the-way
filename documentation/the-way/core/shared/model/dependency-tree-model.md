## DependencyTreeModel

This interface represents the dependency tree. The dependency tree is built in [DependencyHandler](documentation/the-way/core/handler/dependency-handler.md)

Properties:

 - *\[key: string\]*: Is a generic field, and the key is the dependent class name.
   The value of this key can be true when the dependent has no dependencies, or a DependencyTreeModel when the dependent has dependencies