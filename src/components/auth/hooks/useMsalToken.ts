import React, { useEffect } from "react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

import { tokenRequest } from "utils/helpers/auth";

interface MsalTokenHookPropsReturn {
  accessToken: string | undefined;
  inProgress: InteractionStatus;
}

export const useMsalToken = (): MsalTokenHookPropsReturn => {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = React.useState<string>();
  const account = accounts[0];

  useEffect(() => {
    const accessTokenRequest = {
      ...tokenRequest,
      account,
    };

    const acquireToken = async () => {
      try {
        const accessTokenResponse = await instance.acquireTokenSilent(
          accessTokenRequest
        );
        setAccessToken(accessTokenResponse.accessToken);
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          try {
            const accessTokenResponse = await instance.acquireTokenPopup(
              accessTokenRequest
            );
            setAccessToken(accessTokenResponse.accessToken);
          } catch (popupError) {
            console.error(popupError);
          }
        } else {
          console.warn(error);
        }
      }
    };
    if (account && inProgress === InteractionStatus.None) {
      acquireToken();
    }
  }, [account, inProgress, instance]);

  return { accessToken, inProgress };
};
