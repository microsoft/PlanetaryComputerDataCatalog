import marked from "marked";
import DOMPurify from "dompurify";

import { useStac } from "./CollectionContext";

const Description = () => {
  const collection = useStac();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(
          marked(collection.description.replace(/\\n/g, "\n"))
        ),
      }}
    ></div>
  );
};
export default Description;
