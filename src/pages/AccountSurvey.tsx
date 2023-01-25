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
import { useNavigate } from "react-router";
import axios from "axios";
import * as yup from "yup";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import FormInput from "../components/forms/FormInput";
import FormSelect from "../components/forms/FormSelect";
import FormCheckbox from "../components/forms/FormCheckbox";
import DefaultBanner from "../components/DefaultBanner";
import NewTabLink from "../components/controls/NewTabLink";

import options from "config/account.yml";
import countries from "config/countries.yml";

import { marginVStyle } from "../styles";
import { ScrollToTopOnMount } from "../components/ScrollToTopOnMount";

const stackTokens = {
  spinnerStack: {
    childrenGap: 20,
  },
};

const AccountSurvey = () => {
  const navigate = useNavigate();
  const mutation = useMutation((survey: Record<string, any>) =>
    axios.post("./api/survey", survey)
  );

  const handleSubmit = (survey: Record<string, any>) => {
    mutation.mutate(survey);
  };

  const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    name: yup.string().required("Your name is required"),
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
          The Planetary Computer Explorer, APIs and many datasets are available to anyone
          who would like to use it. Check out the {" "}
          <Link href="catalog">
            Data Catalog
          </Link>{" "} to get started.
        </p>
        <p>
          For specific datasets such {" "}
          <NewTabLink href="dataset/sentinel-1-rtc">
            Sentinel 1 RTC
          </NewTabLink>{" "} or to access the {" "}
          <NewTabLink href="docs/overview/environment/">
            Planetary Computer Hub
          </NewTabLink>{" "},
          you will need to create an account.
        </p>
        <p>
          To request an account please tell us about the project or solution you are working on and
          how you are using geospatial data. We strive to review new requests frequently and will let
          you know once your request has been approved.
        </p>
        <p>
          Note: if you are trying to login with an enterprise email address, your company may have
          locked down your usage of that email preventing you from using it to log in. If that happens
          when trying to log in, please use a non-enterprise or personal email address.
        </p>
        <Separator />
        <p>
          Microsoft will use this information to communicate with you about the
          Planetary Computer, to evaluate your eligibility to participate in our
          preview, to prioritize new features, and to communicate non-identifying
          information—both internally and externally—about the geographic regions and
          focus areas that our users represent. For more information on how we use
          your data please see{" "}
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
          <FormSelect
            name="industry"
            label="Sector"
            options={options.industryOptions}
          />
          <FormSelect
            multiSelect
            name="languages"
            label="Primary programming languages"
            options={options.languageOptions}
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
        <Stack
          horizontal={true}
          verticalAlign="center"
          tokens={stackTokens.spinnerStack}
        >
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
        preview, and we're excited to expand our partner and developer network.
      </p>
    </DefaultBanner>
  );

  const successMsg = (
    <>
      <h2>Thank you for your interest!</h2>
      <p style={{ maxWidth: "50%" }}>
        We are reviewing your request and will let you know once your account has been approved.
        In the meantime, you can explore our data catalog by going to {" "}
        <Link href="catalog">
          Data Catalog
        </Link>{" "} page.
        Please contact {" "}
        <Link href="mailto:planetarycomputer@microsoft.com">
          planetarycomputer@microsoft.com
        </Link>{" "} if you have questions or if you would like to unsubscribe.
      </p>
      <ScrollToTopOnMount />
    </>
  );

  const failMsg = (
    <>
      <h2>Something went wrong...</h2>
      <Text block>
        Sorry, we seem to be having trouble with our signups at the moment. Please{" "}
        <Link onClick={() => navigate(0)}>try again</Link> or email{" "}
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
