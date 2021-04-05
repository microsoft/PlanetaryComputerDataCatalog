import React from "react";
import { TextField } from "@fluentui/react";

const FormInput = ({
  name,
  label,
  placeholder,
  formik,
  required = false,
  multiline = false,
}) => {
  return (
    <TextField
      required={required}
      multiline={multiline}
      autoAdjustHeight={multiline ? true : undefined}
      name={name}
      label={label}
      placeholder={placeholder}
      value={formik.values[name]}
      errorMessage={formik.touched[name] && formik.errors[name]}
      onChange={formik.handleChange}
    />
  );
};

export default FormInput;
