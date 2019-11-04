import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';

class NewTeamDialog extends Component {
  state = {
    open: false,
    teamName: '',
    error: null
  };

  handleClickOpen = () => {
    this.setState({ 
        open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleConfirm = event => {
    const { teamName } = this.state;
    const teamData = {
        teamName
    }

    axios.post('api/teams/newteam', teamData)
        .then(response => {
            this.setState({
                teamName: '',
                open: false
            })
        })
        .catch(error => {
            console.log(error);
            this.setState({ error: error });
        });
    event.preventDefault();
  };

  render() {
    
    return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Create a team
          </Button>
          
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          > 
              <div>
                <DialogTitle id="form-dialog-title">Invite members</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Enter a team name
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="teamName"
                    name="teamName"
                    label="Team Name"
                    type="text"
                    required={true}
                    value={this.state.teamName}
                    onChange={this.onChange}
                    fullWidth
                  />
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
              </div>
            
          </Dialog>
          {this.state.error && <p>Error creating team</p>}
        </div>
    );
  }
}

export default NewTeamDialog;