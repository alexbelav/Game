'use strict';

window.onhashchange = switchToStateFromURLHash;
let SPAState = {};
function switchToStateFromURLHash() {

    window.onbeforeunload = function beforeUserLeave() {
        return false;
    };

    let URLHash = window.location.hash;
    let stateStr = URLHash.substr(1);
    if (stateStr != '') {
        let parts = stateStr.split("_");
        SPAState = { pagename: parts[0] };
    } else {
        SPAState = {pagename:'Menu'};
    }
   
    let pageHTML = "";
    switch (SPAState.pagename) {
        case 'Menu':
            pageHTML += '<div class = "wrapper">';
            pageHTML += '<div class="body__items items-body">';
            pageHTML += '<input type="text" id="text" class="textin" placeholder="Введите имя">'
            pageHTML += '<input type="button" onclick="switchGame()" name="start" value="Играть" id="start" class="btn-animated">';
            pageHTML += '<input type="button" name="records" onclick="switchRecords()" value="Рекорды" id="records" class="btn-animated">';
            pageHTML += '<input type="button" name="rules" onclick="switchRules()" value="Правила" id="rules" class="btn-animated">';
            pageHTML += '</div>';
            pageHTML += '</div>';
            break;

        case 'Rules':
            pageHTML += '<div class="wrapper-rules">';
            pageHTML += '<div class="rules animated-r">Правила игры: </br> <p>Персонаж перемещается по земле и платформам. На карте появлются враги: птицы, пауки. При соприкосновении с ними, игрок погибает, и игра начинается заново. Пауки умирают после того, как игрок на них прыгнул, а птицы - если игрок бьет их снизу.  </br> </br>Движение персонажем:</br> "W" - прыжок</br>"A" - влево</br>"D" - вправо</br></br>Приятной игры!</p></div>';
            pageHTML += '</div>';
            break;

        case 'Records':
            pageHTML += '<div class="wrapper-records">'
            pageHTML += '<div class="records animated-re">';
            pageHTML += '<table class="table">'
            pageHTML += '<thead><tr><th>Имя</th><th>Результат</th></tr></thead><tbody><tr><td>Gloria</td><td>123</td></tr><tr><td>Graham</td><td>12123</td></tr></tbody></table>'
            pageHTML += '</div>';
            pageHTML += '</div>';
            break;
            
            case 'Game':
                pageHTML += '<div class="wrapper-canvas">'
                pageHTML += '<canvas id="screen">';
                pageHTML += '</canvas/>';
                pageHTML += '<button id="fullscreen">FullScreen</button>';
                pageHTML += '</div>';
                break;
    }
    document.querySelector('.wrap').innerHTML = pageHTML;
};

function switchToState(newState) {
    let stateStr = newState.pagename;
    location.hash = stateStr;
}

// function switchMenu() {
// 	switchToState({ pagename: 'Menu' });
// };
function switchGame() {
	switchToState({ pagename: 'Game' });
};
function switchRules() {
	switchToState({ pagename: 'Rules' });
};
function switchRecords() {
	switchToState({ pagename: 'Records' });
};

switchToStateFromURLHash();

//


