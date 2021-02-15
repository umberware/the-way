import { CORE } from '../core';

export const ConfigurationMetaKey = 'Configuration';

/* eslint-disable @typescript-eslint/ban-types */
export const Configuration = (over?: Function) => {
    return (constructor: Function): void => {
        const core = CORE.getCore();
        if (!core.isDestroyed()) {
            const registerHandler = core.getRegisterHandler();
            registerHandler.registerConfiguration(constructor, over);
        }
    };
};
