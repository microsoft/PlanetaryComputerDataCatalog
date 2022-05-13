import { TextField } from "@fluentui/react";
import { useFormikContext } from "formik";

const FormInput = ({
  name,
  label = "",
  placeholder = "",
  required = false,
  multiline = false,
}) => {
  const { values, touched, errors, handleChange } = useFormikContext();

  return (
    <TextField
      data-bi-dnt
      required={required}
      multiline={multiline}
      autoAdjustHeight={multiline ? true : undefined}
      name={name}
      label={label}
      placeholder={placeholder}
      value={values[name]}
      errorMessage={touched[name] && errors[name]}
      onChange={handleChange}
      maxLength={multiline ? 1000 : 255}
    />
  );
};

export default FormInput;
