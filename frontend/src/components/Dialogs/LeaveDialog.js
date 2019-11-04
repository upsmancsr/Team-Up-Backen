import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import axios from 'axios';

function LeaveDialog(props) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = event => {
        const leaveData = {
            teamId: props.teamId,
            userId: props.user.id
        }
        axios.post('api/teams/leave', leaveData)
            .then(response => {
                props.history.push('/myteams');
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
        event.preventDefault();
    };
    
    return (
        <div>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Leave team
          </Button>
          
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            
              <div>
                <DialogTitle id="form-dialog-title">Leave team</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to leave this team?
                  </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
              </div>
            
          </Dialog>
          {error && <p>Error leaving team</p>}
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    null
)(LeaveDialog);