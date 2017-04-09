var peer = new Peer({
	key: 'saxv2cjyzuz69a4i',
	 config: {'iceServers': [
    	{url:'stun:stun3.l.google.com:19302'},
		{
			url: 'turn:192.158.29.39:3478?transport=tcp',
			credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
			username: '28224511:1379330808'
		}
	]}
});

var my_id;
//console.log(navigator.userAgent);
var conn;
var other_id;

function myError(msg){
	$('#myError').show('fadein');
	document.getElementById('myError').innerHTML = msg;
	setTimeout(function(){

		$('#myError').hide('fadeout');
	},5000);
}


if(util.supports.data){
	peer.on('open', function(id) {
		my_id = id;
	//console.log('My peer ID is: ' + id);
	document.getElementById('url-link').value = id;
	});


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
	peer.on('disconnected', myDisconnection);
	var count = 0;
}
else{	
	document.getElementById('test').hidden = true;
	document.getElementById('error-page').hidden = false;
}

function myDisconnection(con){
	document.getElementById('send').disabled = true;
	document.getElementById('cur-conn').innerHTML = '<i>No Connected Users.</i>';
	document.getElementById('r-url-d').value = '';
	myError('Disconnected with: <strong>' + con.peer + '</strong>');
}

function SendMsg(){
		var files = document.getElementById('myFile').files;
		if (!files.length) {
		myError('Please select a file!');
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
					//console.log("sending: " + (offset / fileSize) * 100 + "%");
					if (offset >= fileSize) {
						conn.send(evt.target.result); ///final chunk
						//conn.send('Done!');
						//console.log("Done reading file " + name + " " + mime);
						count++;
						return;
					}
					else {
						//console.log(evt.target.result);                    
						conn.send(evt.target.result);
						count++;
					}               
				} else {
					//console.log("Read error: " + evt.target.error);
					return; 
				}
				readchunk();
			};
			r.readAsArrayBuffer(blob);
		}

		readchunk(Math.ceil(fileSize/chunkSize));
		conn.send({name:name, type:mime, size: file.size});
	}
	
function Connect(){
		var other_id = document.getElementById('r-url-d').value;
		var c = peer.connect(other_id);
		c.on('open', function(){
			myConnection(c);
		});

		c.on('close', function(){
			myDisconnection(c);
			c.destroy();
		});

		c.on('error', function(err){ alert(err) });
		//console.log(other_id);
	}

	function myConnection(con){
		conn = con;
		document.getElementById('cur-conn').innerHTML = '<strong>Connected to : </strong>' + conn.peer;
		document.getElementById('send').disabled = false;
		$('#mySuccess').show('fadein');
		document.getElementById('mySuccess').innerHTML = '<strong>Connected to : </strong>' + conn.peer;
		setTimeout(function(){
			$('#mySuccess').hide('fadeout');
		},5000);
		
		conn.on('data', function(data){
			document.getElementById('dwld-link').innerHTML = '';
			document.getElementById('info').innerHTML = '';
			document.getElementById('myLoader').hidden = false;
			if(it < 1){
				myType.push(data);
				ty = myType[0].type;
				nm = myType[0].name;
				sz = parseInt(myType[0].size);
				total = Math.ceil(sz/(1024*1024));
				//console.log(total);
				it++;
			}
			else{
				myData.push(data);
			}
			//myData.push(data);
			//console.log(myData);
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
				//console.log(finalBlobs);
				ConcatenateBlobs(finalBlobs, ty , function(resultingBuff){

					var resultingBlob = new Blob([resultingBuff], {type: ty});
					//console.log(resultingBlob);
					var url  = URL.createObjectURL(resultingBlob);
					document.getElementById('myLoader').hidden = true;
					document.getElementById('dwld-link').innerHTML = '<a href="'+ url +'" class="btn btn-md btn-danger" download="'+ nm +'">Download</a>';
					myBl.length = 0;
					finalBlobs.length = 0;
					myData.length = 0;
					myType.length = 0;
					it = 0;
				});	
			}
		});

	}

/*var m = 0;
var mybb = [];	
function myConnection(con){
		conn = con;
		$('#cur-conn').append('<strong>Connected to : </strong>' + conn.peer);
		conn.on('data', function(data){
			if(it < 1){
				myType.push(data);
				ty = myType[0].type;
				nm = myType[0].name;
				sz = parseInt(myType[0].size);
				total = Math.ceil(sz/(1024*1024));
				it++;
			}
			else{
				myData.push(data);
				var bb = new Blob([myData[m]], {type: ty});
				mybb.push(bb);
				ConcatenateBlobs(mybb, ty , function(resultingBuff){

					var resultingBlob = new Blob([resultingBuff], {type: ty});
					var url  = URL.createObjectURL(resultingBlob);
					document.getElementById('audio-listen').innerHTML = '<audio src="'+ url +'" id="try"></audio>';
					document.getElementById('try').type = ty;
					var t = document.getElementById('try');
					t.play();
				});
				m++;
			}
		});

}*/

	function SendEmail(){
		var email = document.getElementById('email').value;
		if(!email){
			document.getElementById('errorMsg').hidden = false;
			document.getElementById('successMsg').hidden = true;
		}
		else{
			document.getElementById('errorMsg').hidden = true;
			var service_id = 'gmail';
			var template_id = 'template_zS6xa2Hp';
			var template_params = {
			from_name: 'File Transfer',
			reply_to: 'file.transfer1211@gmail.com',
			to_email: email,
			message_html: 'Peer ID of connector is:  ' + my_id
			};

			emailjs.send(service_id,template_id,template_params);
			document.getElementById('successMsg').hidden = false;	
		}
	}