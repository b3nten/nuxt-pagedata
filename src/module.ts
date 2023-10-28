import {
  addComponent,
  addServerHandler,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from "nuxt/kit";
import { setAlias } from "./setAlias";
import { createManifest, parseViews } from "./parseViews";

export default defineNuxtModule({
  meta: {
    name: "Views",
    configKey: "views",
  },
  defaults: {
    debug: false,
  },
  async setup(options, nuxt) {
    // Create resolver
    const { resolve } = createResolver(import.meta.url);
    // Set up rootDirs to point to generated views types;
    nuxt.options.typescript.tsConfig.compilerOptions ??= {};
    nuxt.options.typescript.tsConfig.compilerOptions.rootDirs ??= [];
    nuxt.options.typescript.tsConfig.compilerOptions.rootDirs.push("../");
    nuxt.options.typescript.tsConfig.compilerOptions.rootDirs.push("./_views/");

    // gather views;
    const views = await parseViews();

    // create view manifest
    const manifest = addTemplate({
      filename: "viewsManifest.js",
      getContents: () => createManifest(views),
    });

    setAlias("#views/manifest", manifest.dst);

    // Establish view handler
    addServerHandler({
      route: "/_views/*",
      handler: resolve("./runtime/server/loader"),
    });

    // create useView files;
    for (const view of Object.values(views)) {
      if (!view.view) continue;
      addTemplate({
        filename: `./_views/views/${view.dirpath.relativePath}/$view.ts`,
        getContents: () => "export default async () => 'cool';",
        write: true,
      });
      addTemplate({
        filename: `../views/${view.dirpath.relativePath}/$view.ts`,
        getContents: () => `export default async () => 'cool';`,
        write: false,
      });
      addComponent({
        filePath: view.view.absolutePath,
        name: view.name,
      });
    }
  },
});
