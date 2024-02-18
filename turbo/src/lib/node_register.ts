import { browser } from '$app/environment';
import { init } from 'svelte-i18n';
import Cookies from 'js-cookie';
import _ from 'lodash';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types.d.ts';

const defaultLocale = Cookies.get('locale') || 'en-US';

init({
  fallbackLocale: defaultLocale,
  initialLocale: browser ? window.navigator.language : defaultLocale
});

interface NodeRegister {
  [key: string]: any;
}

interface DataRegister {
  [key: string]: DGNodeInterface;
}

class Register {
  nodes: NodeRegister = {};
  data: DataRegister = {};

  register(node: any, init_data: DGNodeInterface<BaseData>) {
    this.nodes[init_data.data.compute_type] = node;
    this.data[init_data.data.compute_type] = init_data;
  }

  init_new(compute_type: string, init_data: any = {}) {
    if (!this.data.hasOwnProperty(compute_type)) {
      throw new Error(`Compute type '${compute_type}' not found.`);
    }
    const dataClone = _.cloneDeep(this.data[compute_type]);
    dataClone.data = _.merge(dataClone.data, init_data);
    return new this.nodes[compute_type](dataClone);
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
    const docs = [];
    for (const compute_type in this.nodes) {
      docs.push({
        compute_type,
        icon: this.data[compute_type].data.icon,
        docs: await this.getDocs(compute_type, locale),
        inlineDocs: await this.getInlineDocs(compute_type, locale),
        category: this.data[compute_type].data.category
      });
    }
    docs.sort((a, b) => a.compute_type.localeCompare(b.compute_type));
    return docs;
  }
}

const nodesRegister = new Register();

export default nodesRegister;
