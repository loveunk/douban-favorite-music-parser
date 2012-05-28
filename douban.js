/*
used to get HTML code(music information) from douban.com, and send message to background.html

Copyright (C) 2012  Wen Qi <qiwen@qiwen.name>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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

var totalLike = getElementsByClass("current", document.getElementById("navigation"));
var ipt = document.getElementById("record_viewer");
if (totalLike.length) {
  var additionalInfo = {
    "totalLike": totalLike[0].innerHTML,
    "selection": ipt.innerHTML
  };
}
else {
  var additionalInfo = {
    "totalLike": "No..",
    "selection": "No.."
  };
}
chrome.extension.connect().postMessage(additionalInfo);