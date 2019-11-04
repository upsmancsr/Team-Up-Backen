import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from '../scss/components/MyTeams.module.scss';

class MyInvitations extends Component {
  constructor() {
    super();
    this.state = {
        teams: [],
        error: null
    };
  } 

  componentDidMount() {
    axios.get('/api/teams/invitations')
      .then(response => {
        this.setState({ teams: response.data });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error: error });
      });
  };

  joinTeam = event => {
    const teamId = event.target.id;
    const joinData = { teamId };
    axios.post('api/teams/join', joinData)
        .then(response => {
            this.props.history.push(`/TeamDashboard/${teamId}`);
        })
        .catch(error => {
            console.log(error);
            this.setState({ error: error });
        });
  };

  render() {
    const { teams } = this.state;
    return (
        <div className={styles.MyTeams}>
            <div className={styles.teamsListContainer}>
                <h3>Your team invitations</h3>
                {teams.length && 
                <div className={styles.teamsList}>
                    {teams.length > 0 &&
                        teams.map((team, index) => {
                        return (
                            <div className={styles.row}>
                                <p><b>Team Name:</b> {team.name}</p>
                                <button 
                                    id={team._id}
                                    onClick={this.joinTeam}
                                >
                                    Join
                                </button>
                            </div>
                        )
                        })
                    }
                </div>
                }
            </div>
        </div>
    );
  }
};

export default MyInvitations;
