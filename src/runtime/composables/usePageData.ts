import { useRoute, useFetch } from "#imports"

export default async function usePageData(){
	const route = useRoute()
	return useFetch(() => `/pagedata/${String(route.name)}`)
}