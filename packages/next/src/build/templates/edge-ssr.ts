import '../../server/web/globals'
import { adapter } from '../../server/web/adapter'
import { getRender } from '../webpack/loaders/next-edge-ssr-loader/render'
import { IncrementalCache } from '../../server/lib/incremental-cache'

import Document from 'VAR_MODULE_DOCUMENT'
import * as appMod from 'VAR_MODULE_APP'
import * as userlandPage from 'VAR_USERLAND'
import * as userlandErrorPage from 'VAR_MODULE_GLOBAL_ERROR'

// FIXME: this needs to be made compatible with the template
// ${
//   stringified500Path
//     ? `import * as userland500Page from ${stringified500Path}`
//     : ''
// }

// TODO: re-enable this once we've refactored to use implicit matches
// const renderToHTML = undefined

import { renderToHTML } from '../../server/render'
import RouteModule from '../../server/future/route-modules/pages/module'

import type { RequestData } from '../../server/web/types'
import type { BuildManifest } from '../../server/get-page-files'
import type { NextConfigComplete } from '../../server/config-shared'

// injected by the loader afterwards.
declare const pagesType: 'app' | 'pages' | 'root'
declare const page: string
declare const sriEnabled: boolean
declare const dev: boolean
declare const nextConfig: NextConfigComplete
declare const pageRouteModuleOptions: any
declare const errorRouteModuleOptions: any
declare const user500RouteModuleOptions: any
// INJECT:pagesType
// INJECT:page
// INJECT:sriEnabled
// INJECT:dev
// INJECT:config
// INJECT:pageRouteModuleOptions
// INJECT:errorRouteModuleOptions
// INJECT:user500RouteModuleOptions

const pageMod = {
  ...userlandPage,
  routeModule: new RouteModule({
    ...pageRouteModuleOptions,
    components: {
      App: appMod.default,
      Document,
    },
    userland: userlandPage,
  }),
}

const errorMod = {
  ...userlandErrorPage,
  routeModule: new RouteModule({
    ...errorRouteModuleOptions,
    components: {
      App: appMod.default,
      Document,
    },
    userland: userlandErrorPage,
  }),
}

// FIXME: this needs to be made compatible with the template
// const error500Mod = ${
//   stringified500Path
//     ? `{
//   ...userland500Page,
//   routeModule: new RouteModule({
//     ...${JSON.stringify(getRouteModuleOptions('/500'))},
//     components: {
//       App: appMod.default,
//       Document,
//     },
//     userland: userland500Page,
//   }),
// }`
//     : 'null'
// }`
const error500Mod = null

// FIXME: this needs to be made compatible with the template
// ${
//   incrementalCacheHandlerPath
//     ? `import incrementalCacheHandler from ${JSON.stringify(
//         incrementalCacheHandlerPath
//       )}`
//         : 'const incrementalCacheHandler = null'
//     }
const incrementalCacheHandler = null

const maybeJSONParse = (str?: string) => (str ? JSON.parse(str) : undefined)

const buildManifest: BuildManifest = self.__BUILD_MANIFEST as any
const prerenderManifest = maybeJSONParse(self.__PRERENDER_MANIFEST)
const reactLoadableManifest = maybeJSONParse(self.__REACT_LOADABLE_MANIFEST)
const subresourceIntegrityManifest = sriEnabled
  ? maybeJSONParse(self.__SUBRESOURCE_INTEGRITY_MANIFEST)
  : undefined
const nextFontManifest = maybeJSONParse(self.__NEXT_FONT_MANIFEST)

const render = getRender({
  pagesType,
  dev,
  page,
  appMod,
  pageMod,
  errorMod,
  error500Mod,
  Document,
  buildManifest,
  prerenderManifest,
  renderToHTML,
  reactLoadableManifest,
  subresourceIntegrityManifest,
  config: nextConfig,
  buildId: 'VAR_BUILD_ID',
  nextFontManifest,
  incrementalCacheHandler,
})

export const ComponentMod = pageMod

export default function nHandler(opts: { page: string; request: RequestData }) {
  return adapter({
    ...opts,
    IncrementalCache,
    handler: render,
  })
}
