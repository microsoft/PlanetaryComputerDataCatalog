import { useState } from "react";
import { ActionButton, getTheme } from "@fluentui/react";
import { useTimeoutFn } from "react-use";

const Footer = ({ onGrid = true }) => {
  const theme = getTheme();
  // Allow users to manage their cookie consent preferences. Not all regions
  // require consent, and the cookie library will do a no-op if the consent dialog is
  // launched in a non-required region. So check for requirements before rendering the button.
  // Defaulting to true is primarily to satisfy the compliance test, to ensure
  // that manage button is rendered on first render, while the consent library
  // may still be loading.
  const [isConsentRequired, setIsConsentRequired] = useState(true);

  useTimeoutFn(() => {
    // Cookie consent is determined regionally. If it can't be determined, default
    // to requiring consent.
    const consent = window?.siteConsent?.isConsentRequired;
    setIsConsentRequired(consent === undefined ? true : consent);
  }, 100);

  const manageConsent = isConsentRequired ? (
    // Button to launch consent form, styled to mimic the UHF links
    <ActionButton
      onClick={() => window.siteConsent.manageConsent()}
      ariaDescription="Launch cookie consent form"
      style={{ fontSize: "11px", padding: "0", color: "#616161", height: "0" }}
    >
      Manage cookies
    </ActionButton>
  ) : null;

  const navClass = onGrid ? "grid-content" : "off-grid-content";

  return (
    <footer
      className="context-uhf"
      style={{
        borderTop: "1px solid",
        borderColor: theme.palette.neutralQuaternaryAlt,
      }}
    >
      <div className={`c-uhff-base ${navClass}`} style={{ paddingBottom: 2 }}>
        <nav aria-label="Microsoft corporate links">
          <ul
            className="c-list f-bare"
            data-m='{"cN":"Corp links_cont","cT":"Container","id":"c7c1c1m1r1a2","sN":7,"aN":"c1c1m1r1a2"}'
            style={{ margin: 0 }}
          >
            <li id="c-uhff-footer_sitemap">
              <a
                className="c-uhff-link"
                href="https://www.microsoft.com/en-us/sitemap1.aspx"
                data-mscc-ic="false"
                data-m='{"cN":"Footer_Sitemap_nav","id":"n1c7c1c1m1r1a2","sN":1,"aN":"c7c1c1m1r1a2"}'
              >
                Sitemap
              </a>
            </li>
            <li id="c-uhff-footer_contactus">
              <a
                className="c-uhff-link"
                href="https://support.microsoft.com/contactus"
                data-mscc-ic="false"
                data-m='{"cN":"Footer_ContactUs_nav","id":"n2c7c1c1m1r1a2","sN":2,"aN":"c7c1c1m1r1a2"}'
              >
                Contact Microsoft
              </a>
            </li>
            <li id="c-uhff-footer_privacyandcookies">
              <a
                className="c-uhff-link"
                href="https://go.microsoft.com/fwlink/?LinkId=521839"
                data-mscc-ic="false"
                data-m='{"cN":"Footer_PrivacyandCookies_nav","id":"n3c7c1c1m1r1a2","sN":3,"aN":"c7c1c1m1r1a2"}'
              >
                Privacy{" "}
              </a>
            </li>
            <li id="c-uhff-footer_termsofuse">
              <a
                className="c-uhff-link"
                href="/terms"
                data-mscc-ic="false"
                data-m='{"cN":"Footer_TermsOfUse_nav","id":"n5c7c1c1m1r1a2","sN":5,"aN":"c7c1c1m1r1a2"}'
              >
                Terms of use
              </a>
            </li>
            <li id="c-uhff-footer_trademarks">
              <a
                className="c-uhff-link"
                href="https://www.microsoft.com/trademarks"
                data-mscc-ic="false"
                data-m='{"cN":"Footer_Trademarks_nav","id":"n6c7c1c1m1r1a2","sN":6,"aN":"c7c1c1m1r1a2"}'
              >
                Trademarks
              </a>
            </li>
            <li id="c-uhff-footer_safetyandeco">
              <a
                className="c-uhff-link"
                href="https://www.microsoft.com/en-us/devices/safety-and-eco "
                data-mscc-ic="false"
                data-m='{"cN":"Footer_SafetyAndEco_nav","id":"n7c7c1c1m1r1a2","sN":7,"aN":"c7c1c1m1r1a2"}'
              >
                Safety &amp; eco
              </a>
            </li>
            <li id="c-uhff-footer_aboutourads">
              <a
                className="c-uhff-link"
                href="https://choice.microsoft.com"
                data-mscc-ic="false"
                data-m='{"cN":"Footer_AboutourAds_nav","id":"n8c7c1c1m1r1a2","sN":8,"aN":"c7c1c1m1r1a2"}'
              >
                About our ads
              </a>
            </li>

            {isConsentRequired && (
              <li className=" x-hidden" id="c-uhff-footer_managecookies">
                {manageConsent}
              </li>
            )}

            <li className="x-hidden-focus">
              {" "}
              © Microsoft {new Date().getFullYear()}
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
