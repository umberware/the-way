import { CORE } from '../../../core';

export function Get(path: string, authenticated: boolean, allowedProfiles: Array<any>, ) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        CORE.getInstance().ready$.subscribe((ready: boolean) => {
            if (ready) {
                console.log('ok')
                console.log(CORE.getInstance().getInjectables())
                // CORE.getInstance().getHttpService().executeEndpoint(path, authenticated, allowedProfiles);
            }
        })
    }
  }

//   processAndExecute(target, propertyKey, args, HttpType.GET);

// async function processAndExecute(target: any, propertyKey: any, args: Array<any>, httpType: HttpType): Promise<void> {
//     let path: string = args[0];
//     let type: Iteraction = args[1];
//     let Profiles: Array<Profile> = args[2];
//     const serverConfiguration: ServerConfiguration = <ServerConfiguration> Core.INSTANCES.get('ServerConfiguration');
//     serverConfiguration.context[httpType](path, async (req, res) => {
//       try {
//         const userToken = await verifyProfileAndToken(type, Profiles, req, res);
//         const result = await executeEndpoint(target, propertyKey, req, httpType, userToken)
//         res.send(result);
//       } catch (ex) {
//         console.error(ex);
//         if (ex.code) {
//           res.status(ex.code).send(ex);
//         } else {
//           res.status('500').send(ex);
//         }
//       }
//     })
//   }