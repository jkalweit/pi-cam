const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const { StreamCamera, Codec, Rotation, SensorMode } = require('pi-camera-connect');


io.on('connection', socket => {
	console.log('connection');
});


const runApp = async () => {

	const streamCamera = new StreamCamera({
		codec: Codec.MJPEG,
		width: 320,
		height: 240,
		rotation: Rotation.Rotate90,
		sensorMode: SensorMode.Mode7	
	});

	await streamCamera.startCapture();

	var buf;
	async function doIt() {
		buf = await streamCamera.takeImage();
		//fs.writeFileSync(__dirname + '/client/test.jpg', buf);
		console.log(new Date().toISOString(), 'snapped');
		io.emit('snapped',  { buf: buf.toString('base64') });
		setTimeout(doIt, 100); // might have to adjust this delay -JDK 2018-12-31
	}
	
	doIt();
};


app.use('/', express.static('client'));
http.listen(3000, () => console.log('App listening on port 3000!'));

runApp();

