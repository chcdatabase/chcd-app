/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { DropdownButton, Dropdown } from 'react-bootstrap';
import translate from "../../Assets/indexes/translate.json";
import nationality from "../../Assets/indexes/nationality.json";
import family_trans from "../../Assets/indexes/religious_family.json";
import cat_trans from "../../Assets/indexes/categories.json";
import logo_en from "../../Assets/logos/logo_en.png";
import logo_en_white from "../../Assets/logos/logo_en_white.png";
import logo_zh from "../../Assets/logos/logo_zh.png";
import logo_zh_white from "../../Assets/logos/logo_zh_white.png";
import logo_tw from "../../Assets/logos/logo_tw.png";
import logo_tw_white from "../../Assets/logos/logo_tw_white.png";

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function Navbar(props) {

// RESPONSIVE, DROPDOWN CLICK HANDLER ///////////////////////////////////////////////////////////////
    const [click, setClick] = useState(false);
    const handleClick = () => {setClick(!click);};
    const closeMobileMenu = () => {setClick(false)};

// RESPONSIVE STYLING ///////////////////////////////////////////////////////////////////////////////
    let navSet;
      if (props.home === "home") { navSet = "nav_bar_trans container-fluid row" }
      else { navSet = "nav_bar container-fluid row" }

    let logoSet;
      if (props.home === "home") {
        if (props.language === "en") { logoSet = logo_en_white }
        else if (props.language === "zh") { logoSet = logo_zh_white }
        else if (props.language === "tw") { logoSet = logo_tw_white }
      }
      else {
        if (props.language === "en") { logoSet = logo_en }
        else if (props.language === "zh") { logoSet = logo_zh }
        else if (props.language === "tw") { logoSet = logo_tw }
      }

    const logoStyle = {
      backgroundImage: `url("${logoSet}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      justifySelf: 'start',
      cursor: 'pointer',
      height: '60px',
      width: '200px',
      opacity: '1',
      display: 'flex',
      alignItems: 'center'
    }

// RETURN ///////////////////////////////////////////////////////////////////////////////
    return (
      <nav role="navigation">
        <a className="aria-only" href="#main">Skip to main content</a>
        <div className={navSet} >
            <div className='nav_container_logo container col'>
                <Link onClick={closeMobileMenu} to={{pathname:"/", langGive: props.language }} title={translate[0].home[props.language]} style={logoStyle}  />
            </div>
            <div className='container col-lg-auto'>
                <div onClick={handleClick} className='menu-icon'>
                    {click ? <FaTimes /> : <FaBars />}
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/", langGive: props.language }} >{translate[0].home[props.language]}</Link>
                    </li>
                    <li className='nav-item'>
                        <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/search", langGive: props.language }} >{translate[0].explore[props.language]}</Link>
                    </li>
                    <li className='nav-item'>
                        <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/map", langGive: props.language }} >{translate[0].map[props.language]}</Link>
                    </li>
                    <li className='nav-item'>
                        <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/network", langGive: props.language }} >{translate[0].network[props.language]}</Link>
                    </li>
                    <li className='nav-item'>
                        <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/data", langGive: props.language }} >{translate[0].data[props.language]}</Link>
                    </li>
                    <li>
                      <DropdownButton
                        align="end"
                        variant="secondary"
                        className="lang-switch-button"
                        title={translate[0].language[props.language]}
                      >
                        <Dropdown.Item href="#" value="en" onClick={e => props.langSwitch(e)}>EN</Dropdown.Item>
                        <Dropdown.Item href="#" value="zh" onClick={e => props.langSwitch(e)}>简体</Dropdown.Item>
                        <Dropdown.Item href="#" value="tw" onClick={e => props.langSwitch(e)}>繁體</Dropdown.Item>
                      </DropdownButton>
                    </li>
                </ul>
            </div>
        </div>
      </nav>
    )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default Navbar
