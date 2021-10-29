import { DefaultButton, PrimaryButton, Separator, Stack } from "@fluentui/react";

interface Props {
  onCancel: () => void;
  onSave: () => void;
  isValid: boolean;
}

const ControlFooter = ({ onSave, onCancel, isValid }: Props) => {
  return (
    <Stack>
      <Separator />
      <Stack horizontal horizontalAlign={"end"} tokens={{ childrenGap: 6 }}>
        <PrimaryButton onClick={onSave} disabled={!isValid}>
          Apply
        </PrimaryButton>
        <DefaultButton onClick={onCancel}>Cancel</DefaultButton>
      </Stack>
    </Stack>
  );
};

export default ControlFooter;
