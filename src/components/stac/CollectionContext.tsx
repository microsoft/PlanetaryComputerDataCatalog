import * as React from "react";
import { IStacCollection } from "types/stac";

const CollectionContext = React.createContext<IStacCollection | null>(null);

interface CollectionProviderProps {
  collection: IStacCollection;
}

const CollectionProvider: React.FC<CollectionProviderProps> = ({
  collection,
  children,
}) => {
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
};

function useStac() {
  const context = React.useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useStac must be used within a CollectionProvider");
  }
  return context;
}
export { CollectionProvider, useStac };
