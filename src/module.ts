import {
  addImportsDir,
  addServerHandler,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from "nuxt/kit";
import createManifest from "./createPageDataManifest";
import { setAlias } from "./setAlias";

export default defineNuxtModule({
  meta: {
    name: "Page Data",
    configKey: "pageData",
  },
  defaults: {
    debug: false,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addServerHandler({
      route: "/pagedata/*",
      handler: resolve("./runtime/server/loader"),
    });

    addImportsDir(resolve("./runtime/composables"));

    const { dst: manifestPath } = addTemplate({
      filename: "pageDataManifest.js",
      getContents: async () => createManifest(options.debug),
      write: true,
    });

    setAlias("#pagedata/manifest", manifestPath);
  },
});
