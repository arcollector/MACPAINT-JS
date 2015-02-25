var motr2Intel = function( arrayBuffer, index ) {
	var a = new ArrayBuffer(4);
	var b = new Uint8Array(a);
	var c = new Uint32Array(a);
	b[0]=arrayBuffer[index+3];
	b[1]=arrayBuffer[index+2];
	b[2]=arrayBuffer[index+1];
	b[3]=arrayBuffer[index];
	return c[0];
};

var dateMac2PC = function( seconds ) {
	return new Date((seconds-2080252800)*1000);
};

var datePC2Mac = function( milliseconds ) {
	return new Date((milliseconds/1000+2080252800)*1000);
};

var getString = function( arrayBuffer, index, count ) {
	var str = [];
	for( var i = 0; i < count; i++ ) {
		str.push( String.fromCharCode( arrayBuffer[index++] ) );
	}
	return str.join( '' );
};

/////////////////////////////
/////////////////////////////
/////////////////////////////

MAC_HEADER_SIZE = 128;

HEADER_SIZE = 640;
HEADER_SIZE_NONHEADER = 512;
HEADER_FILENAME_LENGTH = 1;
HEADER_FILENAME_START = 2;
HEADER_FILE_TYPE_START = 65;
HEADER_FILE_TYPE_STRING = 'PNTG'
HEADER_CREATOR = 69;
HEADER_DATA_FORK = 83;
HEADER_RESOURCE_FORK = 87;
HEADER_CREATION_DATE = 91;
HEADER_MODIFICATION_DATE = 95;
HEADER_PATTERN_START = 132;
HEADER_PATTERN_COUNT = 38;
HEADER_PATTERN_SIZE = 8;

STRING_MAX_LENGTH = 31;

var headerStruct = new Uint8Array( [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,78,84,71,77,80,78,84,1,0,0,0,0,0,0,0,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,255,255,255,255,255,255,255,255,221,255,119,255,221,255,119,255,221,119,221,119,221,119,221,119,170,85,170,85,170,85,170,85,85,255,85,255,85,255,85,255,170,170,170,170,170,170,170,170,238,221,187,119,238,221,187,119,136,136,136,136,136,136,136,136,177,48,3,27,216,192,12,141,128,16,2,32,1,8,64,4,255,136,136,136,255,136,136,136,255,128,128,128,255,8,8,8,128,0,0,0,0,0,0,0,128,64,32,0,2,4,8,0,130,68,57,68,130,1,1,1,248,116,34,71,143,23,34,113,85,160,64,64,85,10,4,4,32,80,136,136,136,136,5,2,191,0,191,191,176,176,176,176,0,0,0,0,0,0,0,0,128,0,8,0,128,0,8,0,136,0,34,0,136,0,34,0,136,34,136,34,136,34,136,34,170,170,85,85,170,170,85,85,255,0,255,0,255,0,255,0,17,34,68,136,17,34,68,136,255,0,0,0,255,0,0,0,1,2,4,8,16,32,64,128,170,0,128,0,136,0,128,0,255,128,128,128,128,128,128,128,8,28,34,193,128,1,2,4,136,20,34,65,136,0,170,0,64,160,0,0,4,10,0,0,3,132,72,48,12,2,1,1,128,128,65,62,8,8,20,227,16,32,84,170,255,2,4,8,119,137,143,143,119,152,248,248,0,8,20,42,85,42,20,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] );

