const noteModel = require('../models/NotesModel.js'); 
const express = require('express');
const app = express();

//TODO - Create a new Note
app.post('/notes', (req, res) => {
    const { noteTitle, noteDescription, priority, dateAdded, dateUpdated } = req.body;
    if (!noteTitle || !noteDescription) {
        return res.status(400).send({
            message: "Note title and description cannot be empty"
        });
    }

    const note = new noteModel({
        noteTitle: noteTitle,
        noteDescription: noteDescription,
        priority: priority,
        dateAdded: new Date(),
        dateUpdated: new Date() 
    });

    note.save((err, note) => {
        if (err) {
            res.status(500).send({
                message: "Error creating note"
            });
        } else {
            res.send(note);
        }
    });
});

//TODO - Retrieve all Notes
app.get('/notes', (req, res) => {
    noteModel.find((err, notes) => {
        if (err) {
            res.status(500).send({
                message: "Error retrieving notes"
            });
        } else {
            res.send(notes);
        }
    });
});

//TODO - Retrieve a single Note with noteId
app.get('/notes/:noteId', (req, res) => {
    const noteID = req.params.noteId;
    noteModel.findById(noteID, (err, note) => {
        if(err) {
            return res.status(404).send({
                message: "Note not found with id " + noteID
            });
        }
        res.json(note);
    });
});

//TODO - Update a Note with noteId
app.put('/notes/:noteId', (req, res) => {
    const { noteTitle, noteDescription, priority } = req.body;
    if (!noteTitle || !noteDescription) {
        return res.status(400).send({
            message: "Note title and description cannot be empty"
        });
    }
    const noteID = req.params.noteId;
    noteModel.findByIdAndUpdate(noteID, {
        noteTitle: noteTitle,
        noteDescription: noteDescription,
        priority: priority,
        dateUpdated: new Date() 
    }, { new: true }, (err, note) => {
        if (err) {
            return res.status(404).send({
                message: "Note not found with id " + noteID
            });
        }
        res.json(note);
    });
});

//TODO - Delete a Note with noteId
app.delete('/notes/:noteId', (req, res) => {
    const noteID = req.params.noteId; 
    noteModel.findByIdAndRemove(noteID, (err, note) => {
        if(err) {
            return res.status(404).send({
                message: "Note not found with id " + noteID
            });
        }
        res.json({message: 'Note deleted successfully!'});
    });
});
module.exports = app;