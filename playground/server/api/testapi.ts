import { defineEventHandler } from "#imports"

export default defineEventHandler((event) => {
	return {
		data: "hello from test api route"
	}
})