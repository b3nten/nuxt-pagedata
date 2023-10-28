import {
  defineEventHandler,
  type EventHandler,
  type EventHandlerRequest,
} from "h3";
import { manifest } from "#pagedata/manifest";
import defu from "defu";

type HandlerFunction = EventHandler<EventHandlerRequest, any>;

// We need to generate possible handlers. We check named files (load, build, actions) first
// and grab their default export. If that doesn't exist, we check for a data file,
// and the corresponding named export.
const generatePossibleHandlers = (
  name: string,
  type: "load" | "build" | "actions",
) => {
  return [
    {
      path: `${name}.${type}`,
      import: "default",
    },
    {
      path: `${name}-index.${type}`,
      import: "default",
    },
    {
      path: `${name}.data`,
      import: type === "load"
        ? "loader"
        : type === "build"
        ? "build"
        : "actions",
    },
    {
      path: `${name}-index.data`,
      import: type === "load"
        ? "loader"
        : type === "build"
        ? "build"
        : "actions",
    },
  ];
};

async function resolveImports(name: string, type: "load" | "build") {
  let result: HandlerFunction | undefined = undefined;
  for (const handler of generatePossibleHandlers(name, type)) {
    if (handler.path in manifest) {
      try {
        const mod = await manifest[handler.path as keyof typeof manifest]();
        // @ts-ignore
        result = mod[handler.import];
      } catch (e) {
        // console.log(e);
        continue;
      }
      break;
    }
  }
  return result;
}

export default defineEventHandler(async (event) => {
  console.log("Loader event:", event.path);
  const name = event.path.replace("/pagedata/", "");

  const build = await resolveImports(name, "build");
  const load = await resolveImports(name, "load");

  console.log("Loader build:", build);
  console.log("Loader load:", load);

  const data = await Promise.allSettled([build?.(event), load?.(event)]);

  console.log("Loader data:", data);

  return defu(data[1].value ?? {}, data[0].value ?? {});
});
