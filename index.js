// these are our constants
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3006;
const fs = require('fs');
const db = "./db/db.json";
const uniqid = require('uniqid');
let note = [];

// express will handle all of our data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// setting up the routing
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, db), (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {

    fs.readFile(db, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let note = JSON.parse(data);
            const newNote = req.body;
            newNote.id = uniqid();
            note.push(newNote);
            console.log(note);

            fs.writeFile(db, JSON.stringify(note), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log()
                    res.json(note);
                }
            });
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));