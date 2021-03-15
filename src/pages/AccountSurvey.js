import { PrimaryButton } from "@fluentui/react";
import axios from "axios";
import React, { useState } from "react";
import SEO from "../components/Seo";

const AccountSurvey = () => {
  const [msg, setMsg] = useState();
  const successMsg =
    "Thank you for your interest in the Planetary Computer! We'll reach out to you about next steps.";
  const failMsg =
    "Sorry, we're currently unable to accept new reqeusts. Please try again later.";
  const paddedStyle = { paddingBottom: "1.2rem", paddingTop: "1.2em" };

  const submitSurvey = async () => {
    try {
      const resp = await axios.post("/api/AccountSurveyWrite", {
        name: "Matt",
        email: "test@example.com",
        industry: "Commercial",
        affiliation: "Bronx Zoo",
        note: "This is a test request.",
      });

      const respMsg = resp.status === 200 ? successMsg : failMsg;
      setMsg(respMsg);
    } catch {
      setMsg(failMsg);
    }
  };

  return (
    <div>
      <SEO title="Account Request" />
      <h2>Request an account</h2>
      <div style={paddedStyle}>Submits an example submission.</div>
      <PrimaryButton text="Submit" onClick={submitSurvey} />
      <div style={paddedStyle}>{msg}</div>
    </div>
  );
};

export default AccountSurvey;
