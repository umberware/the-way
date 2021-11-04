/* eslint-disable max-len */

import { CoreMessageModel } from '../model/core-message.model';

/**
 *   @name CORE_MESSAGES
 *   @description This configuration is used to make an internationalization.
 *      The keys are the language, and the value of the language key,
 *      is a generic object with a message name as key, and the value as message.
 *      The system language is defined in the property 'the-way.core.language', and
 *      used in CoreMessagesService
 *   @example  A new Language
 *      {
 *          'en': {
 *              ...
 *              'welcome-message': 'Hello user'
 *           },
 *          'pt': {
 *              ...
 *              'welcome-message': 'Olá usuário'
 *          }
 *      }
 *   @since 1.0.0
 */
export const CORE_MESSAGES: CoreMessageModel = {
    'en': {
        'building': 'Building: Started',
        'building-core-instances': 'Building: Core instances...',
        'building-dependencies-tree-done': 'Building: Dependencies tree\n \n$\n',
        'building-dependencies-instances': 'Building: Dependencies Instances...',
        'building-done': 'Building: done.',
        'building-instance': 'Building: Instance -> $',
        'building-instances': 'Building: Instances...',

        'configuring-application-class': 'Configuring: Application instance...',
        'configuring-instance': 'Configuring: $',

        'destruction-instance': 'Destruction: Destroying $',
        'destruction-destroyed': 'Destruction: I\'m inevitable! Was destroyed every thing. CYA!',

        'error': 'An error occurred',
        'error-cannot-inject': 'Register: The class $ cannot be injected. Only The Core PropertiesHandler can be injected.',
        'error-cannot-overridden-core-classes': 'Register: Core class cannot be overridden $.',
        'error-cannot-overridden-twice': 'Register: Is not possible to overwrite more than once. Was registered the overridden $ as $. The current is $.',
        'error-cannot-scan': 'Register: Cannot scan files with the provided path $.',
        'error-circular-dependency': 'Register: Found a circular dependency between $ -> $.',
        'error-in-destruction': 'Destruction: An error occurred in the destruction step. Error $.',
        'error-is-not-the-way': 'Preparing: Your application does not extend the class TheWayApplication',
        'error-not-found-dependency-constructor': 'Register: Cannot inject $ in class $. Cannot acquire the metadata from property. Probably a circular dependency',
        'error-not-found-instance': 'The $ instance not found',
        'error-properties-not-valid': 'Preparing: The provided application properties is not valid.',
        'error-rest-cannot-perform-action': 'You cannot perform this action.',
        'error-rest-no-token': 'Token not found',
        'error-rest-claims-without-token-verify': 'Trying to inject claims in a not authenticated path',
        'error-rest-invalid-token': 'Invalid Token',
        'error-rest-empty-request': 'Empty body',
        'error-rest-empty-response': 'Empty response',
        'error-rest-operation-not-in-rest': 'The Operation [$] $ must be in a Rest context. Decorate the $ class with @Rest',
        'error-rest-path-parameter': 'The path parameter $ is not present or not equal in method.',
        'error-server': 'Cannot initialize server -> $',
        'error-server-cannot-map-path': 'Cannot map a REST path without server.',
        'error-server-not-enabled': 'Cannot use Server Without Http or Https.',

        'http-bad-request': 'Bad Request',
        'http-internal-server-error': 'Internal Server Error',
        'http-not-allowed': 'Not Allowed',
        'http-not-found': 'Not Found',
        'http-not-authorized': 'Not Authorized',
        'http-server-initialization': 'Configuring the Http & Https server.',
        'http-server-running': 'HttpServer started on port $',
        'https-server-running': 'HttpsServer started on port $',
        'http-swagger-enabled': 'Configuring the Swagger UI...',
        'http-file-enabled': 'Configuring the File Server...',

        'injection-injected': 'Injection: Injected $ into $.$.',

        'register-class': 'Register: $ with type $',
        'register-dependency': 'Register: Dependency between -> $ into $',
        'register-found-resource': 'Register: Loading resources $',
        'register-overridden': 'Register: Overridden -> $ as $',
        'register-path': 'Register: [$] $ -> $',
        'register-father-path': 'Register: $ -> $',
        'register-scanning': 'Register: Searching & Loading the resources...',

        'step-after-initialization': 'Running: The application is running [elapsed time $].',
        'step-before-initialization-started': 'Register Step: Started',
        'step-before-initialization-done': 'Register Step: Done.',
        'step-destruction-started': 'Destruction Step: Started',
        'step-destruction-done': 'Destruction Step: Done.',
        'step-initialization-started': 'Building & Configuration Step: Started',
        'step-initialization-done': 'Building & Configuration Step: Done.',

        'TW-001': 'Application not recognized',
        'TW-002': 'HttpServer is not found',
        'TW-003': 'File not found',
        'TW-004': 'Cannot inject',
        'TW-005': 'Instance not created',
        'TW-006': 'Not destroyed',
        'TW-007': 'Not configured',
        'TW-008': 'Circular dependency',
        'TW-009': 'Metadata not found',
        'TW-010': 'Cannot Override',
        'TW-011': 'Not Valid',
        'TW-012': 'Error',
        'TW-013': 'Cannot register',
        'TW-014': 'Core Constructor',
        'TW-015': 'Core Class Injection',

        'warning-getting-instance-in-initialization-state': 'The instance $ may can not found because CORE is not ready',
        'warning-http-file-with-helmet': 'Http enabled but with HELMET parameters. This can cause problems in file server.',
        'warning-not-implemented': 'The $.$ is not implemented',
        'warning-properties-not-gived': 'Preparing: Not given a file properties. Will be used the default properties.',
    },
    'pt': {
        'building': 'Construção: Iniciada',
        'building-core-instances': 'Construção: Instâncias do Core...',
        'building-dependencies-tree-done': 'Construção: Árvore de dependências \n \n$\n',
        'building-dependencies-instances': 'Construção: Dependência entre instâncias',
        'building-done': 'Construção: Finalizada',
        'building-instance': 'Construção: Instância -> $',
        'building-instances': 'Construção: Instâncias...',

        'configuring-application-class': 'Configurando: Instância da Aplicação...',
        'configuring-instance': 'Configurando: $',

        'destruction-instance': 'Destruição: Destruindo $',
        'destruction-destroyed': 'Destruição: Eu sou inevitável! Destruí tudo. Até mais!',

        'error': 'Ocorreu um erro',
        'error-cannot-inject': 'Registro: A classe controladora $ não pode ser injetada. Apenas a classe controladora PropertiesHandler pode ser injetada.',
        'error-cannot-overridden-core-classes': 'Registro: A classe core $ não pode ser sobrescrita.',
        'error-cannot-overridden-twice': 'Registro: Não é possível sobrescrever mais de uma vez uma classe. Já foi registrado a sobrescrita: $ -> $. A atual é $.',
        'error-cannot-scan': 'Registro: Não é possível escanear por componentes com este caminho $.',
        'error-circular-dependency': 'Registro: Encontramos uma dependência circular $ -> $.',
        'error-in-destruction': 'Destruição: Houve um erro na etapa de destruição. Erro $.',
        'error-is-not-the-way': 'Preparação: A classe principal não estende a classe TheWayApplication',
        'error-not-found-dependency-constructor': 'Registro: Não é possível injetar $ em $. Não conseguimos adquirir as informações de metadata. Provavelmente é uma dependência circular.',
        'error-not-found-instance': 'A $ instância não foi encontrada',
        'error-properties-not-valid': 'Preparação: O arquivo de propriedades passado não é válido.',
        'error-rest-cannot-perform-action': 'Você não ter permissão para executar esta operação.',
        'error-rest-no-token': 'Não foi encontrado o token',
        'error-rest-claims-without-token-verify': 'Não é possível injetar claims em uma operação sem autenticação',
        'error-rest-invalid-token': 'O token é inválido',
        'error-rest-empty-request': 'A requisição está vazia',
        'error-rest-empty-response': 'A resposta está vazia',
        'error-rest-operation-not-in-rest': 'A operação [$] $ deve estar em uma classe REST. Decore a classe $ com @Rest',
        'error-rest-path-parameter': 'O parâmetro de caminho $ não está presente ou não é igual ao mapeado no método.',
        'error-server': 'Não é possível iniciar o servidor -> $',
        'error-server-cannot-map-path': 'Não é possível mapear um caminho REST sem servidor.',
        'error-server-not-enabled': 'Não é possível usar um servidor com HTTPS e HTTP desabilitados.',

        'http-bad-request': 'Requisição Inválida',
        'http-internal-server-error': 'Erro Interno no Servidor',
        'http-not-allowed': 'Não Permitido',
        'http-not-found': 'Não Encontrado',
        'http-not-authorized': 'Não Autorizado',
        'http-server-initialization': 'Configurando o servidor Http & Https',
        'http-server-running': 'HttpServer iniciou na porta $',
        'https-server-running': 'HttpsServer iniciou na porta $',
        'http-swagger-enabled': 'Configurando a interface para o Swagger...',
        'http-file-enabled': 'Configurando o servidor de arquivos...',

        'injection-injected': 'Injeção: Injetado $ em $.$.',

        'register-class': 'Registro: $ com o tipo $',
        'register-dependency': 'Registro: Dependência entre -> $ em $',
        'register-found-resource': 'Registro: Carregando recursos $',
        'register-overridden': 'Registro: Sobrescrito -> $ como $',
        'register-path': 'Registro: [$] $ -> $',
        'register-father-path': 'Registro: $ -> $',
        'register-scanning': 'Registro: Buscando & Carregando os recursos...',

        'step-after-initialization': 'Rodando: A aplicação está rodando [tempo decorrido $].',
        'step-before-initialization-started': 'Etapa Registro: Iniciada',
        'step-before-initialization-done': 'Etapa Registro: Finalizada.',
        'step-destruction-started': 'Etapa Destruição: Iniciada',
        'step-destruction-done': 'Etapa Destruição: Finalizada.',
        'step-initialization-started': 'Etapa Construindo & Configurando: Iniciada',
        'step-initialization-done': 'Etapa Construindo & Configurando: Finalizada.',

        'TW-001': 'Aplicação não reconhecida',
        'TW-002': 'HttpServer não encontrado',
        'TW-003': 'Arquivo não encontrado',
        'TW-004': 'Não pode ser injetado',
        'TW-005': 'Instância não criada',
        'TW-006': 'Não destruído',
        'TW-007': 'Não configurado',
        'TW-008': 'Dependência Circular',
        'TW-009': 'Metadata não encontrada',
        'TW-010': 'Não pode ser sobrescrito',
        'TW-011': 'Inválido',
        'TW-012': 'Erro',
        'TW-013': 'Não pode ser registrado',
        'TW-014': 'Construção do Core',
        'TW-015': 'Injeção da Classe Core',

        'warning-getting-instance-in-initialization-state': 'A instância $ pode não ser encontrada porque o CORE não está pronto',
        'warning-http-file-with-helmet': 'Http habilitado, mas com o parâmetros do HELMET. Pode ocasionar problemas no servidor de arquivos.',
        'warning-not-implemented': 'A $.$ não está implementada',
        'warning-properties-not-gived': 'Preparação: Sem arquivo de propriedades. Será usado as propriedades DEFAULT.',
    }
};
