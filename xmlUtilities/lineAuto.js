const fs = require('fs');

//const Promise = require('bluebird'); //run synch for the moment

//parsing from buffer
const buffString = file => file.toString('utf8');

// const readD = Promise.promisify(fs.readdir);
// const readF = Promise.promisify(fs.readFile);

//------------reading in directory and files-----------------
const source ='xmlUtilities/origSources/TakamiyaMS.xml';

const sourceFile = fs.readFileSync(source, 'utf8');
const sourceArr = sourceFile.split('\n'); //each item is a line...

const revArr = []; //push elements in as you go...
var i = 0;
var iS = 0;
var series = '';

const regDiv = /(<div1)/g ;
const regLine = /(<l>)/g ;
const regSeries = /(\sn="\w*"\s|\sn="\w*\.\w*"\s)/g;
const regXml = /(\sxml:id="\w*\.\w*"\s)/g;


/* iterate thru and identify presence of:
	a) opening divl tags... index location and n section #
	b) opening l tags without xml:id info... index location and count since last divl

	easiest done as simple while... if a or if b... grab or insert info
*/

while (i<sourceArr.length){
	var currLine = sourceArr[i];

	if (currLine.search(regDiv)>-1){ //div to grab series
			var m = currLine.match(regSeries)[0].trim().replace('"', '').replace('n=','').replace('"', '').replace('.','');
			series = m;
			iS = 0;
			console.log('div ', currLine.search(regDiv), m, i);

			revArr.push(currLine);

	} else if (currLine.search(regLine)>-1){
			iS++ ;
			var loc = currLine.replace(regLine, `<l xml:id="${series}.${iS}" n="">`);
			console.log('line ', loc);

			revArr.push(loc);

	} else { //already marked or other things

		revArr.push(currLine);
	}

	i++;
}

const editFile = revArr.join('\n');

fs.writeFileSync('xmlUtilities/origSources/TakamiyaMS-ed.xml', editFile, 'utf8');
console.log('done');
