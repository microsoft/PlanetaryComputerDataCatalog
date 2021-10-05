import { Link, Stack } from "@fluentui/react";
import { buttonStyles } from "./ResetSelectors";

const CustomizeQuery = () => {
  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link styles={buttonStyles} data-cy="customize-query">
        Customize this filter
      </Link>
    </Stack>
  );
};

export default CustomizeQuery;
