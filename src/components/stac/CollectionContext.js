import * as React from "react";

const CollectionContext = React.createContext();

function CollectionProvider({ collection, children }) {
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
}

function useStac() {
  const context = React.useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useStac must be used within a CollectionProvider");
  }
  return context;
}
export { CollectionProvider, useStac };
