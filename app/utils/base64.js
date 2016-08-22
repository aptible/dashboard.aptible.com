export default {
  decode(encoded){
    return window.atob(encoded);
  },
  encode(decoded){
    return window.btoa(decoded);
  }
};
