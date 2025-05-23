import { headerStyle } from "./styles";
import { gridContentStyle, offGridContentStyle } from "styles";
import { HeaderBar } from "./Header.Bar";
import { HeaderOverflow } from "./Header.Overflow";
import { PlanetaryComputerProAnnouncement } from "./components/PlanetaryComputerProAnnouncement";

const Header = ({ onGrid = true }) => {
  const navClass = onGrid ? gridContentStyle : offGridContentStyle;

  return (
    <header className={headerStyle}>
      <nav className={navClass} aria-label="Main header navigation links">
        <HeaderBar />
        <HeaderOverflow />
      </nav>
      <PlanetaryComputerProAnnouncement />
    </header>
  );
};

export default Header;
