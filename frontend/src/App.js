import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withFirebase } from './components/contexts/firebase';
import { AuthUserContext } from './components/contexts/session';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/navigation/NavBar';
import LandingPage from './components/LandingPage';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import MyTeams from './components/MyTeams';
import MyInvitations from './components/MyInvitations';
import TeamDashboard from './components/TeamDashboard';
import './App.css';

import { connect } from 'react-redux';
import { setUserInfo } from './Redux/reducers/user.js';

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      authUser: null,
      idToken: null,
      loading: true
    };
  };

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.auth.currentUser.getIdToken()
          .then(idToken => {
            axios.defaults.headers.common['Authorization'] = idToken;
            this.props.setUserInfo(idToken);    // * call setUserInfo from Redux user reducer
            this.setState({
              authenticated: true,
              authUser,
              loading: false
            });
          })
          .catch(error => {
            console.log(error.message);;
          })
      } else {
        this.setState({
          authenticated: false,
          authUser: null,
          loading: false
        });
      }
    });
  };

  componentWillUnmount() {
    this.listener();
  };

  render() {

    return (
      <AuthUserContext.Provider value={this.state.authUser}>
      <div className='App'>
        <Router>
          <NavBar />
          <Switch>
            <Route path='/' exact component={LandingPage} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/signin' component={SignIn} />
            <PrivateRoute path='/myteams' component={MyTeams} authenticated={this.state.authenticated} />
            <PrivateRoute path='/myinvitations' component={MyInvitations} authenticated={this.state.authenticated} />
            <PrivateRoute path='/TeamDashboard/:teamId' component={TeamDashboard} authenticated={this.state.authenticated} />
          </Switch>
        </Router>
      </div>
      </AuthUserContext.Provider>
    );
  };
};

const App = withFirebase(AppComponent);

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { setUserInfo }
)(App);
