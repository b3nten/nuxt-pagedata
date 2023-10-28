import type { NuxtPage } from "nuxt/schema";
import type { Context } from "./types";
import resolvePagesRoutes from "./resolvePageRoutes";

export default async function createPageDataManifest(debug?: boolean) {
  const pages = await resolvePagesRoutes();
  const dataPages = filterDataRoutes(/\.data|action|load|build\.ts$/, pages);
  deleteDataRoutes(dataPages, pages);
  debug && console.log(`Compiled ${dataPages.length} page data routes.`)
  return parseExports(dataPages);
}

function parseExports(manifest: NuxtPage[]) {
  const fileStart = `export const manifest = {`
  const fileEnd = `}`;
  const fileContent = manifest.map((r) => `\t"${r.name}": () => import("${r.file}")`).join(",\n")
  return `${fileStart}\n${fileContent}\n${fileEnd}`;
}

function filterDataRoutes(pattern: RegExp, pages: NuxtPage[] = []) {
  const dataPages: NuxtPage[] = [];
  for (const page of pages) {
    // @ts-ignore
    if (pattern.test(page.file)) {
      dataPages.push(page);
    } else {
      filterDataRoutes(pattern, page.children);
    }
  }
  return dataPages;
}

function deleteDataRoutes(routes: NuxtPage[], pages: NuxtPage[] = []) {
  for (const page of routes) {
    pages.splice(pages.indexOf(page), 1);
  }
}
