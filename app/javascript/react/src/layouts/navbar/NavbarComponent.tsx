import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../services/users';
import './style.css';
import SportexLogo from '../../img/SportexLogo.svg'
import { useMetamask } from '../../useContext/MetamaskContext';
import { useLoadingContext } from '../../useContext/LoaderContext';

function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const {isAllowed} = useMetamask()
  const toggleNav = () => {
    setIsOpen(!isOpen);
  }
  const {transactionIsLoading,setTransactionIsLoading} = useLoadingContext()

  return (
    <nav className="navbar">

      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <SportexLogo/>
        </Link>
        <div className={`navbar__menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar__list">
            <li className="navbar__item">
              <Link to="/myassets" className="navbar__link">My assets</Link>
            </li>
            { isAllowed ?  <li className="navbar__item">
              <Link to="/createitem" className="navbar__link">Create item</Link>
            </li> :''


            }
            <li className="navbar__item">
              <Link to="/profile" className="navbar__link">Profile</Link>
            </li>
            <li className="navbar__item">
              <Link to='/' onClick={logout} className="navbar__link">Logout</Link>
            </li>
            <button className='Button_play_sportex_navbar'>Play in Sportex</button>
          </ul>
        </div>
        <div className={`navbar__toggle ${isOpen ? 'active' : ''}`} onClick={toggleNav}>

        </div>
      </div>
    </nav>
  )
}

export default NavbarComponent;
