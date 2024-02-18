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
  ml: {
    label: 'ML',
    id: 'ml'
  },
  lang: {
    label: 'lang',
    id: 'lang'
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
  },
  wip: {
    label: 'wip',
    id: 'wip'
  }
};

export default categories;
