var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app)
var index = require('./routes/index');
var path = require('path');
var alertSocket = require('socket.io')(server);
var port = 5000;


app.set("port", (process.env.PORT || 5000));

app.use('/', index);

alertSocket.on('connection', function(socket){

    alertSocket.to(socket.id).emit('keepConnected');

    socket.on('stayConnected', function(data){
        console.log('keepingConnection');
        setTimeout(function(){
            alertSocket.to(socket.id).emit('keepConnected');
            console.log('keepingConnection sent');
        },10000);
    });

    socket.on('adminAlert', function(data){
        console.log('an alert was received');
        alertSocket.sockets.emit('userAlert', {alert: data.alertInfo});
    });

    socket.on('alertOver', function(data){
        console.log("alert attempted");
        alertSocket.sockets.emit('removeAlert');
    })


    socket.on('disconnect', function(){
        console.log('client side disconnect');

    });

});

server.listen(port, function(){
    console.log("listening on port: " + port);
})