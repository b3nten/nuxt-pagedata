import { defineEventHandler } from "h3"

export const loader = defineEventHandler((event) => {
  return {
    data: "hello from /outside.data.ts"
  }
})