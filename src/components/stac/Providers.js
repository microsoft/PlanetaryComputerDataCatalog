import React from "react";
import { Text } from "@fluentui/react";
import NewTabLink from "../controls/NewTabLink";

const Providers = ({ providers }) => {
  const providerList = providers.map(p => {
    return (
      <div key={`provider-${p.name}`}>
        <NewTabLink href={p.url}>{p.name}: </NewTabLink>
        <Text>{p.roles.join(", ")}</Text>
      </div>
    );
  });

  return (
    <>
      <h3>Providers</h3>
      {providerList}
    </>
  );
};

export default Providers;
