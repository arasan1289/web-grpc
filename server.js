var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('grpc');
var _ = require('lodash');
var async = require('async');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var helloworld = protoDescriptor.helloworld;

/**
 * @param {!Object} call
 * @return {!Object} metadata
 */
function copyMetadata(call) {
  var metadata = call.metadata.getMap();
  var response_metadata = new grpc.Metadata();
  for (var key in metadata) {
    response_metadata.set(key, metadata[key]);
  }
  return response_metadata;
}


/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doSayHello(call, callback) {
  callback(null, {message: 'Hello! '+ call.request.name});
}

/**
 * @param {!Object} call
 */
function doSayRepeatHello(call) {
  var senders = [];
  function sender(name) {
    return (callback) => {
      call.write({
        message: 'Hey! ' + name
      });
      _.delay(callback, 500); // in ms
    };
  }
  for (var i = 0; i < call.request.count; i++) {
    senders[i] = sender(call.request.name + i);
  }
  async.series(senders, () => {
    call.end();
  });
}

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doSayHelloAfterDelay(call, callback) {
  function dummy() {
    return (cb) => {
      _.delay(cb, 5000);
    };
  }
  async.series([dummy()], () => {
    callback(null, {
      message: 'Hello! '+call.request.name
    });
  });
}

/**
 * @param {!Object} call
 */
function doServerStreamingEcho(call) {
  var senders = [];
  function sender(message, interval) {
    return (callback) => {
      call.write({
        message: message
      });
      _.delay(callback, interval);
    };
  }
  for (var i = 0; i < call.request.message_count; i++) {
    senders[i] = sender(call.request.message, call.request.message_interval);
  }
  async.series(senders, () => {
    call.end(copyMetadata(call));
  });
}

/**
 * @return {!Object} gRPC server
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(helloworld.Greeter.service, {
    sayHello: doSayHello,
    sayRepeatHello: doSayRepeatHello,
    sayHelloAfterDelay: doSayHelloAfterDelay,
    serverStreamingEcho: doServerStreamingEcho
  });
  return server;
}

if (require.main === module) {
  var server = getServer();
  server.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
  server.start();
}

exports.getServer = getServer;
