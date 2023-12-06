class Register {
	nodes: any = {};

	register(node: any, init_data) {
		this.nodes[init_data.data.compute_type] = node;
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
