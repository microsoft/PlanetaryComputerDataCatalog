import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { IStackTokens, Stack } from "@fluentui/react";
import { PcPersona } from "./PcPersona";
import { SignInButton } from "./SignInButton";

export const UserHeaderControl: React.FC = () => {
  return (
    <Stack tokens={gapSmall} verticalAlign="center">
      <Stack horizontal tokens={gapRegular}>
        <AuthenticatedTemplate>
          <PcPersona />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <SignInButton />
        </UnauthenticatedTemplate>
      </Stack>
    </Stack>
  );
};

export const gapRegular: IStackTokens = {
  childrenGap: 8,
};

export const gapSmall: IStackTokens = {
  childrenGap: 4,
};
