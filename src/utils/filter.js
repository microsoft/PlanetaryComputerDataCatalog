export const filter = (objList, keys) => {
  return term => {
    return objList.filter(findTermInObject(keys, term.toLowerCase()));
  };
};

const findTermInObject = (keys, iTerm) => {
  return obj => {
    return keys
      .map(key => {
        const attr = obj[key];

        if (typeof attr === "string") {
          // String in string
          return contains(attr, iTerm);
        } else if (Array.isArray(attr)) {
          // String in any value of array
          return attr.map(v => contains(v, iTerm)).some(v => !!v);
        } else {
          // Unsupported type, don't search
          return false;
        }
      })
      .some(v => !!v);
  };
};

const contains = (value, term) => {
  // Convert value to string if possible and do a case insensitive includes
  // Fail match on error, likely a type conversion problem
  try {
    return value.toString().toLowerCase().includes(term);
  } catch {
    return false;
  }
};
