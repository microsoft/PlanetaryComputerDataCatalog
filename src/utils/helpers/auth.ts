import { Configuration, RedirectRequest, SilentRequest } from "@azure/msal-browser";
import {
  API_READ_SCOPE,
  API_WRITE_SCOPE,
  AUTH_CLIENT_ID,
  AUTH_TENANT_ID,
} from "./constants";

export const msalConfig: Configuration = {
  auth: {
    clientId: AUTH_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AUTH_TENANT_ID}`,
    redirectUri: new URL(window.location.href).origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for initial ID and Access token request, including consents for all scopes.
export const loginRequest: RedirectRequest = {
  scopes: ["User.Read"],
  extraScopesToConsent: [API_READ_SCOPE, API_WRITE_SCOPE],
};

// Scopes that are required for the  API gateway request. Scopes here need to have
// been consented to in login for them to be requested silently later.
export const tokenRequest: SilentRequest = {
  scopes: [API_READ_SCOPE, API_WRITE_SCOPE],
};
