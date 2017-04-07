var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var morgan = require('morgan');

var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(__dirname + '/'));
app.use(cors());

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function(){
    console.log('Server running at port ' + port);
});