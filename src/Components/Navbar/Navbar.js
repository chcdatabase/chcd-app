import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { DropdownButton, Dropdown } from 'react-bootstrap';

import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"


function Navbar(props) {
    const [click, setClick] = useState(false);

    const handleClick = () => {setClick(!click);};

    const closeMobileMenu = () => {setClick(false)};

    return (
        <>
                <div className='nav_bar container-fluid row'>
                    <div className='nav_container_logo container col'>
                        <Link onClick={closeMobileMenu} to='/' className='nav-logo' />
                    </div>
                    <div className='container col-lg-auto'>
                        <div onClick={handleClick} className='menu-icon'>
                            {click ? <FaTimes /> : <FaBars />}
                        </div>
                        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/", langGive: props.language }}>{translate[0].home[props.language]}</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/search", langGive: props.language }}>{translate[0].explore[props.language]}</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/map", langGive: props.language }}>{translate[0].map[props.language]}</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/network", langGive: props.language }}>{translate[0].network[props.language]}</Link>
                            </li>
                            {/* <li className='nav-item'> */}
                            {/*     <Link onClick={closeMobileMenu} className='nav_bar_link' to={{pathname:"/data", langGive: props.language }}>{translate[0].data[props.language]}</Link> */}
                            {/* </li> */}
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
                        </ul>
                    </div>
                </div>
        </>
    )
}

export default Navbar
