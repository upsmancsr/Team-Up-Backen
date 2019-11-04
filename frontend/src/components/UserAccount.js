import React, { Component } from 'react';
import axios from 'axios';

import './css/UserAccount.css';

class UserAccount extends Component {
  constructor() {
    super();
    this.state = {
        users: [],
        error: null
    };
  } 

  componentDidMount() {
    axios.get('/api/users/allusers')
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error: error });
      })
  }

  render() {
    const { users } = this.state;
    console.log(users);
    return (
      <div className='user-account-page'>
        <h1>This is your user account page</h1>

        <div className='users-list-container'>
          <h3>All Users</h3>

          <div className='users-list'>
            {users.length > 0 &&
              users.map((user, index) => {
                return (
                  <div className='row'>
                    <p><b>Name:</b> {user.name}</p>
                    <p><b>Email:</b> {user.email}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
};

export default UserAccount;
