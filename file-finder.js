#!/usr/local/bin/node
var fs = require('fs-extra');
var stdin = process.openStdin();
var colors = require('colors/safe');
var path = require('path');

var cwd = process.cwd();

//process.argv[2] and above will contain strings to search for
var needles = process.argv.slice(2);
var matches = [];

console.log('needles', needles);

fs.readdir(cwd, function(err, files) {
 
    for (var i=0; i<files.length; i++) {
        
        for (var j = 0; j < needles.length; j++) {
        	//search for needles
        	if(files[i].indexOf(needles[j]) > 0) {
        		//match
        		console.log('Match found:', files[i], needles[j]);
        		matches.push(files[i]);
        	}
        }   
    }

    console.log(colors.green(matches.length + ' matches found for ' + needles.length + ' search terms.')); 
    console.log(colors.green('Would you like to copy files to ./found/? (y/n)')); 
	process.stdout.write(colors.green('> '));
});


stdin.addListener('data', function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    //console.log(colors.green('you entered: [' + d.toString().trim() + ']')); 
    var input = d.toString().trim();

    if (input === 'y') {
    	//copy files
    	
    	var destination = path.resolve(cwd,'./found/');
    	console.log('Copying files to ', destination);

    	//create the found folder if it doesn't exist
    	if (!fs.existsSync(destination)) {
    		console.log('Destination folder created.');
    		fs.mkdirSync(destination);
		}

    	for (var i = 0; i < matches.length; i++) {
 			console.log(path.resolve(cwd,'./' + matches[i]) + ' --> ' + destination + '/' + matches[i]);
    		//fs.copySync(path.resolve(cwd,'./' + matches[i]), destination + '/' + matches[i]);
    	}

    	process.exit();
    }
    else {
		process.exit();
    }
});