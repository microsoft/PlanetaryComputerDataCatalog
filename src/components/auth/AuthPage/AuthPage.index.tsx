import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import React from "react";

export const AuthPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div>You must be logged in to view this page.</div>
      </UnauthenticatedTemplate>
    </>
  );
};
