import { defineEventHandler } from "h3"

export const loader = () => ({
  something: "from the loader"
})

export const build = () => ({
  something: "from the build",
  moreBuild: "data",
})
