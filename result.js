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
  var html  = '';
  
  for (var i = 0; i < musics.length; ++i) {
    html += musics[i].musicName+'\t';
    html += musics[i].sourceName+'\t';
    html += musics[i].performer+'\t';
    html += '\n';
  }
  
  //height=250, width=250,
  var popup = window.open("", "newwin", "toolbar=no,scrollbars=yes,menubar=no");
  popup.document.write("<html>");
  popup.document.write("<head>");
  popup.document.write("<title>请复制<\/title>");
  popup.document.write("<style type='text\/css' title='currentStyle'>@import \"main.css\";<\/style>");
  popup.document.write("<script type='text\/javascript' language='javascript' src='utility.js'><\/script>");
  popup.document.write("<\/head>");
  popup.document.write("<body");
  popup.document.write("<p>请复制下面的内容，之后导出到Excel或者记事本等文本编辑器中<\/p>");
  popup.document.write("<textarea id='music_data' style='width:100%; height:90%;'>" + html + "<\/textarea>");
  popup.document.write("<\/body>");
  popup.document.write("<\/html>"); 
  popup.document.close();
}

document.addEventListener('DOMContentLoaded', function () {
  onPageLoaded();
  document.querySelector('#chooseColBtn').addEventListener('click', fnShowHide);
  document.querySelector('#popResultBtn').addEventListener('click', popResult);
});

