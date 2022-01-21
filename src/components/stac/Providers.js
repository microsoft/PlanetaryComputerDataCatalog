import NewTabLink from "../controls/NewTabLink";
import LabeledValue from "../controls/LabeledValue";
import { useStac } from "./CollectionContext";
import { Text } from "@fluentui/react";

const Providers = () => {
  const { providers } = useStac();

  const providerList = providers.map((p, i) => {
    return (
      <Text block key={`provider-${p.name}`}>
        <NewTabLink href={p.url}>{p.name} </NewTabLink>({p.roles.join(", ")})
      </Text>
    );
  });

  return <LabeledValue label="Providers">{providerList}</LabeledValue>;
};

export default Providers;
