import { browser } from '$app/environment';
import { init } from 'svelte-i18n';
import Cookies from 'js-cookie';

const defaultLocale = Cookies.get('locale') || 'en';

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});

class Register {
	nodes: any = {};
	data: any = {};

	register(node: any, init_data) {
		this.nodes[init_data.data.compute_type] = node;
		this.data[init_data.data.compute_type] = init_data;
	}

	init(compute_type, init_data) {
		return new this.nodes[compute_type](init_data);
	}

	get(name: string) {
		return this.nodes[name];
	}
}

const nodes = new Register();

export default nodes;
