import { useContext } from "react";
import { Formik, Form, FieldArray } from "formik";

import { QueryContext } from "./context";
import FormSelect from "components/forms/FormSelect";
import { Operators } from "./constants";
import ValueField from "./ValueField";
import { DefaultButton, IconButton, PrimaryButton, Stack } from "@fluentui/react";

const initialValues = {
  expressions: [
    {
      attribute: "",
      operator: "",
      value: null,
    },
  ],
};

const Builder = () => {
  const { state } = useContext(QueryContext);

  const queryableFields = Object.entries(state.schema.properties).map(
    ([key, property]) => ({ key, text: property.title })
  );

  const queryableOps = Object.entries(Operators).map(([key, value]) => ({
    key,
    text: value,
  }));

  const form = (
    <div>
      <h3>Filter</h3>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          await new Promise(r => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="expressions">
              {({ insert, remove, push }) => (
                <div>
                  {values.expressions.length > 0 &&
                    values.expressions.map((expression, index) => (
                      <div key={index}>
                        <Stack horizontal tokens={{ childrenGap: 4 }}>
                          <FormSelect
                            name={`expressions.${index}.attribute`}
                            options={queryableFields}
                            multiSelect={false}
                          />
                          <FormSelect
                            name={`expressions.${index}.operator`}
                            options={queryableOps}
                            multiSelect={false}
                          />
                          <ValueField
                            fieldSchema={
                              state.schema.properties[expression.attribute]
                            }
                            operator={expression.operator as Operators}
                            name={`expressions.${index}.value`}
                          />
                          <IconButton
                            primary
                            styles={{
                              root: {
                                height: 20,
                                width: 20,
                              },
                            }}
                            iconProps={{ iconName: "StatusCircleErrorX" }}
                            title="Remove expression"
                            aria-label="Remove expression"
                            onClick={() => remove(index)}
                          />
                        </Stack>
                      </div>
                    ))}
                  <Stack horizontal tokens={{ childrenGap: 4, padding: "10px 0" }}>
                    <DefaultButton
                      type="button"
                      className="secondary"
                      onClick={() => push({ attribute: "", operator: "" })}
                    >
                      Add Expression
                    </DefaultButton>
                    <PrimaryButton type="submit">Filter</PrimaryButton>
                  </Stack>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );

  return form;
};

export default Builder;
