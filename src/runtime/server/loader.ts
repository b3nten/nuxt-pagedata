import {
  defineEventHandler,
} from "h3";
import { manifest } from "#views/manifest"
console.log(manifest)


export default defineEventHandler(async (event) => {
  return {
    cool: "cool",
  };
});
