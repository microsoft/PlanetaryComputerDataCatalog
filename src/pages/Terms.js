import React from "react";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import { Link } from "@fluentui/react";

const Terms = () => {
  return (
    <Layout isShort>
      <SEO title="Terms of Use" />

      <article className="grid-content" style={{ margin: "40px 0" }}>
        <h1>Supplemental Terms of Use for Microsoft Planetary Computer Previews</h1>
        <p>Last updated: April 2021</p>
        <div style={{ maxWidth: 700 }}>
          <p>
            Microsoft may provide preview, beta, or other pre-release features or
            Services to obtain customer feedback (including any Software or Documents
            provided with such features or Services, collectively, “Previews”).
            Previews are made available to you on the condition that you agree to
            these Supplemental Terms of Use (“Supplemental Terms”), which supplement
            the{" "}
            <Link href="https://www.microsoft.com/en-us/servicesagreement">
              Microsoft Terms of Use
            </Link>{" "}
            (“TOU”) governing your use of Microsoft’s Planetary Computer service
            (“Services”). If these Supplemental Terms conflict with the TOU, the
            Supplemental Terms will govern. By accessing or using the Previews, or
            attempting to do either, you are accepting these Supplemental Terms and
            ratifying your acceptance of the TOU.
          </p>
          <p>
            Previews are provided solely for evaluation and testing. Certain features
            may be missing or disabled, and the Previews may contain bugs or other
            errors that could cause them to malfunction. They may not work correctly
            or in the manner that a commercial version of such Previews, if any, may
            function. You will not (and will instruct your personnel not to) use the
            Previews for anything mission critical to you or your business
            operations. You (and your personnel) are solely liable for evaluating
            Previews and their output.
          </p>
          <p>
            <strong>
              Previews, and any type of customer support for them (if provided), are
              provided "as-is," "with all faults," and "as available." Without
              limiting the above, Microsoft provides the Previews without (and
              expressly disclaims and excludes) any service level commitments,
              guarantees (including regarding uptime), and warranties of any kind.
              For any claim related to Previews, you can recover, from Microsoft and
              its suppliers in the aggregate, only direct damages up to USD$10.
            </strong>{" "}
            Previews may not be covered by customer support. At any time and without
            notice, Microsoft may change or discontinue Previews and choose not to
            make a Preview generally available.
          </p>
          <p>
            Previews are subject to reduced or different security, compliance, and
            privacy commitments. Previews are not meant for production use (though
            such use is not prohibited), especially to process personal data or other
            data that is subject to heightened compliance requirements. Any use of
            “live” or production data is at your sole risk, and you will hold
            Microsoft and its affiliates harmless from any third-party claims and
            liabilities related to your or your personnel’s use of Previews in a
            production or live operating environment. Previews are not subject to any
            statements made on the{" "}
            <Link href="https://www.microsoft.com/en-us/trust-center">
              Microsoft Trust Center
            </Link>
            . Customer data provided to Microsoft through your use of Previews may be
            transferred, stored, and processed in the United States, or in any other
            country where Microsoft or its subcontractors operate.
          </p>
          <p>
            If you or your personnel give us any ideas, suggestions, comments, input,
            or know-how (collectively, “Feedback”) related to our products or
            services, you (on your own behalf and on behalf of your personnel) give
            us, without charge, the right to use, share, and commercialize the
            Feedback in any way and for any purpose, without regard to intellectual
            property or otherwise.
          </p>
        </div>
      </article>
    </Layout>
  );
};

export default Terms;
