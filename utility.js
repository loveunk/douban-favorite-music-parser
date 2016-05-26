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

// UTF8.encode(s): Converts from ANSI to UTF-8
// UTF8.decode(s): Converts from UTF-8 to ANSI
UTF8 = {
    encode: function(s){
        for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
            s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
        );
        return s.join("");
    },
    decode: function(s){
        for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
            ((a = s[i][c](0)) & 0x80) &&
            (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
            o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
        );
        return s.join("");
    }
};
