import React, { useState } from "react";
import { useFormik } from "formik";
import { PrimaryButton, Stack } from "@fluentui/react";
import axios from "axios";
import * as yup from "yup";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import FormInput from "../components/forms/FormInput";
import FormSelect from "../components/forms/FormSelect";
import countries from "../config/countries.yml";
import {
  successMsg,
  failMsg,
  languageOptions,
  industryOptions,
} from "../config/account";

import { marginVStyle, paddingVStyle } from "../styles";

const AccountSurvey = () => {
  const [msg, setMsg] = useState();

  const handleSubmit = async survey => {
    try {
      const resp = await axios.post("./api/survey", survey);
      const respMsg = resp.status === 200 ? successMsg : failMsg;
      setMsg(respMsg);
    } catch {
      setMsg(failMsg);
    }
  };

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    name: yup.string("Enter your full name").required("Your name is required"),
    affiliation: yup.string(),
    industry: yup.string(),
    languages: yup.array(),
    country: yup.string(),
    datasets: yup.string(),
    areaOfStudy: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      affiliation: "",
      industry: "",
      languages: [],
      country: "",
      datasets: "",
      studyArea: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const form = (
    <form onSubmit={formik.handleSubmit} style={{ maxWidth: "500px" }}>
      <FormInput required name="email" label="Email" formik={formik} />
      <FormInput required name="name" label="Name" formik={formik} />
      <FormInput
        name="affiliation"
        label="Affiliated Organization"
        placeholder="Company, institution, university, etc."
        formik={formik}
      />
      <FormSelect
        name="industry"
        label="Sector"
        options={industryOptions}
        formik={formik}
      />
      <FormSelect
        multiSelect
        name="languages"
        label="Primary programming languages"
        options={languageOptions}
        formik={formik}
      />
      <FormSelect
        name="country"
        label="Country"
        options={Object.values(countries).map(c => ({ key: c, text: c }))}
        formik={formik}
      />
      <FormInput
        name="datasets"
        label="Describe the datasets you're interested in"
        formik={formik}
        multiline
      />
      <FormInput
        name="studyArea"
        label="Area of study"
        formik={formik}
        multiline
      />
      <PrimaryButton type="submit" text="Submit" styles={marginVStyle} />
    </form>
  );
  return (
    <Layout>
      <SEO title="Account Request" />
      <h2>Request an account</h2>
      <Stack styles={paddingVStyle}>
        The Planetary Computer is in Limited Preview and is not ready for a
        general audience. Please register your interest in using this service
        and we will follow up!
      </Stack>
      {form}
      <Stack style={paddingVStyle}>{msg}</Stack>
    </Layout>
  );
};

export default AccountSurvey;
