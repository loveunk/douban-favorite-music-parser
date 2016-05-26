/*
 js code for result.html
 
 Copyright (C) 2013  QI Wen <qiwen@qiwen.name>
 
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

function getFullResult() {
  var musics = chrome.extension.getBackgroundPage().musics;
  var html  = '';
  
  for (var i = 0; i < musics.length; ++i) {
    html += '<tr><td>'+musics[i].musicName+'</td>';
    html += '<td><a href="'+musics[i].sourceURL+'">'+musics[i].sourceName+'</a></td>';
    html += '<td>'+musics[i].performer+'</td>';
    html += '</tr>';
  }
  document.getElementById("table_result").innerHTML = html;
}

function onPageLoaded() {
  var musics = chrome.extension.getBackgroundPage().musics;

  if (musics.length == 0) {
    showDiv("succ", false);
    showDiv("fail", true);
  }
  else {
    document.getElementById("music_num").innerHTML = musics.length;
    showDiv("succ", true);
    showDiv("fail", false);
  }

  // show full result by default
  getFullResult();
  
  $("#result").dataTable({
    "bPaginate": false,
    "bAutoWidth": false,
    "bFilter": false,
    "bInfo": false,
    "aaSorting": [
      [2, "asc"]
    ]
  });
}

function fnShowHide() {
  /* Get the DataTables object again - this is not a recreation, just a get of the object */
  var oTable = $("#result").dataTable();
  
  if ($("#chooseCol").attr('value') == "仅歌曲名") {
    $("#chooseCol").attr('value', "所有内容");
  } else {
    $("#chooseCol").attr('value', "仅歌曲名");
  }
  oTable.fnSetColumnVis( 1, oTable.fnSettings().aoColumns[1].bVisible ? false : true );
  oTable.fnSetColumnVis( 2, oTable.fnSettings().aoColumns[2].bVisible ? false : true );
}

function popResult() {
    var musics = chrome.extension.getBackgroundPage().musics;
  var text  = '';
  
  for (var i = 0; i < musics.length; ++i) {
    text += musics[i].musicName+'\t';
    text += musics[i].sourceName+'\t';
    text += musics[i].performer+'\t';
    text += '\n';
  }
  var blob = new Blob([text], {type: "text/plain;charset=GBK"});
  saveAs(blob, "musicList.txt");
  
  //height=250, width=250,
  //var popup = window.open("", "newwin", "toolbar=no,scrollbars=yes,menubar=no");
  //popup.document.write("<text>");
  //popup.document.write("<head>");
  //popup.document.write("<title>请复制<\/title>");
  //popup.document.write("<style type='text\/css' title='currentStyle'>@import \"main.css\";<\/style>");
  //popup.document.write("<script type='text\/javascript' language='javascript' src='utility.js'><\/script>");
  //popup.document.write("<\/head>");
  //popup.document.write("<body");
  //popup.document.write("<p>请复制下面的内容，之后导出到Excel或者记事本等文本编辑器中<\/p>");
  //popup.document.write("<textarea id='music_data' style='width:100%; height:90%;'>" + text + "<\/textarea>");
  //popup.document.write("<\/body>");
  //popup.document.write("<\/text>"); 
  //popup.document.close();
}

function saveForWangYiYun() {
  var musics = chrome.extension.getBackgroundPage().musics;
  var text  = '<so>\n';

  for (var i = 0; i < musics.length; ++i) {
    text += '    <so name="';
    text += musics[i].musicName;
    text += '" artist="';
    text += musics[i].performer;
    text += '"></so>\n';
  }
  text += '</so>';

  // 
  var popup = window.open("", "newwin", "toolbar=no,scrollbars=yes,menubar=no");
  popup.document.write("<html>");
  popup.document.write("<head>");
  popup.document.write("<title>请复制<\/title>");
  popup.document.write("<style type='text\/css' title='currentStyle'>@import \"main.css\";<\/style>");
  popup.document.write("<script type='text\/javascript' language='javascript' src='utility.js'><\/script>");
  popup.document.write("<\/head>");
  popup.document.write("<body");
  popup.document.write("<p>1. 复制下面的内容，保存为“酷我音乐列表文件”，文件名以.kwl结尾，例如“musicList.kwl”<\/p>");
  popup.document.write("<p>** 注意：酷我音乐列表目前采用的是GB2322编码格式，Windows下采用“记事本”保存测试可以，其他平台注意转换编码<\/p>");
  popup.document.write("<p>2. 在网易云音乐“导入歌单”界面，点选“导入酷我播放列表”，再选择刚刚保存的“musicList.kwl”<\/p>");
  popup.document.write("<textarea id='music_data' style='width:100%; height:90%;'>" + text + "<\/textarea>");
  popup.document.write("<\/body>");
  popup.document.write("<\/html>"); 
  popup.document.close();
  
  // TODO: use blob to download the music file list. UTF-8 --> GB2322. Since kwl file is encoded with GB2322
  //var uint8array = new TextEncoder('utf-8').encode(text);
  //var string = UTF8.decode(); //new TextDecoder('GB2322').decode(uint8array);
  //var blob = new Blob([string], {type: "text/plain;charset=GB2322"});
  //saveAs(blob, "2.kwl");
}

document.addEventListener('DOMContentLoaded', function () {
  onPageLoaded();
  document.querySelector('#chooseColBtn').addEventListener('click', fnShowHide);
  document.querySelector('#popResultBtn').addEventListener('click', popResult);
  document.querySelector('#forWangYiYunBtn').addEventListener('click', saveForWangYiYun);
});

