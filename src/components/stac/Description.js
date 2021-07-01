import marked from "marked";
import DOMPurify from "dompurify";

import { useStac } from "./CollectionContext";

const Description = () => {
  const collection = useStac();

  return (
    <div
      className="collection-content-item"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(
          marked(collection.description.replace(/\\n/g, "<br/>"))
        ),
      }}
    ></div>
  );
};
export default Description;
