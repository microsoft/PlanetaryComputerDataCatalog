import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import site from "../config/site.yml";

function SEO({ description, lang, meta, title }) {
  const metaDescription = description || site.description;
  const defaultTitle = `${site.product}`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: defaultTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.author || ``,
        },
        {
          name: `twitter:title`,
          content: defaultTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    >
      {/* MS cookie consent library */}
      <script src="https://consentdeliveryfd.azurefd.net/mscc/lib/v2/wcp-consent.js"></script>

      {/* Microsoft analytics tracking library*/}
      <script
        src="https://az725175.vo.msecnd.net/scripts/jsll-4.js"
        type="text/javascript"
      ></script>

      {/* 
        Initialize the analytics library in the default configuration. This
        allows us to initialize _before_ user consent. DO NOT change configuration
        options before understanding their user consent implications.

        See: https://osgwiki.com/wiki/JSLLv4#JSLL_and_EU_Cookie_Compliance

        By default, this loads 4 cookies: MCC, MS0, MS1, and MSFPC - all deemed "essential"
        Cookie descriptions: https://osgwiki.com/wiki/JSLLv4#Cookies_Set.2FRead_by_JSLL

        Executes within a timeout because WcpConsent is not always available immediately after
        loading the script tag above.
      */}
      <script type="text/javascript">
        {`
          setTimeout(function() {
            // WCP initialization
            WcpConsent.init("en-US", "cookie-banner", function (err, siteConsent) {
                if (err != undefined) {
                    console.error("Unalbe to initialize the cookie consent library");
                    return err;
                } else {
                    // Track a global object for consent to make it available from the
                    // application React components
                    window.siteConsent = siteConsent;
                }
            });

            // JSLL initialization
            var config = {
                coreData: {
                    appId: "${process.env.REACT_APP_JSLL_APP_ID}"
                },
                callback: {
                    userConsentDetailsCallback: window.siteConsent ? window.siteConsent.getConsent : null
                },
            }

            awa.init(config);

        }, 500);
        `}
      </script>
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
