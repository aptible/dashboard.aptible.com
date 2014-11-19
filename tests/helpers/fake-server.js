import Pretender from 'pretender';

var currentServer;

function stringifyJSON(json){
  return json ? JSON.stringify(json) : '{"error": "not found"}';
}

function raiseOnUnhandledRequest(verb, path, request){
  console.error("FakeServer received unhandled request",{verb:verb,path:path,request:request});
  ok(false, "FakeServer received unhandled request for " + verb + " " + path);
  throw "FakeServer received unhandled request for :" + verb + " " + path;
}

var jsonMimeType = {"Content-Type": "application/json"};

function errorRequest(status, errors){
  // if called without `status`
  if (!errors) { errors = status; status = 422; }

  return [status, jsonMimeType, errors];
}

function notFoundRequest(){
  return [404, jsonMimeType, {}];
}

function successRequest(status, json){
  // if called without `status`
  if (!json) { json = status; status = 200; }

  return [status, jsonMimeType, json];
}

function logHandledRequest(verb, path, request){
  console.log('[FakeServer] handled: ' + verb + ' ' + path, request);
}

function jsonFromRequest(request){
  if (!request.requestBody) {
    console.warn("[FakeServer] tried to parse json from request without a requestBody",request);
    return {};
  }

  return JSON.parse(request.requestBody);
}

function stubRequest(verb, path, callback){
  if (!currentServer) { throw "Cannot stubRequest when FakeServer is not running."; }

  callback = callback.bind({
    json: jsonFromRequest,
    success: successRequest,
    error: errorRequest,
    notFound: notFoundRequest
  });
  currentServer[verb](path, callback);
}

export { stubRequest };

export default {
  start: function(){
    if (currentServer) {
      throw new Error('Cannot start FakeServer while it is already running...');
    }

    currentServer = new Pretender();
    currentServer.prepareBody = stringifyJSON;
    currentServer.unhandledRequest = raiseOnUnhandledRequest;
    currentServer.handledRequest = logHandledRequest;
  },
  stop: function(){
    if (!currentServer) {
      console.warn('Called FakeServer.stop while it was not running');
      return;
    }

    currentServer.shutdown();
    currentServer = null;
  }
};
