import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { signUpUser } from '../../authUtilities';
import { withFirebase } from '../contexts/firebase';
import axios from 'axios';

import './css/auth.css';

class SignUpComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        };
    }

    onChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    onSubmit = event => {
        const {
            email, 
            password, 
            password2, 
            firstName, 
            lastName, 
        } = this.state;

        this.props.firebase.createUser(email, password)
            .then(authUser => {
                console.log('authUser on sign up: ', authUser);
        
                this.props.firebase.auth.currentUser.getIdToken()
                    .then(idToken => {
                        axios.defaults.headers.common['Authorization'] = idToken;

                        const signUpData = { email, firstName, lastName };

                        axios.post('/api/users/signup', signUpData)
                            .then(signUpResponse => {
                                console.log('response from POST to /register', signUpResponse);
                                this.props.history.push({         
                                    pathname: "/myteams"
                                });
                            })
                            .catch(error => {
                                console.log(error.message);
                            })
                    })  
                    .catch(error => {                 // if Firebase getIdToken throws an error
                        this.setState({ 
                            error: error 
                        });
                    })
            })
            .catch(error => {                    // if Firebase createUser throws an error
                this.setState({ 
                    error: error 
                });
            });
        event.preventDefault();
    };
      
    render() {
        const { errors } = this.state;
        return (
            <div className='container'>
                <div className='row'>
                    <div>
                        <div>
                            <h4>
                                <b>Sign up</b> below
                            </h4>
                            <p>
                                Already have an account? <Link to='/signin'>Sign in</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.firstName}
                                    error={errors.firstName}
                                    id='firstName'
                                    type='text'
                                />
                                <label htmlFor='firstName'>First Name</label>
                            </div>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.lastName}
                                    error={errors.lastName}
                                    id='lastName'
                                    type='text'
                                />
                                <label htmlFor='lastName'>Last Name</label>
                            </div>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id='email'
                                    type='email'
                                />
                                <label htmlFor='email'>Email</label>
                            </div>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id='password'
                                    type='password'
                                />
                                <label htmlFor='password'>Password</label>
                            </div>
                            <div>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    id='password2'
                                    type='password'
                                />
                                <label htmlFor='password2'>Confirm Password</label>
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    className='btn btn-large waves-effect waves-light hoverable blue accent-3'
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );
  }
}

const SignUp = withFirebase(SignUpComponent);
export default SignUp;

{/* <a href="/auth/google" className="button">
          <div>
            <span className="svgIcon t-popup-svg">
              <svg
                className="svgIcon-use"
                width="25"
                height="37"
                viewBox="0 0 25 25"
              >
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z"
                    fill="#34A853"
                  />
                  <path
                    d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
       </span>
     <span className="button-label">Sign in with Google</span>
   </div>
</a> */}