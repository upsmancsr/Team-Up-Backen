import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import SignOut from '../auth/SignOut';
import styles from '../../scss/components/AccountNavMenu.module.scss';

const AccountNavMenu = props => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleOpen = () => {
        setOpen(!open);
    };

    function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
    }
    
    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return (
        <div className={styles.AccountNavMenu}>
            <button className={styles.menuBtn}
                onClick={handleToggleOpen}
            >
                Account
            </button>
            {open && 
                <div className={styles.dropdownContainer} ref={dropdownRef}>
                    <div className={styles.topRow}>
                        <div className={styles.row}>
                            <p className={styles.mainText}>Signed in as</p>
                            <p className={styles.subText}>{props.user.firstName} {props.user.lastName}</p>
                            <p className={styles.subText}>{props.user.email}</p>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <NavLink 
                            to='/myteams'
                            className={styles.mainText}
                            activeStyle={{ color: 'blue' }}
                            exact
                            onClick={handleToggleOpen}
                        >
                            Your teams
                        </NavLink>
                    </div>

                    <div className={styles.row}>
                        <SignOut />
                    </div>
                    
                </div>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    null
)(AccountNavMenu);