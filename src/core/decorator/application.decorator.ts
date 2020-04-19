import 'reflect-metadata';

import { CORE, CORE_CALLED } from '../core';

export function Application(...customInstances: Array<Function>) {
  return (constructor: Function) => {
    CORE.getInstance().buildApplication(constructor, customInstances);
    if (CORE_CALLED > 1) {
      throw new Error('The core are called more than one time.');
    }

    if (CORE.enabledDecoratorLog) {
      console.log('Application is fully loaded.')
    }
  }
}