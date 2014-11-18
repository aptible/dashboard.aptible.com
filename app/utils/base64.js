export default {
  decode: function(encoded){
    return window.atob(encoded);
  },
  encode: function(decoded){
    return window.btoa(decoded);
  }
};