var decodeHeader = function( arrayBuffer ) {
	//console.log( arrayBuffer, arrayBuffer.length );
	
	var header = {};	
	// there is a mac header ?
	// if its first three bytes are zereos, then there is not mac header present
	if( arrayBuffer.length >= 3 && arrayBuffer[0] === 0 && arrayBuffer[1] === 0 && arrayBuffer[2] === 0 ) {
		console.log( 'File does not have a mac header!' );
		header.present = false;
	} else {
		header.present = true;
		// first byte must be zero
		console.assert( arrayBuffer[0] === 0, 'First byte is not zero' );
		//at byte 1 is filename string length
		header.filenameLength = arrayBuffer[HEADER_FILENAME_LENGTH];
		console.log( 'Filename length is', header.filenameLength );
		// at bye 2 to filenameLength byte contains the filename characters
		header.filenameStr = getString( arrayBuffer, HEADER_FILENAME_START, header.filenameLength );
		console.log( 'Filename string is', header.filenameStr );
		// NOTE: if you are in c for example you must terminate the string by a null character
		
		// at byte 65 you have the mimetype, in this is case is the string "PNTG"
		console.assert( getString( arrayBuffer, HEADER_FILE_TYPE_START, 4 ) === HEADER_FILE_TYPE_STRING, 'Not a valid file!' );
		
		// at byte 69 you have the creator (OPTIONAL STEP)
		header.creator = getString( arrayBuffer, HEADER_CREATOR, 4 );
		console.log( 'Creator is', header.creator );
		
		// at byte 83 you have data fork size (long) (OPTIONAL STEP)
		header.dataForkSize = motr2Intel( arrayBuffer, HEADER_DATA_FORK );
		console.log( 'Data fork size is', header.dataForkSize );
		// at byte 87 you have resource fork size (long) (OPTIONAL STEP)
		header.resourceForSize = motr2Intel( arrayBuffer, HEADER_RESOURCE_FORK );
		console.log( 'Resource fork size is', header.resourceForSize );
		// at byte 91 you have creation date (long) (OPTIONAL STEP)
		header.creationDate = dateMac2PC( motr2Intel( arrayBuffer, HEADER_CREATION_DATE ) );
		console.log( 'Creation date is', header.creationDate );
		// at byte 95 you have modification date (long) (OPTIONAL STEP)
		header.modificationDate = dateMac2PC( motr2Intel( arrayBuffer, HEADER_MODIFICATION_DATE ) );
		console.log( 'Modification date is', header.modificationDate );
	}
	
	// at btye 132 the patterns are store, a total of 38 ones, 8 bytes long each one
	header.patterns = [];
	for( var i = 0, c = HEADER_PATTERN_START; i < HEADER_PATTERN_COUNT; i++, c++ ) {
		var pattern = new Uint8ClampedArray( HEADER_PATTERN_SIZE );
		for( var j = 0, k = 0; j < HEADER_PATTERN_SIZE; j++ ) {
			var patternByte = (~arrayBuffer[c*i+j]) & 0xff;
			pattern[k++] = patternByte;
		}
		header.patterns.push( pattern );
	}
	
	/*var headerCopy = arrayBuffer.subarray( 0, 640 );
	console.log( headerCopy );
	
	headerCopy[HEADER_FILENAME_LENGTH] = 0;
	for( var i = HEADER_FILENAME_START; i < HEADER_FILE_TYPE_START-1; i++ ) {
		headerCopy[i] = 0;
	}
	headerCopy[HEADER_FILE_TYPE_START] = 80; // P
	headerCopy[HEADER_FILE_TYPE_START+1] = 78; // N
	headerCopy[HEADER_FILE_TYPE_START+2] = 84; // T
	headerCopy[HEADER_FILE_TYPE_START+3] = 71; // G
	
	headerCopy[HEADER_CREATOR] = 77; // M
	headerCopy[HEADER_CREATOR+1] = 80; // P
	headerCopy[HEADER_CREATOR+2] = 78; // N
	headerCopy[HEADER_CREATOR+3] = 84; // T
	
	headerCopy[HEADER_DATA_FORK] = 0;
	headerCopy[HEADER_DATA_FORK+1] = 0;
	headerCopy[HEADER_DATA_FORK+2] = 0;
	headerCopy[HEADER_DATA_FORK+3] = 0;
	
	headerCopy[HEADER_RESOURCE_FORK] = 0;
	headerCopy[HEADER_RESOURCE_FORK+1] = 0;
	headerCopy[HEADER_RESOURCE_FORK+2] = 0;
	headerCopy[HEADER_RESOURCE_FORK+3] = 0;
	
	headerCopy[HEADER_CREATION_DATE] = 0;
	headerCopy[HEADER_CREATION_DATE+1] = 0;
	headerCopy[HEADER_CREATION_DATE+2] = 0;
	headerCopy[HEADER_CREATION_DATE+3] = 0;
	
	headerCopy[HEADER_MODIFICATION_DATE] = 0;
	headerCopy[HEADER_MODIFICATION_DATE+1] = 0;
	headerCopy[HEADER_MODIFICATION_DATE+2] = 0;
	headerCopy[HEADER_MODIFICATION_DATE+3] = 0;
	
	var str = [];
	for( var k = 0; k < 640; k++ ) {
		str[k] = headerCopy[k];
	}
	console.log( '[' + str + ']' );*/
	
	return header;
};

