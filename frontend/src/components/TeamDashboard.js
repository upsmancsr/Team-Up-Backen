import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import InviteDialog from './Dialogs/InviteDialog';
import LeaveDialog from './Dialogs/LeaveDialog';
import DeleteTeamDialog from './Dialogs/DeleteTeamDialog';
import RemoveUserDialog from './Dialogs/RemoveUserDialog';
import TeamNotes from './TeamNotes';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from '../scss/components/TeamDashboard.module.scss';

class TeamDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        team: null,
        error: null
    };
  } 

  componentDidMount() {
    const { teamId } = this.props.match.params;
    axios.get(`/api/teams/singleteam/${teamId}`)
      .then(response => {
        this.setState({ team: response.data });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error: error });
      })
  }

  render() {
    const { team } = this.state;
    return (
        team &&
        <div className={styles.TeamDashboard}>
            <div className={styles.leftContainer}>
                <h3>Team Name: <b>{team.name}</b></h3>
                <div className={styles.teamMembersContainer}>
                    <p>Team members:</p>
                    <div className={styles.teamMembersList}>
                        {team &&
                        team.users.map((user, index) => {
                            return (
                                <div className={styles.row} key={index}>
                                    <p>{user.firstName} {user.lastName}</p>
                                    <p>{user.email}</p>
                                    {(team.adminUsers.includes(this.props.user.id) && !team.adminUsers.includes(user._id)) ? (
                                        <RemoveUserDialog teamId={team._id} nonAdminUserId={user._id} />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )
                        }) 
                        }
                    </div>
                </div>

                <div className={styles.teamActionsContainer}>
                    <div className={styles.actionItem}>
                        <InviteDialog teamId={team._id} />
                    </div>
                    {!team.adminUsers.includes(this.props.user.id) ? (
                        <div className={styles.actionItem}>
                            <LeaveDialog teamId={team._id} history={this.props.history} />
                        </div>
                    ) : (
                        <div className={styles.actionItem}>
                            <DeleteTeamDialog teamId={team._id} history={this.props.history} />
                        </div>
                    )
                    }
                </div>
            </div>
            <div className={styles.rightContainer}>
                    <TeamNotes teamId={team._id} />
            </div>
        </div>
    );
  }
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    null
)(TeamDashboard);
