import { addTemplate, useNuxt } from "@nuxt/kit";
import { dirname, relative, resolve } from "pathe";
import { resolveFiles } from "@nuxt/kit";
import { basename } from "path";

const Type = {
  View: "view",
  Actions: "actions",
  Build: "build",
  Loader: "loader",
};

interface ScannedFile {
  relativePath: string;
  absolutePath: string;
}

interface View {
  name: string;
  dirpath: ScannedFile;
  view?: ScannedFile;
  actions?: ScannedFile;
  loader?: ScannedFile;
  buiild?: ScannedFile;
}

function toPascal(string: string) {
  return string.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}

function determineFileType(file: ScannedFile) {
  const bn = basename(file.relativePath);
  if (bn.startsWith("view.")) {
    return Type.View;
  }
  if (bn.startsWith("actions.")) {
    return Type.Actions;
  }
  if (bn.startsWith("loader.")) {
    return Type.Loader;
  }
  if (bn.startsWith("build.")) {
    return Type.Build;
  }
}

export async function parseViews() {
  const nuxt = useNuxt();
  // walk the views directory and grab each instance
  const viewDirs = nuxt.options._layers.map(
    (layer) =>
      resolve(
        layer.config.srcDir,
        "views",
      ),
  );

  const scannedFiles: ScannedFile[] = [];
  for (const dir of viewDirs) {
    const files = await resolveFiles(
      dir,
      `**/*{${nuxt.options.extensions.join(",")}}`,
    );
    scannedFiles.push(
      ...files.map((file) => ({
        relativePath: relative(dir, file),
        absolutePath: file,
      })),
    );
  }
  scannedFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const views: Record<string, View> = {};

  for (const file of scannedFiles) {
    const name = toPascal(dirname(file.relativePath));
    views[name] ??= {
      name,
      dirpath: {
        relativePath: dirname(file.relativePath),
        absolutePath: dirname(file.absolutePath),
      },
    };

    switch (determineFileType(file)) {
      case Type.View:
        views[name].view = file;
        break;
      case Type.Actions:
        views[name].actions = file;
        break;
      case Type.Loader:
        views[name].loader = file;
        break;
      case Type.Build:
        views[name].buiild = file;
        break;
    }
  }

  return views;
}

export function createManifest(views: Record<string, View>){
  const start = `export const manifest = {\n`
  const end = `\n}`
  return start + Object.values(views).map(view => {
    return `  ${view.name}: {\n` + Object.entries(view).filter(([key, value]) => key !== "name").map(([key, value]) => {
      return `    ${key}: "${value.absolutePath}",`
    }).join("\n") + `\n  }`
  }).join(",\n") + end
}
