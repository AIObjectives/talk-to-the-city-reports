export type Category = {
	label: string;
	id: string;
};

interface CategoriesDictionary {
	[categoryName: string]: Category;
}

const categories: CategoriesDictionary = {
	input: {
		label: 'input',
		id: 'input'
	},
	llm: {
		label: 'llm',
		id: 'llm'
	},
	// llama: {
	//   label: 'llama',
	//   id: 'llama'
	// },
	wrangling: {
		label: 'wrangling',
		id: 'wrangling'
	},
	display: {
		label: 'display',
		id: 'display'
	}
};

export default categories;
