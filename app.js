#! /usr/bin/env -S node -r esm

const PACKAGES = 'base, autoload, require, ams, newcommand';
const action = require('./action.js');
const express = require('express');
const PORT = process.env.PORT || 3000;
const fs = require('fs')
const formidable = require('formidable');
const { execSync } = require("child_process");

// config conversion tools 
const pandocOptions = ' --mathml -o ';
const princeOptions = ' --pdf-profile=\"PDF/UA-1\" -o ';

// config random filename generator
const FILENAME_LENGTH = 21;
function randomString(length = FILENAME_LENGTH) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

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
    const form = formidable();
    var filename = randomString();

    form.parse(req, (err) => {
    if (err) {
        next(err);
        return;
    }
    });

    // saving the file
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/temp/' + filename + '.tex';
    });

    // upload finishes
    form.on('end', () => {
        try {
            const LaTexPath = ' ./temp/' + filename + '.tex ';
            const HTMLPath = ' ./temp/' + filename + '.html ';
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

            const HTMLGlobalPath = __dirname + '/temp/' + filename + '.html';
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
            const PDFPath = __dirname + '/temp/' + filename + '.pdf';
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

            res.download(PDFPath, 'result.pdf');

            // cleanup
            res.on('finish', function() {  
                removeFile(filename + '.tex');
                removeFile(filename + '.html');
                removeFile(filename + '.pdf');
            });
        } catch (err) {
            res.sendFile(__dirname + '/public/bad.html');
            res.on('finish', function() {  
                removeFile(filename + '.tex');
                removeFile(filename + '.html');
                removeFile(filename + '.pdf');
            });
        }
        
    });
});

function removeFile(path) {
    path = './temp/' + path;
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});