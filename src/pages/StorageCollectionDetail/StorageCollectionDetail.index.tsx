import {
  IStackTokens,
  Link,
  MessageBar,
  MessageBarType,
  Shimmer,
  Stack,
  Text,
} from "@fluentui/react";
import { useParams } from "react-router";
import { marked } from "marked";
import DOMPurify from "dompurify";

import Banner from "components/stac/Banner";
import Layout from "components/Layout";
import NotFound from "pages/NotFound";
import SEO from "components/Seo";
import { nonApiDatasetToPcCollection } from "pages/Catalog2/helpers";
import { useGitHubDatasetDescription } from "utils/requests";
import { messageBarStyles } from "components/stac/RequiresAccount";

interface Props {
  collections: Record<string, NonApiDatasetEntry>;
}

export const StorageCollectionDetail: React.FC<Props> = ({ collections }) => {
  const id = useParams()?.id || "";
  const { isLoading, data: description } = useGitHubDatasetDescription(id);

  const dataset = collections[id];

  if (!dataset || !id) {
    return <NotFound />;
  }

  const collection = nonApiDatasetToPcCollection(id, dataset);
  const banner = <Banner collection={collection} forceGradient />;

  const desc = makeDescription(dataset, description, isLoading);
  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title={collection.title} description={null} />
      <div className="main-content grid-content">{desc}</div>
    </Layout>
  );
};

const makeDescription = (
  dataset: NonApiDatasetEntry,
  description: string | null | undefined,
  isLoading: boolean
) => {
  const formatted = DOMPurify.sanitize(
    marked.parse(description || dataset.short_description)
  );
  // Use the fetched markdown to render the detail page. If the markdown wasn't fetched,
  // or isn't available, then show a link to the registered external site.
  return (
    <Stack>
      <h2>Note</h2>
      <MessageBar styles={messageBarStyles} messageBarType={MessageBarType.info}>
        <Stack tokens={tokens}>
          <Text>
            This dataset is not yet available in the Planetary Computer API, but can
            be accessed directly from Azure Blob Storage.
          </Text>
          {!description && (
            <Text block>
              See the dataset's
              <Link href={dataset.infoUrl}>full documentation</Link> for more
              information.
            </Text>
          )}
        </Stack>
      </MessageBar>
      {isLoading ? (
        <Shimmer />
      ) : (
        <p
          dangerouslySetInnerHTML={{
            __html: formatted,
          }}
        />
      )}
    </Stack>
  );
};

const tokens: IStackTokens = {
  childrenGap: 5,
};
