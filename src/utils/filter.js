import groups from "../config/datasetGroups.yml";

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

export const stacTagFilter = (collections, tags) => {
  if (!collections) return null;

  const addedGroups = new Set();
  if (!tags.length) {
    // Base case, show all collections not in a group, include the group config
    // as a replacement once, for as many group members removed.
    return collections.reduce((accum, collection) => {
      const groupId = collection["msft:group_id"];

      if (groupId) {
        // Don't add the group again if it's been added
        const filtered = addedGroups.has(groupId)
          ? accum
          : accum.concat([{ ...groups[groupId], groupId: groupId }]);
        addedGroups.add(groupId);
        return filtered;
      }

      // Return all collections + groups
      return accum.concat(collection);
    }, []);
  }

  // Filter all collections, including those that are otherwise grouped
  return tagFilter(collections, tags);
};

export const tagFilter = (datasets, tags) => {
  return datasets.filter(c =>
    tags.every(({ key }) => c.keywords?.map(k => k.toLowerCase()).includes(key))
  );
};
