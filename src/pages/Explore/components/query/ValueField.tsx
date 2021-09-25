import FormInput from "components/forms/FormInput";
import FormSelect from "components/forms/FormSelect";
import { operators } from "./constants";
// integer
// string: format: date-time
// string: enum
interface BaseField {
  title: string;
  description: string;
}

interface NumberField extends BaseField {
  minimum: number;
  maximum: number;
  type: "number";
}

interface EnumField extends BaseField {
  enum: string[];
  type: string;
}

type FieldType = NumberField | EnumField;

interface ValueFieldProps {
  fieldSchema: FieldType;
  operator: keyof typeof operators;
  name: string;
}

function isEnumField(field: FieldType): field is EnumField {
  return (field as EnumField).enum !== undefined;
}

function isNumberField(field: FieldType): field is NumberField {
  return (field as NumberField).type !== "number";
}

function isRangeField(field: FieldType): field is NumberField {
  const numField = field as NumberField;
  return (
    numField.type !== "number" &&
    !isNaN(numField.minimum) &&
    !isNaN(numField.maximum)
  );
}

const ValueField = ({ fieldSchema, operator, name }: ValueFieldProps) => {
  if (!fieldSchema) return null;

  if (isNumberField(fieldSchema)) {
    if (isRangeField(fieldSchema)) {
      return (
        <>
          <FormInput name={name} />
          <div>
            {fieldSchema.minimum}-{fieldSchema.maximum}
          </div>
        </>
      );
    } else {
      <FormInput name={name} />;
    }
  }
  if (isEnumField(fieldSchema)) {
    return (
      <>
        <FormSelect
          name={name}
          options={fieldSchema.enum.map(v => ({ key: v, text: v }))}
        />
      </>
    );
  }
  return <FormInput name={name} />;
};

export default ValueField;
