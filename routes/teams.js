const express = require('express');
const router = express.Router();
// Import MongoDB models:
const User = require('../schemas/User');
const Team = require('../schemas/Team');

// Create a new team:
router.post('/newteam', async (req, res) => {
    try {
        const { uid, teamName } = req.body;

        const user = await User.findOne({ uid });

        const newTeam = new Team({
            name: teamName
        });

        // Push user._id into newTeam users and adminUsers array fields:
        newTeam.users.push(user._id);
        newTeam.adminUsers.push(user._id);
        // save new team in db:
        const team = await newTeam.save();

        console.log('team response from MongoDB:', team);
        res.status(200).json({ team });
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Get all teams where user is a member:
router.get('/', async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findOne({ uid });
        // console.log('user:', user);
        const teams = await Team.find({ users: user._id });
        // console.log('teams:', teams);
        res.status(200).json(teams);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Get all teams to which a user is invited:
router.get('/invitations', async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findOne({ uid });
        // console.log('user:', user);
        const teams = await Team.find({ invitedUsers: user.email });
        // console.log('teams:', teams);
        res.status(200).json(teams);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Get a single team:
router.get('/singleteam/:teamId', async (req, res) => {
    try {
        const { uid } = req.body;
        const { teamId } = req.params;

        const user = await User.findOne({ uid });
        const team = await Team.findOne({ _id: teamId })
            .populate('users');

        console.log('team:', team);
        res.status(200).json(team);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Invite a user to join a team by adding email to invitedUsers array field:
router.post('/invite', async (req, res) => {
    try {
        const { teamId, email } = req.body;
        const updatedTeam = await Team.findOneAndUpdate({ _id: teamId }, { $push: { invitedUsers: email }}, { useFindAndModify: false });
        res.status(200).json(updatedTeam);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Join a team if user email is in team invitedUser.
// Remove email from team invitedUsers and add user._id to team users:
router.post('/join', async (req, res) => {
    try {
        const { uid, teamId } = req.body;
        // Retrieve the User:
        const user = await User.findOne({ uid });
        // Remove user's email from invitedUsers array:
        await Team.findOneAndUpdate({ _id: teamId }, { $pull: { invitedUsers: user.email }}, { useFindAndModify: false });
        // Add user's _id to users array:
        const updatedTeam = await Team.findOneAndUpdate({ _id: teamId }, { $push: { users: user._id }}, { useFindAndModify: false });
        res.status(200).json(updatedTeam);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Leave a team by removing user._id from team users field.
// If user is an admin on the team, they cannot leave the team:
router.post('/leave', async (req, res) => {
    try {
        const { uid, teamId } = req.body;
        // Retrieve the User:
        const user = await User.findOne({ uid });
        // Retrieve the Team and check if user is admin:
        const team = await Team.findOne({ _id: teamId});
        if (team.adminUsers.includes(user._id)) {
            res.status(401).json({ message: 'Cannot remove admin user from the team.'})
        }
        // Remove user._id from users array:
        await Team.findOneAndUpdate({ _id: teamId }, { $pull: { users: user._id }}, { useFindAndModify: false });
        // Respond with the updated Team
        res.status(200).json({ message: 'User left the team.'});
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Endpoint for admin user to remove another user from a team:
router.post('/removeuser', async (req, res) => {
    try {
        const { uid, nonAdminUserId, teamId } = req.body;
        // Retrieve the Admin User:
        const adminUser = await User.findOne({ uid });
        // Retrieve the Team and check if user is admin:
        const team = await Team.findOne({ _id: teamId});
        if (!team.adminUsers.includes(adminUser._id)) {
            res.status(401).json({ message: 'Only admin can remove another user'})
        }
        // Remove nonAdminUserId._id from users array:
        await Team.findOneAndUpdate({ _id: teamId }, { $pull: { users: nonAdminUserId }}, { useFindAndModify: false });
        // Respond with successful message:
        res.status(200).json({ message: 'User was removed from team.'});
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Delete a team. Only Admin user on team can delete the team:
router.post('/deleteteam', async (req, res) => {
    try {
        const { uid, teamId } = req.body;
        // Retrieve the User:
        const user = await User.findOne({ uid });
        // Retrieve the Team and check if user is admin:
        const team = await Team.findOne({ _id: teamId});
        if (!team.adminUsers.includes(user._id)) {
            res.status(401).json({ message: 'Admin access required to delete team.'})
        }
        // Remove user._id from users array:
        await Team.deleteOne({ _id: teamId });
        // Respond with the updated Team
        res.status(200).json({ message: 'Team was deleted.'});
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;