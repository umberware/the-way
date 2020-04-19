import 'reflect-metadata';

import { CORE } from '../core';

export function Application() {
  return (constructor: Function) => {
      CORE.getInstance().buildApplication(constructor);
  }
}