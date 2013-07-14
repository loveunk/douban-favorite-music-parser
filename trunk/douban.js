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

function getContentAndPost() {
  var totalLike = document.getElementById("nav_liked").innerText;
  var record_viewer = document.getElementById("record_viewer");
    
  var additionalInfo;
  if (totalLike.length) {
    additionalInfo = {"totalLike": totalLike, "musics": []};
  } else {
    additionalInfo = {"totalLike": "No..", "musics": "No.."};
  }

  if (record_viewer.innerText.length <= 10) {
    setTimeout(getContentAndPost, 500);
  } else {
    var props = getElementsByClass("props", record_viewer);
    if (props) {
      for (var i = 0; i < props.length; ++i) {
        var prop = props[i];
        var musicName = getElementsByClass("song_title", prop);
        var performer = getElementsByClass("performer", prop);
        var source    = prop.getElementsByTagName("a");
        var sourceURL = source[0].href;
        var sourceName = source[0].innerText;
        additionalInfo.musics.push({
                                   "musicName" : musicName[0].innerText,
                                   "sourceURL" : sourceURL,
                                   "sourceName": sourceName,
                                   "performer" : performer[0].innerText
                                   });
      }
    }
    chrome.extension.connect().postMessage(additionalInfo);
  }
}

getContentAndPost();