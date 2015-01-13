var oldAnalytics;

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
 }
};

export function stubAnalytics(){
  oldAnalytics = window.analytics;
  window.analytics = mockAnalytics;
}

export function teardownAnalytics(){
  window.analytics = oldAnalytics;
}
