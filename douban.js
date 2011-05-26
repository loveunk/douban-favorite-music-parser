function getElementsByClass( searchClass, domNode, tagName) { 
  if (domNode == null) domNode = document;
  if (tagName == null) tagName = '*';
  var el = new Array();
  var tags = domNode.getElementsByTagName(tagName);
  var tcl = " "+searchClass+" ";
  for(i=0,j=0; i<tags.length; i++) { 
    var test = " " + tags[i].className + " ";
    if (test.indexOf(tcl) != -1) 
      el[j++] = tags[i];
  }
  return el;
}

var totalLike = getElementsByClass("songs_tabs", document.getElementById("content"));
var ipt = document.getElementsByTagName("tbody");
if (ipt.length && totalLike.length) {
  var additionalInfo = {
    "totalLike": totalLike[0].innerHTML,
    "selection": ipt[0].innerHTML
  };
}
else {
  var additionalInfo = {
    "totalLike": "No..",
    "selection": "No.."
  };
}
chrome.extension.connect().postMessage(additionalInfo);