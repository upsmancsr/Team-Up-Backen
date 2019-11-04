import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import axios from 'axios';

function DeleteTeamDialog(props) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = event => {
        const deleteData = {
            teamId: props.teamId,
            userId: props.user.id
        }
        axios.post('api/teams/deleteteam', deleteData)
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
          <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
                Delete team
          </Button>
          
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            
              <div>
                <DialogTitle id="form-dialog-title">Delete team</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this team?
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
          {error && <p>Error deleting team</p>}
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    null
)(DeleteTeamDialog);