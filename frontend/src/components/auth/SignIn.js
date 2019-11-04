import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from '../contexts/firebase';
import { connect } from 'react-redux';

import axios from 'axios';

class SignInComponent extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    onChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    onSubmit = event => {
        const {email, password } = this.state;
    
        this.props.firebase.logIn(email, password)
            .then(authUser => {
                console.log('authUser: ', authUser);
        
                this.props.firebase.auth.currentUser.getIdToken()
                    .then(idToken => {
                        console.log("idToken from firebase logIn: ", idToken);
                        axios.defaults.headers.common['Authorization'] = idToken;   
                        this.props.history.push('/myteams');
                    })  
                    .catch(error => {                 // if Firebase getIdToken throws an error
                        this.setState({ 
                            error: error 
                        });
                    })
            })
            .catch(error => {                    // if Firebase logIn throws an error
                this.setState({ 
                    error: error 
                });
            });
        event.preventDefault();
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div>
                        
                        <div>
                            <h4>
                                <b>Sign in</b> below
                            </h4>
                            <p>
                                Don't have an account? <Link to="/signup">Sign Up</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const SignIn = withFirebase(SignInComponent);
export default SignIn;