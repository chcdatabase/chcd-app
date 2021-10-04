import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Navbar() {

    const [click, setClick] = useState(false)

    const handleClick = () => {
        setClick(!click)
    }

    const closeMobileMenu = () => {
        setClick(false)
    }

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
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to='/'>Home</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to='/search'>Explore</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to='/map'>Map</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to='/network'>Network</Link>
                            </li>
                            <li className='nav-item'>
                                <Link onClick={closeMobileMenu} className='nav_bar_link' to='/data'>Data</Link>
                            </li>
                        </ul>
                    </div>
                </div>
        </>
    )
}

export default Navbar
