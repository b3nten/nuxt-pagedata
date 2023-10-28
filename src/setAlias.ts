import type { Nuxt } from "@nuxt/schema";
import { useNuxt } from "@nuxt/kit";
import defu from "defu";

export function setAlias(alias: string, path: string) {
  const nuxt = useNuxt();
  nuxt.hook("nitro:config", (nitroConfig) => {
    // Workaround for https://github.com/nuxt/nuxt/issues/19453
    nitroConfig.externals = defu(
      typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
      { inline: [path] },
    );
    nitroConfig.alias = nitroConfig.alias ?? {};
    nitroConfig.alias[alias] = path;
    nuxt.options.alias[alias] = path;
  });
}