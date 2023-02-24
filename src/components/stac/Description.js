import { marked } from "marked";
import DOMPurify from "dompurify";

import { useStac } from "./CollectionContext";
import { a11yPostProcessDom } from "utils";

const Description = () => {
  const collection = useStac();

  const desc = DOMPurify.sanitize(
    marked(collection.description.replace(/\\n/g, "\n"))
  );
  const dom = new DOMParser().parseFromString(desc, "text/html");
  a11yPostProcessDom(dom);
  const processedMarkup = new XMLSerializer().serializeToString(dom);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: processedMarkup,
      }}
    ></div>
  );
};
export default Description;
