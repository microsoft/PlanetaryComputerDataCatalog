import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import {
  BaseButton,
  ContextualMenuItemType,
  DirectionalHint,
  IContextualMenuProps,
  IPersonaProps,
  mergeStyleSets,
  Persona,
  PersonaSize,
} from "@fluentui/react";

export const PcPersona: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated || !accounts.length) return null;

  const account = accounts[0];
  const name = account?.name;
  const [first, last] = name?.split(" ") || [];

  const persona: IPersonaProps = {
    text: name,
    imageInitials: first[0] + last[0],
    size: PersonaSize.size24,
  };

  const handleLogout = () => {
    instance
      .logoutRedirect({
        onRedirectNavigate: () => {
          // Stop navigation after local logout (user remains signed into their server session)
          return false;
        },
      })
      .catch(e => {
        console.error(e);
      });
  };

  const menu: IContextualMenuProps = {
    items: [
      {
        key: "header",
        text: account.username,
        itemType: ContextualMenuItemType.Header,
      },
      { key: "signout", text: "Sign Out", onClick: handleLogout },
    ],
    directionalHint: DirectionalHint.bottomCenter,
    isBeakVisible: true,
  };

  return (
    <BaseButton
      className={styles.button}
      menuProps={menu}
      styles={buttonChevronStyle}
    >
      <Persona {...persona} />
    </BaseButton>
  );
};

const buttonChevronStyle = { menuIcon: { display: "none" } };
const styles = mergeStyleSets({
  button: {
    cursor: "pointer",
  },
});
