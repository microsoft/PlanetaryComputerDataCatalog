/*
  Authenticated oAuth2 token request variables. These are not secret values, but
  vary by environment.
*/
export const AUTH_TENANT_ID = process.env.REACT_APP_AUTH_TENANT_ID || "";
export const AUTH_CLIENT_ID = process.env.REACT_APP_AUTH_CLIENT_ID || "";
export const AUTH_BACKEND_APP_ID = process.env.REACT_APP_AUTH_BACKEND_APP_ID || "";
export const API_READ_SCOPE = `api://${AUTH_BACKEND_APP_ID}/Runs.Read.All`;
export const API_WRITE_SCOPE = `api://${AUTH_BACKEND_APP_ID}/Runs.Write.All`;

// The API endpoint to use for authenticated chat API requests.
export const AI_API_ROOT = process.env.REACT_APP_AI_API_ROOT || "";

// Validate some settings and print appropriate warnings.
if (
  ![
    AI_API_ROOT,
    AUTH_TENANT_ID,
    AUTH_CLIENT_ID,
    AUTH_BACKEND_APP_ID,
    API_READ_SCOPE,
  ].every(Boolean)
) {
  console.error("Missing authentication app environment variables");
}
