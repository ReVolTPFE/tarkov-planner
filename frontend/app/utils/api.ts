import { $fetch } from "ofetch";

export const $api = (url: string, options = {}) => {
	const config = useRuntimeConfig();

	return $fetch(url, {
		baseURL: config.public.API_URL + "/api",
		...options,
		async onRequest({ options }) {

		}
	});
};
