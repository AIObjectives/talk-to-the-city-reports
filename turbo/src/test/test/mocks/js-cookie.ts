const cookies = {};

export default {
  get: (key) => cookies[key],
  set: (key, value) => {
    cookies[key] = value;
  },
  remove: (key) => {
    delete cookies[key];
  }
};
