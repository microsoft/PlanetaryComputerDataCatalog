import { Formik, Form } from "formik";
import {
  Link,
  PrimaryButton,
  Separator,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import axios from "axios";
import * as yup from "yup";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import FormInput from "../components/forms/FormInput";
import FormSelect from "../components/forms/FormSelect";
import FormCheckbox from "../components/forms/FormCheckbox";
import DefaultBanner from "../components/DefaultBanner";
import NewTabLink from "../components/controls/NewTabLink";

import { languageOptions, industryOptions } from "../config/account.yml";
import countries from "../config/countries.yml";

import { marginVStyle } from "../styles";
import { ScrollToTopOnMount } from "../components/ScrollToTopOnMount";

const rowProps = { horizontal: true, verticalAlign: "center" };
const stackTokens = {
  spinnerStack: {
    childrenGap: 20,
  },
};

const AccountSurvey = () => {
  const history = useHistory();
  const mutation = useMutation(survey => axios.post("./api/survey", survey));

  const handleSubmit = survey => {
    mutation.mutate(survey);
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
    terms: yup.boolean().required(),
  });

  const formikProps = {
    initialValues: {
      email: "",
      name: "",
      affiliation: "",
      industry: "",
      languages: [],
      country: "",
      datasets: "",
      studyArea: "",
      terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  };

  const tosLabel = (
    <span>
      You have read and agree to our{" "}
      <NewTabLink href="/terms">terms of use</NewTabLink>.
    </span>
  );

  const form = (
    <Formik {...formikProps}>
      <Form style={{ maxWidth: "500px", marginBottom: 80 }}>
        <p>
          If you're interested in being one of our first users, please provide the
          following information. We will accommodate as many users as we can in our
          preview, but we are excited to support the entire environmental
          sustainability community when the Planetary Computer is publicly available.
        </p>
        <Separator />
        <p>
          Microsoft will use this information to communicate with you about the
          Planetary Computer, to evaluate your eligibility to participate in our
          private preview, to prioritize new features, and to communicate
          non-identifying information – both internally and externally – about the
          geographic regions and focus areas that our users represent. For more
          information on how we use your data please see{" "}
          <NewTabLink href="https://go.microsoft.com/fwlink/?LinkId=521839">
            Privacy &amp; Cookies
          </NewTabLink>
          .
        </p>
        <Stack tokens={{ childrenGap: 8 }}>
          <FormInput required name="email" label="Email" />
          <FormInput required name="name" label="Name" />
          <FormInput
            name="affiliation"
            label="Affiliated Organization"
            placeholder="Company, institution, university, etc."
          />
          <FormSelect name="industry" label="Sector" options={industryOptions} />
          <FormSelect
            multiSelect
            name="languages"
            label="Primary programming languages"
            options={languageOptions}
          />
          <FormSelect
            name="country"
            label="Country"
            options={Object.values(countries).map(c => ({ key: c, text: c }))}
          />
          <FormInput
            name="datasets"
            label="What datasets are you interested in?"
            multiline
          />
          <FormInput
            name="studyArea"
            label="What is your area of study?"
            multiline
          />
          <FormCheckbox name="terms" label={tosLabel} required={true} />
        </Stack>
        <Stack {...rowProps} tokens={stackTokens.spinnerStack}>
          <PrimaryButton
            disabled={mutation.isLoading}
            type="submit"
            text="Submit"
            styles={marginVStyle}
          />
          {mutation.isLoading && <Spinner size={SpinnerSize.large} />}
        </Stack>
      </Form>
    </Formik>
  );

  const banner = (
    <DefaultBanner>
      <h1>Request access</h1>
      <p>
        The Planetary Computer API and Planetary Computer Hub are currently in
        private preview, and we're excited to expand our partner and developer
        network.
      </p>
    </DefaultBanner>
  );

  const successMsg = (
    <>
      <h2>Thank you for your interest!</h2>
      <p style={{ maxWidth: "50%" }}>
        You've been added to our waiting list. We'll follow up with additional
        information as we expand access to the Planetary Computer. Please email{" "}
        <Link href="mailto:planetarycomputer@microsoft.com">
          planetarycomputer@microsoft.com
        </Link>{" "}
        if you have additional questions.
      </p>
      <ScrollToTopOnMount />
    </>
  );

  const failMsg = (
    <>
      <h2>Something went wrong...</h2>
      <Text block>
        Sorry, we seem to be having trouble with our signups at the moment. Please{" "}
        <Link onClick={() => history.go(0)}>try again</Link> or email{" "}
        <Link href="mailto:planetarycomputer@microsoft.com">
          planetarycomputer@microsoft.com
        </Link>{" "}
        for support.
      </Text>
      <ScrollToTopOnMount />
    </>
  );

  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title="Account Request" />
      <div className="grid-content">
        {mutation.isError && failMsg}
        {(mutation.isLoading || mutation.isIdle) && form}
        {mutation.isSuccess && successMsg}
      </div>
    </Layout>
  );
};

export default AccountSurvey;
