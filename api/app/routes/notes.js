let express = require('express');
let router = express.Router();
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');

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

module.exports = router;