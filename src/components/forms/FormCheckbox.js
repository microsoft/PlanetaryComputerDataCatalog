import { Checkbox } from "@fluentui/react";
import { useFormikContext } from "formik";

const FormCheckbox = ({ name, label, placeholder = null, required = false }) => {
  const { values, touched, errors, setFieldValue } = useFormikContext();

  return (
    <Checkbox
      required={required}
      name={name}
      label={typeof label === "string" ? label : undefined}
      placeholder={placeholder}
      checked={values[name]}
      onChange={(_, checked) => setFieldValue(name, checked)}
      errorMessage={touched[name] && errors[name]}
      onRenderLabel={typeof label === "object" ? () => label : undefined}
    />
  );
};

export default FormCheckbox;
