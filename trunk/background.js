/*
used to control the main flow of parsing

Copyright (C) 2013 QI Wen <qiwen@qiwen.name>

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

var nextStartNum = 0;
var likeNum = 0;
var started = false;
var parseStart = 0;

var musics = new Array();

function resetDate(startOrNot) {
  nextStartNum = 0;
  likeNum = 0;
  parseStart = 0;
  started = startOrNot;
}

function addMore(startFrom, musicsJson) {
  var len = musics.length;
  for (var i = 0; i < musicsJson.length; ++i) {
    var music = new Array();
    /*"musicName" : musicName[0].innerText,
    "sourceURL" : sourceURL,
    "sourceName": sourceName,
    "performer" : performer[0].innerText*/
    music[0] = musicsJson[i].musicName;
    music[1] = musicsJson[i].sourceURL;
    music[2] = musicsJson[i].sourceName;
    music[3] = musicsJson[i].performer;
    musics[len + i] = music;
  }
  
  nextStartNum = startFrom + musicsJson.length;
  
  if (nextStartNum >= likeNum) {
    nextStartNum = -1;
  }
}

function showNotification(t, b) {
  if (webkitNotifications.checkPermission() > 0) {
    webkitNotifications.requestPermission();
  }
  var notification = webkitNotifications.createNotification('douban.png', t, b);
  notification.show();
}

function testPageLoaded() {
  var url = "http://douban.fm/mine#!type=liked&start=15";
  var pattern = /^http:\/\/douban\.fm\/mine\#\!type=liked&start=[0-9]+$/;
  if (url.match(pattern)) {
    var parseStartStr = url.match(/[0-9]+/);
    alert(parseStartStr);
  }
}

// http://douban.fm/mine#!type=liked&start=0
function pageLoaded(tab) {
  if (started) {
    var pattern = /^http:\/\/douban\.fm\/mine\#\!type=liked&start=[0-9]+$/;
    if (tab.url.match(pattern) && nextStartNum >= 0) {
      var parseStartStr = tab.url.match(/[0-9]+/);
      if (parseStartStr && parseStartStr.length > 0) {
        parseStart = new Number(parseStartStr[0]);
      }
      chrome.tabs.executeScript(tab.id, {file:'douban.js'});
    }
  }
}

function messageListener(port) {
  var tab = port.sender.tab;
  port.onMessage.addListener(function(info) {
    if (likeNum == 0) { // init Like number
      var numStr = info.totalLike.match(/[0-9]+/);
      if (numStr && numStr.length > 0) {
        likeNum = new Number(numStr[0]);
      }
      if (numStr == null || numStr.length == 0 || likeNum == 0) {
          //showNotification("Error", info.totalLike + " 您好像没有登录豆瓣电台呀... :(");
          //chrome.tabs.create({"url":"http://www.douban.com/accounts/login?source=radio&uid=&error=requiredemail"});
      }
    }
    // showNotification(parseStart + " " + likeNum, info.musics);
    parseHtml(tab, info.musics);
  });
}

function parseHtml(tab, pageMusics) { // it's callback of background parser script
  
  addMore(parseStart, pageMusics);

  if (nextStartNum >= 0) {
    chrome.tabs.remove(tab.id, function(){
      chrome.tabs.create({"url":"http://douban.fm/mine#!type=liked&start=" + nextStartNum});
    });
  } else {
    resetDate(false);
    chrome.tabs.remove(tab.id, function(){
        chrome.tabs.create({"url":"result.html"});
    });
  }
}

function checkFirstTime() {
  if (localStorage["_douban_music_parser_firstTime"] == undefined) {
  localStorage["_douban_music_parser_firstTime"] = ":]";
  openOptions(true);
  return true;
  }
  return false;
}

function openOptions(firstTime) {
  var url = "thanks_page.html";

  var fullUrl = chrome.extension.getURL(url);
  chrome.tabs.getAllInWindow(null, function(tabs) {
    for (var i in tabs) { // check if Options page is open already
      var tab = tabs[i];
      if (tab.url == fullUrl) {
        chrome.tabs.update(tab.id, { selected: true }); // select the tab
        return;
      }
    }
    chrome.tabs.getSelected(null, function(tab) { // open a new tab next to currently selected tab
      chrome.tabs.create({
        url: url,
        index: tab.index + 1
      });
    });
  });
}

chrome.extension.onConnect.addListener(messageListener);
chrome.tabs.onCreated.addListener(pageLoaded);

checkFirstTime();
