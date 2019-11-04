import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from '../scss/components/TeamNotes.module.scss';

function TeamNotes(props) {
    const [notes, setNotes] = useState([]);
    const [titleInput, setTitleInput] = useState('');
    const [contentInput, setContentInput] = useState('');

    useEffect(() => {
        axios.get(`api/notes/${props.teamId}`)
            .then(response => {
                console.log(response.data);
                setNotes(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [props.teamId]);

    const setInput = set => event => {
        set(event.target.value);
    };

    const handleSubmit = event => {
        const noteData = {
            title: titleInput,
            content: contentInput,
            authorId: props.user.id,
            teamId: props.teamId
        }

        axios.post('api/notes/newnote', noteData)
            .then(response => {
                setTitleInput('');
                setContentInput('');
                setNotes(response.data.notes);
            })
            .catch(error => {
                console.log(error);
            });

        event.preventDefault();
    };

    return (
        <div className={styles.TeamNotes}>
            <p>Notes:</p>

            {notes.length ? (
                notes.map((note, index) => {
                    return (
                        <div className={styles.noteContainer} key={index}>
                            <p>{note.author.firstName} {note.author.lastName}</p>
                            <p>{note.title}</p>
                            <p>{note.content}</p>
                        </div>
                    )
                })
            ) : (
                <p>No notes</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <p>Post a new note:</p>
                    <label htmlFor="titleInput">Title</label>
                    <input
                        onChange={setInput(setTitleInput)}
                        value={titleInput}
                        // error={errors.contentInput}
                        id="titleInput"
                        type="text"
                    />
                </div>
                <div>
                    <label htmlFor="contentInput">Content</label>
                    <input
                        onChange={setInput(setContentInput)}
                        value={contentInput}
                        // error={errors.contentInput}
                        id="contentInput"
                        type="text"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                        Submit
                    </button>
                </div>
            </form>

        </div>
    );
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    null
)(TeamNotes);