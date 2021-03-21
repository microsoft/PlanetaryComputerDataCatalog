import React from "react";
import { Text } from "@fluentui/react";
import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";

const Providers = ({ providers }) => {
  const providerList = providers.map(p => {
    return (
      <div key={`provider-${p.name}`}>
        <NewTabLink href={p.url}>{p.name} </NewTabLink>
        <Text block styles={{ root: { marginLeft: "5px" } }}>
          ({p.roles.join(", ")})
        </Text>
      </div>
    );
  });

  return <LabeledValue label="Providers">{providerList}</LabeledValue>;
};

export default Providers;
