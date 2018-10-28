/**
 * Обработка событий
 */

let willBeClicked = document.querySelector(".willBeClicked");
willBeClicked.onclick = function () {
    alert("Кликнули на willBeClicked");
}

function willBeClickedAgain() {
    alert("Кликнули на willBeClicked еще раз");
}

let testInClick = document.querySelector(".testInClick");
testInClick.onclick = function () {
    alert("Кликнули на testInClick");
    willBeClicked.onclick = willBeClickedAgain;
}

//addEventListener и removeEventListener
let firstLi = document.querySelector("ul li:first-child");

//firstLi.removeEventListener("click", firstLiClick);

function firstLiClick() {
    firstLi.removeEventListener("click", firstLiClick);
    firstLi.addEventListener("click", firstLiClick2);
    alert("firstLi clicked first time");
}

function firstLiClick2() {
    firstLi.removeEventListener("click", firstLiClick2);
    firstLi.addEventListener("click", firstLiClick);
    alert("firstLi clicked first time again");
}

firstLi.addEventListener("click", firstLiClick);

/**
 * Слайдер/галерея
 */
let loopInterval;   //Глобальный loop указатель
let loopCount = 1;  //Счетчик смены картинок
let timer = 2000;   //Таймер переключения картинок
let images = document.querySelectorAll(".slider_pics img");

//2 версия с перехватом loopCount
function loopPics(images) {
    changeBigPicture(loopCount, images[loopCount].src);
    loopCount++;
    if (loopCount == images.length) {
        loopCount = 0;
    }
}

function init() {

    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener("click", function () {
            changeBigPicture(i, images[i].src);
        });
    }
    loopInterval = setInterval(loopPics, timer, images);
}

function imageExists(image_url) { //проверка наличия изображений

    let http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

function changeBigPicture(index, src) {

    if (imageExists(src)) {
        let appBigPic = document.getElementById("big_picture");

        appBigPic.src = src;
        loopCount = index;
    }
}

function nextPicture() {
    if (loopInterval)
        clearInterval(loopInterval);

    loopCount++;
    if (loopCount == images.length) {
        loopCount = 0;
    }
    changeBigPicture(loopCount, images[loopCount].src);
}
function prevPicture() {
    if (loopInterval)
        clearInterval(loopInterval);

    loopCount--;
    if (loopCount == -1) {
        loopCount = images.length - 1;
    }
    changeBigPicture(loopCount, images[loopCount].src);
}

document.getElementById("rightArrow").addEventListener("click", nextPicture);
document.getElementById("leftArrow").addEventListener("click", prevPicture);


window.onload = init;