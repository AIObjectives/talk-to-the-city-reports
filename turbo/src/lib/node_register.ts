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

	init(compute_type: string, init_data: any) {
		return new this.nodes[compute_type](init_data);
	}

	get(name: string) {
		return this.nodes[name];
	}

	async tryImport(path: string) {
		try {
			const module = await import(`./docs/${path}.md?raw`);
			return module.default;
		} catch (e) {
			return null;
		}
	}

	async importWithFallback(name: string, suffix: string) {
		let module = await this.tryImport(`${name}-${suffix}`);
		if (!module) {
			const unversioned = name.replace(/_v\d+$/, '');
			module = await this.tryImport(`${unversioned}-${suffix}`);
		}
		return module;
	}

	async getDocs(compute_type: string, locale: string = defaultLocale) {
		return await this.importWithFallback(compute_type, locale);
	}

	async getInlineDocs(compute_type: string, locale: string = defaultLocale) {
		return await this.importWithFallback(compute_type, `inline-${locale}`);
	}

	async getAllDocs(locale: string = defaultLocale) {
		let docs = [];
		for (const compute_type in this.nodes) {
			docs.push({
				compute_type,
				icon: this.data[compute_type].data.icon,
				docs: await this.getDocs(compute_type, locale),
				inlineDocs: await this.getInlineDocs(compute_type, locale)
			});
		}
		docs.sort((a, b) => a.compute_type.localeCompare(b.compute_type));
		return docs;
	}
}

const nodesRegister = new Register();

export default nodesRegister;
