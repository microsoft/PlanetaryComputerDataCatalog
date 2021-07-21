import * as React from "react";
import { Dropdown } from "@fluentui/react";
import { useFormikContext } from "formik";

const FormSelect = ({ label = "", name, options, multiSelect = false }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <Dropdown
      name={name}
      label={label}
      multiSelect={multiSelect}
      selectedKey={multiSelect ? undefined : values[name]}
      selectedKeys={multiSelect ? values[name] : undefined}
      placeholder="Select an option"
      options={options}
      onChange={(_, option) => {
        if (multiSelect) {
          const vals = values[name];
          if (option.selected) {
            setFieldValue(name, [...vals, option.key]);
          } else {
            const idx = vals.indexOf(option.key);

            if (idx !== -1) {
              setFieldValue(name, [...vals.slice(0, idx), ...vals.slice(idx + 1)]);
            }
          }
        } else {
          setFieldValue(name, option.key);
        }
      }}
    />
  );
};

export default FormSelect;
