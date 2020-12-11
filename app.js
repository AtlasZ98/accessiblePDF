const express = require('express');
const fs = require('fs')
const formidable = require('formidable');
const { execSync } = require("child_process");

const pandocOptions = ' -o ';
const princeOptions = ' --pdf-profile=\"PDF/UA-1\" -o ';
const LaTexPath = ' ./temp/result.tex ';
const HTMLPath = ' ./temp/result.html ';
const HTMLGlobalPath = __dirname + '/temp/result.html';
const PDFPath = ' ./temp/result.pdf ';

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
        file.path = __dirname + '/temp/result.tex';
    });

    // upload finishes
    form.on('end', () => {
        execSync('pandoc' + LaTexPath + pandocOptions + HTMLPath, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        fs.readFileSync(HTMLGlobalPath, 'utf8', (err, data) => {
            formatted = '<!DOCTYPE html><html lang=\'en\'><head><title>Converted-PDF</title></head><body>' 
            + data + '</body></html>';
            fs.writeFileSync(HTMLPath, formatted, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });

        // prince prince1.html --pdf-profile="PDF/UA-1"
        execSync('prince' + HTMLPath + princeOptions + PDFPath, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        res.sendFile(__dirname + '/index.html');

    });
  
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});