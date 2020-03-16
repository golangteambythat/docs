var sharedb = require('sharedb/lib/client');
var StringBinding = require('sharedb-string-binding');

var ReconnectingWebSocket = require('reconnecting-websocket');
var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

var element = document.querySelector('textarea');

var doc = connection.get('examples', 'textarea-demo');
doc.subscribe(function (err) {
  if (err) throw err;
  console.log('subscribe');

  var binding = new StringBinding(element, doc, ['content']);
  binding.setup();
});
