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
      {/* 
        Initialize the analytics library in the default configuration. This
        allows us to initialize _before_ user consent. DO NOT change configuration
        options before understanding their user consent implications.

        See: https://osgwiki.com/wiki/JSLLv4#JSLL_and_EU_Cookie_Compliance

        By default, this loads 4 cookies: MCC, MS0, MS1, and MSFPC - all deemed "essential"
        Cookie descriptions: https://osgwiki.com/wiki/JSLLv4#Cookies_Set.2FRead_by_JSLL

        Executes within a timeout because WcpConsent is not always available immediately after
        loading the script tag.

      */}
      <script key="consent-manager" type="text/javascript">
        {`
          let retries = 0;
          const maxRetries = 20;
          const retryInterval = 50; //ms

          // Try loading consent immediately, in case the script is already loaded
          loadConsent();

          // Retry loading the consent library as a fallback in case it was
          // not loaded when this script first executes
          const intervalId = setInterval(() => { 
            // Don't continue to retry if we exceeded our retry count or the consent library
            // has already attached to window.
            if (retries++ > maxRetries || window.siteConsent) {
              return clearInterval(intervalId);
            }
            console.log(retries)
            loadConsent();

          }, retryInterval);

          function loadConsent() {
              if (!WcpConsent) {
                // Exit early, it will retry maxRetries times
                return;
              }

              // WCP initialization
              WcpConsent.init("en-US", "cookie-banner", function (err, siteConsent) {
                  if (err != undefined) {
                      console.error("Unalbe to initialize the cookie consent library");
                      return err;
                  } else {
                      // Track a global object for consent to make it available from the
                      // application React components
                      window.siteConsent = siteConsent;
                      
                      if (siteConsent?.isConsentRequired) {
                        // Scroll to top to ensure that the cookie banner is visible
                        window.scrollTo(0,0);
                      }
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


          }
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
