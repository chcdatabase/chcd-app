/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react'
import { FaBars, FaTimes, FaQuoteRight } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { DropdownButton, Dropdown, Button, Card } from 'react-bootstrap';
import translate from "../../Assets/indexes/translate.json";
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
    let linkcolor;
      if (props.home === "home") {
        navSet = "nav_bar_trans container-fluid row";
        linkcolor = "#ffffff";
      }
      else {
        navSet = "nav_bar container-fluid row";
        linkcolor = "#500000";
      }

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
          {/* <div className="bg-white text-black p-2 border border-danger border-1" 
            style={{
              marginLeft:'250px',
              marginRight: '100px', 
              marginTop: '1.5em', 
              display:'block',
              float:'left', 
              position:'absolute',
              zIndex: '9999999999999999999999'
            }}
          >
            This application is under construction. Some features may not be available.
          </div> */}
        <div className={navSet} >
            <div className='nav_container_logo container col'>
                <NavLink onClick={closeMobileMenu} to="/" langgive={props.language} title={translate[0].home[props.language]} style={logoStyle}  />
            </div>
            <div className='container col-lg-auto'>
                <div onClick={handleClick} className='menu-icon'>
                    {click ? <FaTimes /> : <FaBars />}
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <NavLink onClick={closeMobileMenu} className='nav_bar_link' to="/" search="" state={{ langgive: props.language }}>{translate[0].home[props.language]}</NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink onClick={closeMobileMenu} className='nav_bar_link' to="/search" search="" state={{ langgive: props.language }}>{translate[0].explore[props.language]}</NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink onClick={closeMobileMenu} className='nav_bar_link' to="/map" search="" state={{ langgive: props.language }}>{translate[0].map[props.language]}</NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink onClick={closeMobileMenu} className='nav_bar_link' to="/network" search="" state={{ langgive: props.language }}>{translate[0].network[props.language]}</NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink onClick={closeMobileMenu} className='nav_bar_link' to="/data" search="" state={{ langgive: props.language }}>{translate[0].data[props.language]}</NavLink>
                    </li>
                    <li>
                      <DropdownButton
                        align="end"
                        variant="secondary"
                        className="lang-switch-button"
                        title={translate[0].language[props.language]}
                        style={{zIndex: '99999999'}}
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
