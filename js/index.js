var peer = new Peer({
	key: 'saxv2cjyzuz69a4i',
	config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' }
	]}
});

var my_id;
console.log(navigator.userAgent);
var conn;
var other_id;


peer.on('open', function(id) {
	my_id = id;
  console.log('My peer ID is: ' + id);
  document.getElementById('url-link').value = id;
});


function Connect(){
	var other_id = document.getElementById('r-url-d').value;
	var c = peer.connect(other_id);
	c.on('open', function(){
		myConnection(c);
	});

	c.on('error', function(err){ alert(err) });
	//console.log(other_id);
}

peer.on('connection', myConnection);
var myType = [];
var myData = [];
var it = 0;
var sz;
var ty;
var nm;
var total;
var finalBlobs =[];
var myBl = [];
function myConnection(con){
	conn = con;
	$('#cur-conn').append('<strong>Connected to : </strong>' + conn.peer);
	conn.on('data', function(data){
		document.getElementById('myLoader').hidden = false;
		if(it < 1){
			myType.push(data);
			ty = myType[0].type;
			nm = myType[0].name;
		    sz = parseInt(myType[0].size);
			total = Math.ceil(sz/(1024*1024));
			console.log(total);
			it++;
		}
		else{
			myData.push(data);
		}
		//myData.push(data);
		console.log(myData);
		if(myData.length >= total){
			var nblob;

			document.getElementById('info').innerHTML = '<i class="fa fa-file fa-3x"></i>&nbsp;&nbsp;<strong><i><u>' + nm +'</u></i></strong>';
			for(var i =0;i<myData.length;i++){
				
				 nblob = new Blob([myData[i]],{ type:ty });
				 var ts = nblob.size;
				 if(ts >= 1024*1024){
					finalBlobs.push(nblob);
				 }
				 else{
					 myBl.push(nblob);
				 }
			}
			finalBlobs.push(myBl[0]);
			console.log(finalBlobs);
			ConcatenateBlobs(finalBlobs, ty , function(resultingBuff){

				var resultingBlob = new Blob([resultingBuff], {type: ty});
				console.log(resultingBlob);
				var url  = URL.createObjectURL(resultingBlob);
				document.getElementById('myLoader').hidden = true;
				document.getElementById('dwld-link').innerHTML = '<a href="'+ url +'" class="btn btn-md btn-danger" download="'+ nm +'">Download</a>';
			});
			
			//var url  = URL.createObjectURL(nblob);
			//document.getElementById('dwld-link').innerHTML = '<a href="'+ url +'" class="btn btn-md btn-danger" download>Download</a>';
		}
		//var filename = myData[0].name;
		//var filetype = myData[0].type;
		//var nblob = new Blob([myData[]])
		//console.log(filename,filetype);
		/*document.getElementById('info').innerHTML = '<i class="fa fa-file fa-3x"></i>&nbsp;&nbsp;<strong><i><u>' + data.filename +'</u></i></strong>';
		var nblob = new Blob([data.file], { type: data.filetype });
		var url  = URL.createObjectURL(nblob);
		document.getElementById('dwld-link').innerHTML = '<a href="'+ url +'" class="btn btn-md btn-danger" download>Download</a>';
		console.log(url);*/
	});
	//SendMsg(conn);

}
var count = 0;
function SendMsg(){
	var files = document.getElementById('myFile').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    var file = files[0];

    var fileSize = file.size;
    var name = file.name;
    var mime = file.type;
    var chunkSize = 1024 * 1024; // bytes
    var offset = 0;
 function readchunk(first) {
	
		var r = new FileReader();
		var blob = file.slice(offset, chunkSize + offset);
		r.onload = function(evt) {
			if (!evt.target.error) {
				offset += chunkSize;
				var yy = parseFloat((offset / fileSize) * 100).toFixed(2);
				if(yy > 100){
					yy = 100.00;
				}
				document.getElementById('progress1').innerHTML = '<div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style="width:'+ yy +'%"></div></div><span><h3><strong>'+ yy +'% completed at a speed of 1Mbps!</strong></h3></span>';
				console.log("sending: " + (offset / fileSize) * 100 + "%");
				if (offset >= fileSize) {
					conn.send(evt.target.result); ///final chunk
					//conn.send('Done!');
					console.log("Done reading file " + name + " " + mime);
					count++;
					return;
				}
				else {
					//console.log(evt.target.result);                    
					conn.send(evt.target.result);
					count++;
				}               
			} else {
				console.log("Read error: " + evt.target.error);
				return; 
			}
			readchunk();
		};
        r.readAsArrayBuffer(blob);
    }

    readchunk(Math.ceil(fileSize/chunkSize));
	conn.send({name:name, type:mime, size: file.size});


	/*var chunkSize = 1024*1024;
	var fileSize = file.size;
	var chunks = Math.ceil(file.size/chunkSize,chunkSize);
	var chunk = 0;
	 console.log('file size..',fileSize);
  	console.log('chunks...',chunks);*/

  //while (chunk <= chunks) {
      //var offset = chunk*chunkSize;
      /*console.log('current chunk..', chunk);
      console.log('offset...', chunk*chunkSize);
      console.log('file blob from offset...', offset);
      console.log(file.slice(offset,offset + chunkSize));*/
	  //var tp = file.slice(offset,offset + chunkSize);
	  //tp.type = file.type;
	  //console.log(tp);
	  //var blob = new Blob(file[chunk], { type: file.type });
	  //console.log(blob);
      //chunk++;
  //}

	/*var blob = new Blob(files, { type: file.type });
	console.log(blob);

	conn.send({
		file: blob,
		filename: file.name,
		filetype: file.type
	});*/

	//console.log('dhiasgd');
	//var msg = $('#content').val();
	//console.log('Sent By : ['+ my_id +']' + msg);
	//conn.send('['+ my_id +']' + ' : '+  msg);
}


