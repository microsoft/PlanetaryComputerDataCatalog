import React, { useState } from "react";
import { useFormik } from "formik";
import { PrimaryButton, Stack, Text } from "@fluentui/react";
import axios from "axios";
import * as yup from "yup";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import FormInput from "../components/forms/FormInput";
import FormSelect from "../components/forms/FormSelect";
import DefaultBanner from "../components/DefaultBanner";

import {
  successMsg,
  failMsg,
  languageOptions,
  industryOptions,
} from "../config/account";
import countries from "../config/countries.yml";

import { marginVStyle } from "../styles";

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
      <Stack tokens={{ childrenGap: 8 }}>
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
      </Stack>
      <PrimaryButton type="submit" text="Submit" styles={marginVStyle} />
    </form>
  );

  const banner = (
    <DefaultBanner>
      <h1>Request an account</h1>
      <Text block>
        The Planetary Computer API and Planetary Computer Hub are currently in
        preview, and we’re excited to expand our partner and developer network.
        If you’re interested in being one of our first users, please provide the
        following information. We will accommodate as many users as we can in
        our preview, but we are excited to support the entire environmental
        sustainability community when the Planetary Computer is publicly
        available.
      </Text>
    </DefaultBanner>
  );

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Account Request" />
      <p>
        [TOS and details about why we are collecting this information, and what
        we will do with it.]
      </p>
      {form}
      {msg}
    </Layout>
  );
};

export default AccountSurvey;
