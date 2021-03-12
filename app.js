#! /usr/bin/env -S node -r esm

const PACKAGES = 'base, autoload, require, ams, newcommand';
const action = require('./action.js');

const express = require('express');
const fs = require('fs')
const formidable = require('formidable');
const { execSync } = require("child_process");

const pandocOptions = ' --mathml -o ';
const princeOptions = ' --pdf-profile=\"PDF/UA-1\" -o ';
const LaTexPath = ' ./temp/result.tex ';
const HTMLPath = ' ./temp/result.html ';
const HTMLGlobalPath = __dirname + '/temp/result.html';
const PDFPath = ' ./temp/result.pdf ';
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

        data = fs.readFileSync(HTMLGlobalPath, 'utf8');

        idx = data.indexOf('<math');

        alttext = "Alternative Text Goes Here"

        while (idx > 0) {
            math_end = data.indexOf('>', idx);
            ml_start = data.indexOf('>', data.indexOf(SemTag,math_end))+1;
            ml_end = data.indexOf(AnnTag,ml_start);
            ml_struct = data.slice(ml_start, ml_end);

            alttext = sre.toSpeech(ml_struct);

            data = data.slice(0,math_end) + " " + AltTextAttr + "\"" + alttext + "\""
                 + data.slice(math_end)
            idx = data.indexOf('<math', idx+1);
        }

        formatted = '<!DOCTYPE html><html lang=\'en\'><head><title>Converted-PDF</title></head><body>\n' 
                  + data + '</body></html>';

        fs.writeFileSync(HTMLGlobalPath, formatted, 'utf8', function (err) {
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

        res.sendFile(__dirname + '/index.html');

    });
  
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});