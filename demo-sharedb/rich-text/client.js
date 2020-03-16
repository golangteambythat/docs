var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
var Quill = require('quill');
sharedb.types.register(richText.type);

var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

var doc = connection.get('examples', 'richtext');
doc.subscribe(function (err) {
  if (err) throw err;
  console.log('subscribe');

  var quill = new Quill('#editor', { theme: 'snow' });
  quill.setContents(doc.data);
  quill.on('text-change', function (delta, oldDelta, source) {
    if (source !== 'user') return;
    doc.submitOp(delta, { source: quill });
  });
  doc.on('op', function (op, source) {
    if (source === quill) return;
    quill.updateContents(op);
  });
});
