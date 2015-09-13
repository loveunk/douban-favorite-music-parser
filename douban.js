/*
used to get HTML code(music information) from douban.com, and send message to background.html

Copyright (C) 2014  Wen Qi <qiwen@qiwen.name>

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

function getElementsByClass(searchClass, domNode, tagName) {
	if (domNode == null)
		domNode = document;
	if (tagName == null)
		tagName = '*';
	var el = new Array();
	var tags = domNode.getElementsByTagName(tagName);
	var tcl = " " + searchClass + " ";
	for (i = 0, j = 0; i < tags.length; i++) {
		var test = " " + tags[i].className + " ";
		if (test.indexOf(tcl) != -1)
			el[j++] = tags[i];
	}
	return el;
}

function getContentAndPost() {
	var record_viewer = document.getElementById("record_viewer");
	if (!record_viewer) {
		alert("unexpected");
		return;
	}
    
    var bottom_pager = document.getElementById("bottom_pager");
	if (bottom_pager.innerText.length == 0) {
		setTimeout(getContentAndPost, 500);
		return;
	}
    
	var props = getElementsByClass("props", record_viewer);
	if (props.length == 0) {
        alert("empty list");
    }

    var info = {};
    
    var liked_or_banned = document.URL.match("liked");
    if (liked_or_banned) liked_or_banned = true;
    
	var startFromStr = document.URL.match(/[0-9]+/);
	if (!startFromStr || startFromStr.length <= 0) {
		alert("unexpected");
		return;
	}
    info.startFrom = new Number(startFromStr[0]);
    
    var target = liked_or_banned?"nav_liked":"nav_banned";
    var totalStr = document.getElementsByClassName("total").item(0).innerText.trim();
    if (totalStr && totalStr.length) {
        info.total = new Number(totalStr.substring(1, totalStr.length - 1));
    } else {
        alert("unexpected");
        return;
    }

    info.musics = [];
	for (var i = 0; i < props.length; ++i) {
		var prop = props[i];
		var musicName = getElementsByClass("song_title", prop);
		var performer = getElementsByClass("performer", prop);
		var source = prop.getElementsByTagName("a");
		var sourceURL = source[0].href;
		var sourceName = source[0].innerText;
		info.musics.push({
			"musicName" : musicName[0].innerText,
			"sourceURL" : sourceURL,
			"sourceName" : sourceName,
			"performer" : performer[0].innerText
		});
	}
	chrome.extension.connect().postMessage(info);
}

getContentAndPost();
