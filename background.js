/*
used to control the main flow of parsing

Copyright (C) 2014 QI Wen <qiwen@qiwen.name>

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

var liked_or_banned;
var musics;

function pageLoaded(tab) {
	chrome.tabs.executeScript(tab.id, {file : 'douban.js'});
}

function messageListener(port) {
	var tab = port.sender.tab;
	port.onMessage.addListener(function (info) {
        for (var i = 0; i < info.musics.length; ++i) {
            musics[info.startFrom + i] = info.musics[i];
        }
        
        var nextStartFrom;
        if (info.musics.length == 0) {
            musics[info.startFrom] = {
			"musicName" : "",
			"sourceURL" : "",
			"sourceName" : "",
			"performer" : ""
            };
            nextStartFrom = info.startFrom + 1;
        } else {
            var residue = info.startFrom % 15;
            if (residue == 0) {
                nextStartFrom = info.startFrom + info.musics.length;
            } else {
                if (residue + info.musics.length <= 15) {
                    nextStartFrom = info.startFrom + info.musics.length;
                } else {
                    nextStartFrom = info.startFrom - residue + 15;
                }
            }
        }

        if (musics.length < info.total) {
            var url = "http://douban.fm/mine#!type="+(liked_or_banned?"liked":"banned")+"&start="+nextStartFrom;
            setTimeout(function(){
                chrome.tabs.remove(tab.id);
                chrome.tabs.create({"url" : url}, pageLoaded);
            }, 5000);
        } else {
            chrome.tabs.remove(tab.id)
			chrome.tabs.create({"url" : "result.html"});
        }
	});
}

function checkFirstTime() {
	if (localStorage["_douban_music_parser_firstTime"] == undefined) {
		localStorage["_douban_music_parser_firstTime"] = ":]";
		openOptions(true);
	}
}

function openOptions(firstTime) {
	var url = "thanks_page.html";

	var fullUrl = chrome.extension.getURL(url);
	chrome.tabs.getAllInWindow(null, function (tabs) {
		for (var i in tabs) { // check if Options page is open already
			var tab = tabs[i];
			if (tab.url == fullUrl) {
				chrome.tabs.update(tab.id, {
					selected : true
				}); // select the tab
				return;
			}
		}
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.create({url : url, index : tab.index + 1});
		});
	});
}

function start(like) {
    musics = new Array();
    liked_or_banned = like;
    var url = "http://douban.fm/mine#!type="+(like?"liked":"banned")+"&start=0";
	chrome.tabs.create({"url" : url}, pageLoaded);
}

chrome.extension.onConnect.addListener(messageListener);

checkFirstTime();

