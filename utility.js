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