var loadMac = function( macFileURL, callback ) {
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', macFileURL );
	xhr.responseType = 'arraybuffer';
	xhr.onload = function( e ) {
		var data = this.response;
		if( data ) {
			var byteArray = new Uint8Array( data );
			var headerData = decodeHeader( byteArray );
			var imageData = decodeImage( byteArray );
			callback( headerData, imageData );
		} else {
			console.error( 'Corruped response data of file', macFileURL );
		}
	};
	xhr.onerror = function( e ) {
		console.error( 'Fail to load file', macFileURL );
	};
	xhr.send();
};

var setCanvas = function() {
	var $canvas = document.querySelector( '.picture' );
	$canvas.width = 576;
	$canvas.height = 720;
	$canvas = document.querySelector( '.patterns' );
	$canvas.width = 16*32;
	$canvas.height = 2*32;
};

var displayPatterns = function( patterns ) {
	var $canvas = document.querySelector( '.patterns' );
	var context = $canvas.getContext( '2d' );
	var patternImage = context.createImageData( 16*32, 2*32 );	
	var patternIndex = 0;
	var widthPixels = 16*32*4;
	var barSize = 32*4;
	for( var rows = 0; rows < 2; rows++ ) {
		var c = rows*widthPixels*32;
		for( var cols = 0; cols < 16; cols++ ) {
			var c2 = c + cols*barSize;
			var pattern = patterns[patternIndex++];
			var patternDecoded = new Uint8ClampedArray( 64 );
			for( k = 0, m = 0; k < 8; k++ ) {
				var patternByte = pattern[k];
				patternDecoded[m++] = (patternByte & 0x80) >> 7; 
				patternDecoded[m++] = (patternByte & 0x40) >> 6;
				patternDecoded[m++] = (patternByte & 0x20) >> 5;
				patternDecoded[m++] = (patternByte & 0x10) >> 4;
				patternDecoded[m++] = (patternByte & 0x08) >> 3;
				patternDecoded[m++] = (patternByte & 0x04) >> 2;
				patternDecoded[m++] = (patternByte & 0x02) >> 1;
				patternDecoded[m++] = patternByte & 0x01;
			}
			for( var y = 0; y < 32; y++ ) {
				var c3 = c2;
				for( var x = 0; x < 32; x++ ) {
					var color = patternDecoded[(y%8)*8+(x%8)]*255;
					patternImage.data[c3++] = color;
					patternImage.data[c3++] = color;
					patternImage.data[c3++] = color;
					patternImage.data[c3++] = 255;
				}
				c2 += widthPixels;
			}
		}
	}
	context.putImageData( patternImage, 0, 0 );
};

/////////////////////////////
/////////////////////////////
/////////////////////////////

var loadFile = function( macFileURL, callback ) {
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', macFileURL );
	xhr.responseType = 'arraybuffer';
	xhr.onload = function( e ) {
		var data = this.response;
		if( data ) {
			callback(  new Uint8Array( data ) );
		} else {
			console.error( 'Corruped response data of file', macFileURL );
		}
	};
	xhr.onerror = function( e ) {
		console.error( 'Fail to load file', macFileURL );
	};
	xhr.send();
};

var decodeImage = function( arrayBuffer, imageStartPosition ) {
	
	// at byte 640 the image data is store
	var compressedImageDataIndex = imageStartPosition;
	// holds here the raw image
	var imageDataIndex = 0;
	var imageData = new Uint8ClampedArray( 720*72 );
	var line = 0;
	while( imageDataIndex < 720*72 ) {
		// get one byte from the file
		var character = arrayBuffer[compressedImageDataIndex++] & 0xff;
		// see if the high order bit is set
		if( character & 0x80 ) {
			// if it is, derive the index
			var i = ((~character) & 0xff) + 2;
			// get the byte to repeat
			var ch = ~arrayBuffer[compressedImageDataIndex++] & 0xff;
			// and copy it into memory i times
			while( i-- ) {
				imageData[imageDataIndex++] = ch;
			}
		} else {
			// otherwhise get the index
			var i = (character & 0xff) + 1;
			// and get i bytes from the file
			while( i-- ) {
				var ch = ~arrayBuffer[compressedImageDataIndex++] & 0xff;

				imageData[imageDataIndex++] = ch;
			}
		}
		if( (imageDataIndex % 72) === 0 ) {
			line++;
		}
	}
	console.log( 'Compressed image is', compressedImageDataIndex-imageStartPosition, 'bytes long' );
	
	return imageData;
};

