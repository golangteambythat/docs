var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let servDoc = AutoMerge.init();
servDoc = AutoMerge.change(servDoc, doc => {
  doc.text = new AutoMerge.Text();
});

io.on('connection', (socket) => {
  console.log('a user connected, id: ', socket.id);
  let docStr = AutoMerge.save(servDoc);
  socket.emit('client-init', docStr);

  socket.on('disconnect', () => {
    console.log('a user disconnect, id: ', socket.id);
  });

  socket.on('client-actions', (changesInfo) => {
    let changes = JSON.parse(changesInfo);
    servDoc = AutoMerge.applyChanges(servDoc, changes);
    console.log('broadcast ', changesInfo);
    socket.broadcast.emit('server-actions', changesInfo);
  });
});


http.listen(3000, function () {
  console.log('listening on *:3000');
});
