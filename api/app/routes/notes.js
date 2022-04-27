let express = require('express');
let router = express.Router();
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');
const { findOneAndDelete, findById } = require('../models/note');
const note = require('../models/note');

router.post('/', withAuth, async (req, res) => {
    const {title, body} = req.body;

    try{
        let note = new Note({title: title, body: body, author: req.user._id});
        await note.save();
        res.json(note);
    }catch(error){
        res.status(500).json({error: "problem to create a new note"});
    }
});

router.get('/search', withAuth, async(req, res) => {
    const { query } = req.query;
    try {
        let notes = await Note
            .find({author: req.user._id})
            .find( {$text: {$search: query}});
        res.json(notes)
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.get('/:id', withAuth, async(req, res) => {
    try {
        const {id} = req.params;
        let note = await Note.findById(id);
        if(isOwner(req.user, note)){
            res.json(note);
        }else {
            res.status(403).json({error: "Permission denied"});
        }
    } catch (error) {
        res.status(500).json({error: "problem to get a note"});
    }
});

router.get('/', withAuth, async(req, res) => {
    try {
        let notes = await Note.find({autor: req.user._id});
        res.json(notes)
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.put('/:id', withAuth, async (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;   

    try {
        let updatedParams = {
            title: title,
            body: body
        };

        let note = await Note.findById(id);
        if(isOwner(req.user, note)){
            let note = await Note.findOneAndUpdate(id, updatedParams, {new: true});
            res.json(note);
        }else{
            res.status(403).json({error: "permission denied"});
        }
    } catch (error) {
        res.status(500).json({error: "problem to update a note"});
    }
});


router.delete('/:id', withAuth, async(req, res) => {
    const {id} = req.params;
    try {
        let note = await Note.findById(id);
        if(isOwner(req.user, note)){
            await note.delete();
            res.json({message: "deleted"}).status(204);
        }else{
            res.status(403).json({error: "permission denied"});
        };

    } catch (error) {
        res.status(500).json({error: "problem to delete a note"});
    }
});

const isOwner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id)){
        return true;
    }else{
        return false;
    }
}

module.exports = router;