import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { IDropdownOption } from "@fluentui/react";
import { CqlParser } from "pages/Explore/utils/cql";
import { getQueryableTitle } from "pages/Explore/utils/stac";

const OMITTED_PREFIXES = [
  "geometry",
  "proj:",
  "epsg:",
  "label:",
  "classification:",
  "start_datetime",
  "end_datetime",
  "created",
  "updated",
];
const OMITTED_TYPES = ["array"];

export const getFilteredQueryables = (queryables: JSONSchema | undefined) => {
  if (!queryables) return;

  const filteredSchema = Object.assign(
    Object.create(Object.getPrototypeOf(queryables)),
    queryables
  );

  Object.keys(filteredSchema.properties).forEach(key => {
    const isOmittedPrefix = OMITTED_PREFIXES.some(prefix => key.startsWith(prefix));
    const isOmittedType = OMITTED_TYPES.includes(
      filteredSchema.properties[key].type
    );

    if (isOmittedPrefix || isOmittedType) {
      delete filteredSchema.properties[key];
    }
  });

  return filteredSchema;
};

export const getCurrentProperties = (cql: CqlParser | null) => {
  const existing = cql?.expressions.map(exp => exp.property);
  return existing || [];
};

export const makeDropdownItems = (
  queryable: JSONSchema | undefined,
  existingProperties: string[]
): IDropdownOption[] => {
  const keys = Object.keys(queryable?.properties || {}).sort();
  const fields = queryable?.properties;

  return keys.map(key => {
    const field = fields?.[key] as JSONSchema;
    const exists = existingProperties.includes(key);
    const text = getQueryableTitle(field, key);
    const isAcquired = key === "datetime";
    const title = isAcquired ? "This filter cannot be removed" : field.description;

    return {
      key,
      text,
      title,
      data: field,
      checked: exists,
      disabled: isAcquired,
    };
  });
};
