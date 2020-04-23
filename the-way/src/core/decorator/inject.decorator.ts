import 'reflect-metadata';

import { CORE } from '../core';

export function Inject() {
  return (target: any, key: string) => {
    const coreInstance = CORE.getCoreInstance();
    const constructor = Reflect.getMetadata('design:type', target, key);
    coreInstance.registerDependency(constructor, target, key);
  }
}