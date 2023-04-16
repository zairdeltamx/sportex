import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../services/users';
import './style.css';
import SportexLogo from '../../img/SportexLogo.svg'
import { useMetamask } from '../../useContext/MetamaskContext';

function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const {isAllowed} = useMetamask()
  const toggleNav = () => {
    setIsOpen(!isOpen);
  }

  const onNavClick = () => {
    document.documentElement.scrollTop = 0;
    setIsOpen(!isOpen);
  }

  return (
    <nav className="navbar">

      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <SportexLogo/>
        </Link>
        <div className={`navbar__menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar__list">
            <li className="navbar__item">
              <Link to="/" className="navbar__link" onClick={onNavClick}>Marketplace</Link>
            </li>
            <li className="navbar__item">
              <Link to="/myassets" className="navbar__link" onClick={onNavClick}>My assets</Link>
            </li>
            { isAllowed ?  <li className="navbar__item">
              <Link to="/createitem" className="navbar__link" onClick={onNavClick}>Create item</Link>
            </li> :''
            }
            <li className="navbar__item">
              <Link to="/profile" className="navbar__link" onClick={onNavClick}>Profile</Link>
            </li>
            <li className="navbar__item">
              <Link to='/' onClick={logout} className="navbar__link">Logout</Link>
            </li>
          </ul>
        </div>
        <div className={`navbar__toggle ${isOpen ? 'active' : ''}`} onClick={toggleNav}>

        </div>
      </div>
    </nav>
  )
}

export default NavbarComponent;