var displayPicture = function( imageData ) {
	var $canvas = document.querySelector( '.picture' );
	var context = $canvas.getContext( '2d' );
	var formatedImage = context.createImageData( 576, 720 );
	for( var i = 0, j = 0; i < formatedImage.data.length; j++ ) {
		var bitColors = imageData[j];
		var colors = [ 
			(bitColors & 0x80) >> 7, 
			(bitColors & 0x40) >> 6, 
			(bitColors & 0x20) >> 5, 
			(bitColors & 0x10) >> 4, 
			(bitColors & 0x08) >> 3, 
			(bitColors & 0x04) >> 2, 
			(bitColors & 0x02) >> 1, 
			bitColors & 0x01 
		];
		for( var k = 0; k < 8; k++, i += 4 ) {
			var color = colors[k]*255;
			formatedImage.data[i] = color;
			formatedImage.data[i+1] = color;
			formatedImage.data[i+2] = color;
			formatedImage.data[i+3] = 255;
		}
	}
	context.putImageData( formatedImage, 0, 0 );
};

var encodeImage = function( rawBitmap ) {
	var rawBitmapIndex = 0;
	
	var compressedBitmap = new Uint8Array( 720*72 );
	var compressedBitmapIndex = 0;
	
	/*var buffer = [];
	for( var line = 0; line < 720; line++ ) {
		for( var byteCount = 0; byteCount < 72; byteCount++ ) {
			buffer[byteCount] = rawBitmap[rawBitmapIndex++];
		}
		console.log( 'line', line, buffer );
		var sameBytes = 0;
		var byteToRepeat;
		var string = [];
		for( var byteCount = 0; byteCount < 71; byteCount++ ) {
			if( buffer[byteCount] === buffer[byteCount+1] ) {
				sameBytes++;
				byteToRepeat = buffer[byteCount];
			} else {
				if( sameBytes >= 2 ) {
					if( string.length ) {
						console.log( 'string', string, 'with length', string.length, 'to be copied' );
						string = [];
					}
					console.log( 'repeat', sameBytes+1, 'times byte', byteToRepeat );
					sameBytes = 0;
				} else {
					if( sameBytes > 0 ) {
						string.push( buffer[byteCount] );
						sameBytes = 0;
					}
					string.push( buffer[byteCount] );
				}
			}
		}
		if( string.length ) {
			console.log( 'string', string, 'with length', string.length, 'to be copied' );
		}
		if( sameBytes ) {
			console.log( 'repeat', sameBytes+1, 'times byte', byteToRepeat );
		}		
		//if( line === 20 ) { break; }
	}
	return compressedBitmap;*/
	
	rawBitmapIndex = 0;
	var buffer = new Uint8Array( 72 );
	var bufferIndex = 0;
	
	for( var line = 0; line < 720; line++ ) {
		//console.log( 'line', line );
		var offset = 0;
		bufferIndex = 0;
		while( offset < 72 ) {
			var sameBytes = 0;
			while( offset < 71 && rawBitmap[rawBitmapIndex+offset] === rawBitmap[rawBitmapIndex+offset+1] ) {
				sameBytes++;
				offset++;
			}
			if( sameBytes >= 2 ) {
				if( bufferIndex > 0 ) {
					compressedBitmap[compressedBitmapIndex++] = bufferIndex-1;
					for( var k = 0; k < bufferIndex; k++ ) {
						compressedBitmap[compressedBitmapIndex++] = ~buffer[k];
					}
					//console.log( '\tstring', string, 'length', string.length );
					bufferIndex = 0;
				}
				compressedBitmap[compressedBitmapIndex++] = ~sameBytes+1;
				compressedBitmap[compressedBitmapIndex++] = ~rawBitmap[rawBitmapIndex+offset];
				//console.log( '\trepeat', sameBytes+1, 'byte', buffer[offset] );
				offset++;
			} else {
				if( sameBytes === 1 ) {
					buffer[bufferIndex++] = rawBitmap[rawBitmapIndex+offset];
				}
				buffer[bufferIndex++] = rawBitmap[rawBitmapIndex+offset];
				offset++;
			}
		}
		if( bufferIndex > 0 ) {
			compressedBitmap[compressedBitmapIndex++] = bufferIndex-1;
			for( var k = 0; k < bufferIndex; k++ ) {
				compressedBitmap[compressedBitmapIndex++] = ~buffer[k];
			}
			//console.log( '\tstring', string, 'length', string.length );
		}
		rawBitmapIndex += 72;
		//if( line === 500 ) { break; }
	}

	console.log( 'Image has been compressed to a length of', compressedBitmapIndex, 'bytes' );
	
	return compressedBitmap.subarray( 0, compressedBitmapIndex );
};

