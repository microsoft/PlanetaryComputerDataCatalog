import { PrimaryButton } from "@fluentui/react";
import axios from "axios";
import React, { useState } from "react";

const AccountSurvey = () => {
  const [msg, setMsg] = useState();

  const submitSurvey = async () => {
    const resp = await axios.post("/api/AccountSurvey", { name: "Lina" });
    setMsg(resp.data);
  };

  return (
    <>
      <PrimaryButton text="Submit" onClick={submitSurvey} />
      <div>{msg}</div>
    </>
  );
};

export default AccountSurvey;
