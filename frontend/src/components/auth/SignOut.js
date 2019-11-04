import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { withFirebase } from '../contexts/firebase';

import styles from '../../scss/components/SignOut.module.scss';

class SignOutBase extends Component {

    logOut = event => {
        this.props.firebase.logOut();
    }

    render() {
        return (
            <Link to="/" className={styles.SignOutLink} onClick={this.logOut}>
                Sign out
            </Link>
        );
    }
}

const SignOut = withRouter(withFirebase(SignOutBase));

export default SignOut;