/*
 js code for main.html
 
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

function openDouban() {
  chrome.extension.getBackgroundPage().musics = null;
  chrome.extension.getBackgroundPage().musics = new Array();
  chrome.extension.getBackgroundPage().resetDate(true);
  chrome.tabs.create({"url":"http://douban.fm/mine#!type=liked&start=0", "selected":true});
}

function clickHandler(e) {
  openDouban();
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('input').addEventListener('click', clickHandler);
});
