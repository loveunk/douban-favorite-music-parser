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

var keywords = ['Lobby', 'Zendaya', 'Chicago', 'USA vs Belgium', 'Indio Downey', 'Michael Jackson', 'Britney Spears', 'Lady Gaga', 'Katy Perry', 'Taylor Swift',
                'Justin Bieber', 'Enrique Iglesias', 'Beyonce', 'Rihanna', 'Madonna', 'Javascript', 'Java', 'PHP', 'Google', 'Bing',
                'Keke Palmer', 'Olivia Palermo', 'Janice Dickinson', 'Jason Kidd', 'AUBURN', 'Alabama ', 'Leftovers', 'Robin', 'WWE', 'Costa Rica',
                'ALEGRE', 'Motors ', 'Stephen ', 'equation', 'figure', 'Wen', 'Xen', 'phd grind', 'study notes', 'ubuntu',
                'Stack', 'Overflow', 'question', 'answer', 'site', 'professional', 'enthusiast', 'programmers',
                'Life', 'box', 'chocolates', 'never know', 'Forrest', 'Gump', 'Forrest', 'Gump', '1994'];

                
var indexbase = 0;
var index = 0;

function open() {

    var urlstr = "http://m.bing.com/search?q=" + keywords[index + indexbase];

    chrome.tabs.update(null, {url:urlstr});
    
    if (index < 20) {
        setTimeout(open, 2000);
    } else {
        chrome.tabs.update(null, {url:"http://www.bing.com/rewards/dashboard"});
    }

    index++;
}

function buttonClick() {
    indexbase = Math.floor(Math.random() * keywords.length / 2);
    index = 0;
    open();
}

chrome.browserAction.onClicked.addListener(buttonClick);


