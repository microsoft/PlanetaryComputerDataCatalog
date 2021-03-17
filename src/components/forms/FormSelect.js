import * as React from "react";
import { Dropdown } from "@fluentui/react";

const FormSelect = ({ formik, label, name, options, multiSelect = false }) => {
  return (
    <Dropdown
      name={name}
      label={label}
      multiSelect={multiSelect}
      selectedKey={multiSelect ? undefined : formik.values[name]}
      selectedKeys={multiSelect ? formik.values[name] : name}
      placeholder="Select an option"
      options={options}
      onChange={(_, option) => {
        if (multiSelect) {
          const values = formik.values[name];
          if (option.selected) {
            formik.setFieldValue(name, [...values, option.key]);
          } else {
            const idx = values.indexOf(option.key);

            if (idx !== -1) {
              formik.setFieldValue(name, [
                ...values.slice(0, idx),
                ...values.slice(idx + 1),
              ]);
            }
          }
        } else {
          formik.setFieldValue(name, option.key);
        }
      }}
    />
  );
};

export default FormSelect;
