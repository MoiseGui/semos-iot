const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    io.emit("semos","Un appareil s'est connecté");
    socket.on('semos', msg => {
        io.emit('semos', msg);
        console.log(msg);
        fs.open('iot.txt', 'a+', 666, function (e, id) {
            fs.write(id, msg + "\n", null, 'utf8', function () {
                fs.close(id, function () {
                    console.log('file is updated');
                });
            });
        });

        fs.readFile('iot.txt', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Asynchronous read: " + data.toString());

        });

    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});