var createHeader = function( options ) {
	var header = headerStruct.subarray( 0 );
	
	filename = options.filename.toString();
	header[HEADER_FILENAME_LENGTH] = filename.length > STRING_MAX_LENGTH ? STRING_MAX_LENGTH : filename.length;
	for( var i = HEADER_FILENAME_START, j = 0, l = filename.length; j < l; i++, j++ ) {
		header[i] = filename.charAt( j ).charCodeAt( 0 );
	}
	
	var date = datePC2Mac( new Date() )/1000;
	header[HEADER_CREATION_DATE] = (date>>24)&0xff;
	header[HEADER_CREATION_DATE+1] = (date>>16)&0xff;
	header[HEADER_CREATION_DATE+2] = (date>>8)&0xff;
	header[HEADER_CREATION_DATE+3] = date&0xff;	
	header[HEADER_MODIFICATION_DATE] = header[HEADER_CREATION_DATE];
	header[HEADER_MODIFICATION_DATE+1] = header[HEADER_CREATION_DATE+1];
	header[HEADER_MODIFICATION_DATE+2] = header[HEADER_CREATION_DATE+2];
	header[HEADER_MODIFICATION_DATE+3] = header[HEADER_CREATION_DATE+3];
	
	return header;
};

var buildFile = function( header, compressedImage ) {
	
	var dataForkSize = compressedImage.length + HEADER_SIZE_NONHEADER;
	
	header[HEADER_DATA_FORK] = (dataForkSize>>24)&0xff;
	header[HEADER_DATA_FORK+1] = (dataForkSize>>16)&0xff;
	header[HEADER_DATA_FORK+2] = (dataForkSize>>8)&0xff;
	header[HEADER_DATA_FORK+3] = dataForkSize&0xff;
	
	var file = new Uint8Array( HEADER_SIZE + compressedImage.length );
	file.set( header, 0 );
	file.set( compressedImage, HEADER_SIZE );
	
	return file;
};

var downloadFile = function( arrayBuffer, filename ) {
	filename = filename.toString();
	// create the download link
	var blob = new Blob( [ arrayBuffer ], { type: 'application/octet-binary' } );
	var a = document.createElement( 'a' );
	a.setAttribute( 'download', filename + '.mac' );
	a.setAttribute( 'href', URL.createObjectURL( blob ) );
	a.style.display = 'none';
	document.body.appendChild( a );
	// show download window
	a.click();
};

/////////////////////////////
/////////////////////////////
/////////////////////////////

setCanvas();
/*loadMac( 'MILO.PIC', function( headerData, imageData ) {
//loadMac( 'FEMHEAD1.MAC', function( headerData, imageData ) {
//loadMac( 'CHRISTIE.MAC', function( headerData, imageData ) {
	displayPatterns( headerData.patterns );
	displayPicture( imageData );
} );*/

loadFile( '1424873921438.MAC', function( arrayBuffer ) {
	var header = decodeHeader( arrayBuffer );
	header.present && displayPatterns( header.patterns );
	var bitmap = decodeImage( arrayBuffer, header.present ? HEADER_SIZE : HEADER_SIZE_NONHEADER );
	displayPicture( bitmap );
	
	var compress = encodeImage( bitmap );
	var filename = new Date().valueOf();
	var header = createHeader( { filename: filename } );
	//console.log( header );
	var file = buildFile( header, compress );
	downloadFile( file, filename );
	//var bitmap2 = decodeImage2( compress, true );
	//displayPicture2( bitmap2 );

} );
