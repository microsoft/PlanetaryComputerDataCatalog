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
            <li>
              <a
                href="https://aka.ms/yourcaliforniaprivacychoices"
                style={{ position: "relative", top: 4 }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="data:image/svg+xml,%3Csvg%20role%3D%22img%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2030%2014%22%20height%3D%2216%22%20width%3D%2243%22%3E%3Ctitle%3ECalifornia%20Consumer%20Privacy%20Act%20(CCPA)%20Opt-Out%20Icon%3C%2Ftitle%3E%3Cpath%20d%3D%22M7.4%2012.8h6.8l3.1-11.6H7.4C4.2%201.2%201.6%203.8%201.6%207s2.6%205.8%205.8%205.8z%22%20style%3D%22fill-rule%3Aevenodd%3Bclip-rule%3Aevenodd%3Bfill%3A%23fff%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M22.6%200H7.4c-3.9%200-7%203.1-7%207s3.1%207%207%207h15.2c3.9%200%207-3.1%207-7s-3.2-7-7-7zm-21%207c0-3.2%202.6-5.8%205.8-5.8h9.9l-3.1%2011.6H7.4c-3.2%200-5.8-2.6-5.8-5.8z%22%20style%3D%22fill-rule%3Aevenodd%3Bclip-rule%3Aevenodd%3Bfill%3A%2306f%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M24.6%204c.2.2.2.6%200%20.8L22.5%207l2.2%202.2c.2.2.2.6%200%20.8-.2.2-.6.2-.8%200l-2.2-2.2-2.2%202.2c-.2.2-.6.2-.8%200-.2-.2-.2-.6%200-.8L20.8%207l-2.2-2.2c-.2-.2-.2-.6%200-.8.2-.2.6-.2.8%200l2.2%202.2L23.8%204c.2-.2.6-.2.8%200z%22%20style%3D%22fill%3A%23fff%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M12.7%204.1c.2.2.3.6.1.8L8.6%209.8c-.1.1-.2.2-.3.2-.2.1-.5.1-.7-.1L5.4%207.7c-.2-.2-.2-.6%200-.8.2-.2.6-.2.8%200L8%208.6l3.8-4.5c.2-.2.6-.2.9%200z%22%20style%3D%22fill%3A%2306f%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                    alt="privacy icon"
                  />
                  <span>Your Privacy Choices</span>
                </div>
              </a>
            </li>
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
