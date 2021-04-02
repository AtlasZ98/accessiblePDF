#! /usr/bin/env -S node -r esm

const PACKAGES = 'base, autoload, require, ams, newcommand';
const action = require('./action.js');
const express = require('express');
const PORT = process.env.PORT || 3001;
const fs = require('fs')
const formidable = require('formidable');
const { execSync } = require("child_process");

// configg conversion tools
const pandocOptions = ' --mathml -o ';
const princeOptions = ' --pdf-profile=\"PDF/UA-1\" -o ';
const LaTexPath = ' ./temp/result.tex ';
const HTMLPath = ' ./temp/result.html ';
const HTMLGlobalPath = __dirname + '/temp/result.html';
const PDFPath = __dirname + '/temp/result.pdf';

// config MathJax
const AltTextAttr = "alttext="
const SemTag = "<semantics>"
const AnnTag = "<annotation"

action.sreconfig();

MathJax = {
    loader: {
        paths: {mathjax: 'mathjax-full/es5', sre: 'mathjax-full/js/a11y/sre-node'},
        source: (require('mathjax-full/components/src/source.js').source),
        require: require,
        load: ['input/tex-full', 'adaptors/liteDOM']
    },
    tex: {
        packages: PACKAGES.replace('\*', PACKAGES).split(/\s*,\s*/)
    }
}
MathJax.startup

require('mathjax-full/' + ('components/src/startup') + '/startup.js');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', (req, res) =>{
    res.json({message:"Hello from NodeJS Server."});
});

app.post('/api/LaTexUpload', (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err) => {
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

        var data = fs.readFileSync(HTMLGlobalPath, 'utf8');
        // adding MathJax to HTML
        var alttext = "Alternative Text Goes Here"
        var idx = data.indexOf('<math');
        while (idx > 0) {
            var math_end = data.indexOf('>', idx);
            var ml_start = data.indexOf('>', data.indexOf(SemTag,math_end))+1;
            var ml_end = data.indexOf(AnnTag,ml_start);
            var ml_struct = data.slice(ml_start, ml_end);
            alttext = sre.toSpeech(ml_struct);
            data = data.slice(0,math_end) + " " + AltTextAttr + "\"" + alttext + "\""
                 + data.slice(math_end)
            idx = data.indexOf('<math', idx+1);
        }
        var dataWithMath = 
            '<!DOCTYPE html><html lang=\'en\'><head><title>Converted-PDF</title></head><body><h1></h1><h2></h2><h3></h3>\n' 
            + data 
            + '</body></html>';
        // finish adding MathJax to HTML
        fs.writeFileSync(HTMLGlobalPath, dataWithMath, 'utf8', function (err) {
            if (err) return console.log(err);
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

        res.download(PDFPath);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});