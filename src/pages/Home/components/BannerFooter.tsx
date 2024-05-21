import { Link, Text } from "@fluentui/react";

import ImageStrip from "./ImageStrip";

const BannerFooter = () => {
  return (
    <>
      <ImageStrip />
      <div className="home-footer-container">
        <div className="home-footer-grid grid-content">
          <Text
            block
            variant="xxLargePlus"
            className="home-footer-item"
            style={{ color: "#fff" }}
          >
            Building a global environmental network
          </Text>
          <div className="home-footer-item">
            <Text
              block
              variant="large"
              style={{
                color: "#fff",
                marginBottom: 20,
              }}
            >
              The Planetary Computer is only as strong as the partner community that
              is building applications on it. If you are interested in scaling your
              environmental sustainability work with the power of the cloud,{" "}
              <Link
                underline
                href="mailto:planetarycomputer@microsoft.com"
                style={{ color: "#fff", fontWeight: 600 }}
              >
                contact us
              </Link>
              .
            </Text>
            <Text
              block
              variant="large"
              style={{
                color: "#fff",
              }}
            >
              The Planetary Computer API is currently available in preview.
              <p>
                Learn more about Microsoft's{" "}
                <Link
                  underline
                  href="https://www.microsoft.com/en-us/corporate-responsibility/sustainability"
                  style={{ color: "#fff", fontWeight: 600 }}
                >
                  commitment to sustainability
                </Link>
                .
              </p>
            </Text>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerFooter;
