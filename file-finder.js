#!/usr/local/bin/node
let fs = require('fs-extra');
let stdin = process.openStdin();
let colors = require('colors/safe');
let path = require('path');
let program = require('commander');

let cwd = process.cwd();

//process.argv[2] and above will contain strings to search for
let matches = [];

function list(val) {
	return val.split(',');
  }

program
	.version('0.0.1')
	.option('-s, --strings <items>', 'Match filenames in the current directory from a list of comma separated strings', list)
	.option('-d, --dir <dir>', 'Match filenames in the current directory from the contents of another directory')
	.option('-D, --destination <dir>', 'Destination folder')
	.parse(process.argv);

let needles = []; //this array will hold the list of strings we will be searching for

if(program.strings) {
	needles = program.strings;
} else if (program.dir) {
	let sourcePath = program.dir;
	needles = fs.readdirSync(sourcePath);
}

console.log('needles', needles);
console.log('program.destination', program.destination);

let destinationPath = program.destination || './found/';

//read the current directory
fs.readdir(cwd, function(err, files) {
    for (let i=0; i<files.length; i++) {
        for (let j = 0; j < needles.length; j++) {
        	//search for needles
        	if(files[i].indexOf(needles[j]) > 0) {
        		//match
        		console.log('Match found:', files[i], needles[j]);
        		matches.push(files[i]);
        	}
        }   
    }

	console.log(colors.green(matches.length + ' matches found for ' + needles.length + ' search terms.')); 
	
	if(needles.length > 0) {
		console.log(colors.green('Would you like to copy files to ' + destinationPath + ' (y/n)')); 
		process.stdout.write(colors.green('> '));
	} else {
		process.exit();
	}
    
});

if(needles.length > 0) {
	stdin.addListener('data', function(d) {
		// note:  d is an object, and when converted to a string it will
		// end with a linefeed.  so we (rather crudely) account for that  
		// with toString() and then trim() 
		//console.log(colors.green('you entered: [' + d.toString().trim() + ']')); 
		let input = d.toString().trim();

		if (input === 'y') {
			//copy files
			
			let destination = path.resolve(cwd,destinationPath);
			console.log('Copying files to ', destination);

			//create the found folder if it doesn't exist
			if (!fs.existsSync(destination)) {
				console.log('Destination folder created.');
				fs.mkdirSync(destination);
			}

			for (let i = 0; i < matches.length; i++) {
				console.log(path.resolve(cwd,'./' + matches[i]) + ' --> ' + destination + '/' + matches[i]);
				fs.copySync(path.resolve(cwd,'./' + matches[i]), destination + '/' + matches[i]);
			}

			process.exit();
		}
		else {
			process.exit();
		}
	});
}