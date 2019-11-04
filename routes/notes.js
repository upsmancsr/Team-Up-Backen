const express = require('express');
const router = express.Router();
// Import MongoDB models:
const User = require('../schemas/User');
const Team = require('../schemas/Team');
const Note = require('../schemas/Note');

// Geat all notes for a team:
router.get('/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const notes = await Note.find({ team: teamId }).populate('author');
        // console.log('user:', user);
        // console.log('teams:', teams);
        res.status(200).json(notes);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Create a new note:
router.post('/newnote', async (req, res) => {
    try {
        const { authorId: author, teamId: team, title, content } = req.body;

        const newNote = new Note({
            title,
            content,
            author,
            team
        });

        // save new note in db:
        const note = await newNote.save();

        // Get all notes for the team (to include new note):
        const notes = await Note.find({ team }).populate('author');

        res.status(200).json({ message: 'Note saved in database.', notes });
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;