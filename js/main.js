/*
 js code for main.html
 
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

function grab_liked() {
	var backg = chrome.extension.getBackgroundPage();
  document.getElementById("liked").value = "开始努力工作中...(勿刷新)";
  document.getElementById("liked").disabled = true;
	backg.start(true);
}

function grab_banned() {
	var backg = chrome.extension.getBackgroundPage();
	backg.start(false);
}

document.getElementById("liked").onclick = grab_liked;
document.getElementById("liked").disabled = false;
// document.getElementById("banned").onclick = grab_banned;
