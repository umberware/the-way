import 'reflect-metadata';

import { CORE } from '../core';

export function Inject() {
  return (target: any, key: string) => {
    const constructor = Reflect.getMetadata('design:type', target, key);
    const instance = CORE.getInstance().getInjectable(constructor);
    Reflect.set(target, key, instance);
  }
}