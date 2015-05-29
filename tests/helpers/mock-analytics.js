var oldAnalytics;
let trackedEvents = [];

export var mockAnalytics = {
 load: function(){},
 query: function(){},
 identify: function(data, fn){
   setTimeout(fn, 2);
 },
 ready: function(fn){
   setTimeout(fn, 2);
 },
 page: function(data, fn){
   setTimeout(fn, 2);
 },
 user: function(){
   return {
     traits: function(){
       return {};
     }
   };
 },
 track(eventName, attributes={}) {
   trackedEvents.push({eventName, attributes});
 }
};

export function stubAnalytics(){
  oldAnalytics = window.analytics;
  window.analytics = mockAnalytics;
}

export function teardownAnalytics(){
  trackedEvents = [];
  window.analytics = oldAnalytics;
}

export function didTrackEvent(eventName) {
  return trackedEvents.filterBy('eventName', eventName).length > 0;
}

export function didTrackEventWith(eventName, key, value) {
  let foundEvents = trackedEvents.filterBy('eventName', eventName);
  return foundEvents.find((evt) => {
    return evt.attributes[key] === value;
  });
}
