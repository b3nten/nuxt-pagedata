import { defineEventHandler } from "h3"

export default defineEventHandler((event) => {
  return {
    data: "hello from /index/inside.data.ts"
  }
})