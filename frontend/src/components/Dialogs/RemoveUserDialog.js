import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import axios from 'axios';

function RemoveUserDialog(props) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = event => {
        const removeData = {
            teamId: props.teamId,
            nonAdminUserId: props.nonAdminUserId
        }
        axios.post('api/teams/removeuser', removeData)
            .then(response => {
                alert('user removed from team');
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
                Remove User
          </Button>
          
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            
              <div>
                <DialogTitle id="form-dialog-title">Remove User</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to remove this user?
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
          {error && <p>Error removing user</p>}
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    null
)(RemoveUserDialog);