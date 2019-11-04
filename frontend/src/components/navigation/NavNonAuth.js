import React from 'react';
import { NavLink } from "react-router-dom";


const styledNavLink = (route, name) => {
    return (
      <NavLink 
        to={route}
        className='navlink'
        activeStyle={{ color: 'blue' }}
        exact
      >
        {name}
      </NavLink>
    )
};

const NavNonAuth = () => (
    <div className='nav-non-auth-container'>
        <span>
            {styledNavLink('/', 'Home', 'exact')}
            {styledNavLink('/useraccount', 'Account')}
            {styledNavLink('/signup', 'Sign Up')}
            {styledNavLink('/signin', 'Sign In')}
        </span>
    </div>
);

export default NavNonAuth;