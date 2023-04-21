import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../services/users";
import "./style.css";
import SportexLogo from "../../img/SportexLogo.svg";
import Menu from "../../img/navbar/menu.svg";
import MenuClose from "../../img/navbar/closeMenu.svg";
import { useMetamask } from "../../useContext/MetamaskContext";

function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAllowed } = useMetamask();
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const onNavClick = () => {
    document.documentElement.scrollTop = 0;
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar_logo">
        <SportexLogo />
      </Link>

      <div className="navbar_shadow">
        <div className={`navbar_menu ${isOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`navbar_link ${
              window.location.pathname === "/" ? "active" : ""
            }`}
            onClick={onNavClick}
          >
            Marketplace
          </Link>

          <Link
            to="/myassets"
            className={`navbar_link ${
              window.location.pathname === "/myassets" ? "active" : ""
            }`}
            onClick={onNavClick}
          >
            My assets
          </Link>
          {isAllowed ? (
            <Link
              to="/createitem"
              className={`navbar_link ${
                window.location.pathname === "/createitem" ? "active" : ""
              }`}
              onClick={onNavClick}
            >
              Create item
            </Link>
          ) : (
            ""
          )}
          <Link
            to="/profile"
            className={`navbar_link ${
              window.location.pathname === "/profile" ? "active" : ""
            }`}
            onClick={onNavClick}
          >
            Profile
          </Link>
          <Link to="/" onClick={logout} className="navbar_link">
            Logout
          </Link>
        </div>
      </div>
      <div
        className={`navbar_toggle ${isOpen ? "active" : ""}`}
        onClick={toggleNav}
      >
        {!isOpen ? <Menu></Menu> : <MenuClose />}
      </div>
    </nav>
  );
}

export default NavbarComponent;
