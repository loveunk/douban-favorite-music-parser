/*
 utility js code
 
 Copyright (C) 2012  QI Wen <qiwen@qiwen.name>
 
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

// select the content of specified element id
function selectElementContents(id) {
  var el = document.getElementById(id);
  var body = document.body, range, sel;
  if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(el);
      range.select();
  } else if (document.createRange && window.getSelection) {
      range = document.createRange();
      range.selectNodeContents(el);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  }
}

// show or hide div
function showDiv(div_name, show) {
  if (show) {
    document.getElementById(div_name).style.visibility="visible";
    document.getElementById(div_name).style.display="";
  } else {
    document.getElementById(div_name).style.visibility="hidden";
    document.getElementById(div_name).style.display="none";
  }
}