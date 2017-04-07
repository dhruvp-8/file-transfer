var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var webrtcSupport = require('webrtcsupport');
var DetectRTC = require('detectrtc');

var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(__dirname + '/'));

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});


/*DetectRTC.load(function() {
    if(DetectRTC.isWebRTCSupported){
        console.log("Supported");
    }
    else{
        console.log("Not Supported");
    }
    
});*/

app.listen(port, function(){
    console.log('Server running at port ' + port);
});