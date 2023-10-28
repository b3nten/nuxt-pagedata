import { defineEventHandler } from "h3"

export default defineEventHandler((event) => {
  return {
    data: "hello from /test/index.data.ts"
  }
})