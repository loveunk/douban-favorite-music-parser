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

// global array, stores the music list
var musics;

// maintains the status of music info requests
var request_batch_total = 0;
var request_batch_responded = 0;

// _debug controls whether print log to console
var _debug = false;

// error strings
var _err_str_no_nookie = "未检测到Cookie，是否未登录豆瓣电台？ 请先登录";

function _debug_print(str, val) {
  if (_debug) {
    console.log(str + " = " + val + "\n");
  }
}

function _error_pop(error) {
  chrome.extension.getBackgroundPage().alert(error);
}

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

function formatParams( params ){
  return "?" + Object
    .keys(params)
    .map(function(key){
      return key+"="+encodeURIComponent(params[key])
    })
    .join("&")
}

function parseSongs(json, round) {
  for (var i = 0; i < json.length; ++i) {
    musics.push({
      "musicName" : json[i].title,
      "musicURL"  : json[i].url,
      "sourceName" : json[i].albumtitle,
      "sourceURL" : json[i].release == null ? '#' : json[i].release.link,
      "performer" : json[i].artist,
    });
  }

  ++request_batch_responded;
  _debug_print("round", round);
  _debug_print("request_batch_responded", request_batch_responded);

  if (request_batch_responded != request_batch_total)
    return;

  // all requests have been responded, pop the result page
  chrome.tabs.create({"url" : "result.html"});
}

function getCookies(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
    if(callback) {
      callback(domain, cookie != null ? cookie.value : null);
    }
  });
}

function parseIDs(json, domain, ck_val) {
  musics = [];

  var song_request_batch = 100;
  for (var i = 0, round = 0; round < json.songs.length; round += song_request_batch) {
    request_batch_total++;
  }

  _debug_print("request_batch_total", request_batch_total);

  for (var round = 0; round < json.songs.length; round += song_request_batch) {

    let sids = [];
    for (let i = round; i < round + song_request_batch && i < json.songs.length; ++i) {
      sids.push(json.songs[i].sid);
    }

    let songs_params = {
      sids: sids.join('|'),
      kbps: 192,
      ck: ck_val
    };

    // request songs
    let url = domain + "/j/v2/redheart/songs" + formatParams(songs_params);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let json = JSON.parse(xhr.responseText);
        parseSongs(json, round);
      }
    }
    xhr.send();
  }
}

function detect_domain(callback) {
  var domain = "https://douban.fm";
  getCookies(domain, "ck", function(domain, cookie_val) {
    if (cookie_val != null) {
      callback(domain, cookie_val);
    } else {
      // try another domain
      var domain = "https://fm.douban.com";
      getCookies(domain, "ck", function(domain, cookie_val) {
        if (cookie_val != null) {
          callback(domain, cookie_val);
        } else {
          callback(null, null);
        }
      });
    }
  });
}

function start(like, ck_val) {
  musics = [];
  liked_or_banned = like;


  detect_domain(function (domain, ck_val) {
    if (domain == null || ck_val == null) {
      _error_pop(_err_str_no_nookie);
      return;
    }

    var url = domain + "/j/v2/redheart/basic";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var json = JSON.parse(xhr.responseText);

        if (json == null == json.songs == null || json.songs.length == 0) {
          _error_pop(_err_str_no_nookie);
          return;
        }

        parseIDs(json, domain, ck_val);
      }
    }
    xhr.send();
  });
}

chrome.extension.onConnect.addListener(messageListener);

checkFirstTime();

