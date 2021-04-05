import React from "react";
import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";

const Providers = ({ providers }) => {
  const providerList = providers.map((p, i) => {
    return (
      <span key={`provider-${p.name}`}>
        <NewTabLink href={p.url}>{p.name} </NewTabLink>({p.roles.join(", ")})
        {i < providers.length - 1 ? " | " : ""}
      </span>
    );
  });

  return <LabeledValue label="Providers">{providerList}</LabeledValue>;
};

export default Providers;
