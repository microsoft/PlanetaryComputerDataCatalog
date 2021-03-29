import React from "react";
import { Checkbox } from "@fluentui/react";

const FormCheckbox = ({
  name,
  label,
  placeholder,
  formik,
  required = false,
}) => {
  return (
    <Checkbox
      required={required}
      name={name}
      label={typeof label === "string" ? label : undefined}
      placeholder={placeholder}
      checked={formik.values[name]}
      onChange={(_, checked) => formik.setFieldValue(name, checked)}
      errorMessage={formik.touched[name] && formik.errors[name]}
      onRenderLabel={typeof label === "object" ? () => label : undefined}
    />
  );
};

export default FormCheckbox;
