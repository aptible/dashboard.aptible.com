export function getUrlParameters(loc) {
  var a = loc.search.substr(1).split('&');
  var b = {};
  if (a.length > 0) {
    for (var i = 0; i < a.length; ++i) {
      var p=a[i].split('=', 2);
      if (p.length === 1) {
        b[p[0]] = "";
      } else {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
  }
  return b;
}

export function getUrlParameter(loc, name) {
  var params = getUrlParameters(loc);
  return params ? params[name] : undefined;
}
