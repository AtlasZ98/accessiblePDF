const express = require('express');
const formidable = require('formidable');

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/upload', (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
    if (err) {
        next(err);
        return;
    }
    });

    // saving the file
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/temp/' + file.name;
    });

    // upload finishes
    form.on('end', () => {
        res.sendFile(__dirname + '/index.html');
    });
  
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});