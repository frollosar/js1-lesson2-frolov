const FIELD_SIZE_X = 22;    //Размер поля по оси Х
const FIELD_SIZE_Y = 17;    //Размер поля по оси Y

let gameIsRunning = false;  //Игра на старте не запущена

let snake = []; //Сама змейка
let snakeSpeed = 500;   //Скорость движения змейки
let snakeDirection = "y+";  //Текущее направление змейки
let snakeTimer; //Таймер змейки

let foodTimer;  //Таймер еды
let poisonTimer;  //Таймер препятствий
let foodCreationSpeed = 1000;   //Скорость появления еды / препятствий
let poisonRemoveSpeed = 4000;   //Скорость появления еды / препятствий
let numberOfFood = [3, 0];  //Количество еды. 0 элемент-макс количество, 1 элемент - количество на поле
let numberOfPoison = [3, 0, []];  //Количество препятствий. 0 элемент-макс количество, 1 элемент - количество на поле, 3 - список координат препятствий

let score = 0;  //Очки

/**
 * Инициализация игрового пространства
 */
function init() {
    prepareGameField();

    //Обработчики на кнопки Старт и Новая игра
    document.getElementById("snake_start").addEventListener("click", startGame);
    document.getElementById("snake_renew").addEventListener("click", renewGame);

    //Событие-прослушка клавиатуры
    addEventListener("keydown", changeSnakeDirection);
}

/**
 * Функция подготовки игрового поля
 */
function prepareGameField() {
    let gameTable = document.createElement("table");
    gameTable.setAttribute("class", "game-table");

    //Цикл генерирующий ячейки игрового поля
    for (let y = 0; y < FIELD_SIZE_Y; y++) {
        let row = document.createElement("tr");
        row.setAttribute("class", "game-table-row row-" + y);

        for (let x = 0; x < FIELD_SIZE_X; x++) {
            let cell = document.createElement("td");
            cell.setAttribute("class", "game-table-cell cell-" + x + "-" + y);

            row.appendChild(cell);
        }

        gameTable.appendChild(row);
    }

    document.getElementById("snake_field").appendChild(gameTable);
}

/**
 * Генерация змейки
 * Змейка будет состоять из двух элементов (два блока - голова и туловище)
 * Змейка по центру
 * Класс ячейки змейки - snake-unit
 */
function respawn() {
    let startCoordX = Math.floor(FIELD_SIZE_X / 2);
    let startCoordY = Math.floor(FIELD_SIZE_Y / 2);

    let snakeHead = document.getElementsByClassName("cell-" + startCoordX + "-" + startCoordY)[0];
    let prevSnakeHeadAttr = snakeHead.getAttribute("class");
    snakeHead.setAttribute("class", prevSnakeHeadAttr + " snake-unit");

    let snakeTail = document.getElementsByClassName("cell-" + startCoordX + "-" + (startCoordY - 1))[0];
    let prevSnakeTailAttr = snakeTail.getAttribute("class");
    snakeTail.setAttribute("class", prevSnakeTailAttr + " snake-unit");

    //Добавляем в массив ссылки на ячейки хвоста и головы
    snake.push(snakeTail);
    snake.push(snakeHead);
}

function moveSnake() {
    if (gameIsRunning == true) {
        //Соберем классы головы змейки
        let snakeHeadClasses = snake[snake.length - 1].getAttribute("class").split(" ");
        //console.log(snakeHeadClasses);
        //Сдвигаем голову на 1
        let newUnit;    //Переменная новой ячейки для головы
        let snakeCoords = snakeHeadClasses[1].split("-");
        //console.log(snakeCoords);
        let coordX = parseInt(snakeCoords[1]);
        let coordY = parseInt(snakeCoords[2]);

        if (snakeDirection == "y+") {
            newUnit = document.getElementsByClassName("cell-" + coordX + "-" + (coordY + 1))[0];
        } else if (snakeDirection == "y-") {
            newUnit = document.getElementsByClassName("cell-" + coordX + "-" + (coordY - 1))[0];
        } else if (snakeDirection == "x-") {
            newUnit = document.getElementsByClassName("cell-" + (coordX - 1) + "-" + coordY)[0];
        } else if (snakeDirection == "x+") {
            newUnit = document.getElementsByClassName("cell-" + (coordX + 1) + "-" + coordY)[0];
        }

        //проверяем, что newUnit - это не часть змейки
        //также проверяем, что змейка не дошла до границы
        if (!isSnakeUnit(newUnit) && newUnit != undefined && !havePoison(newUnit)) {
            //Добавляем новую часть змейки
            newUnit.setAttribute("class", newUnit.getAttribute("class") + " snake-unit");
            snake.push(newUnit);

            //если змейка не ела, подчищаем хвост
            if (!haveFood(newUnit)) {
                let removeSnake = snake.splice(0, 1)[0];    //Находим удаляемый элемент
                let classes = removeSnake.getAttribute("class").split(" ");
                //удаление маркирующего класса snake-unit
                removeSnake.setAttribute("class", classes[0] + " " + classes[1]);
            } else {
                numberOfFood[1]--;
            }
        } else {
            finishTheGame();
        }
    }
}

/**
 * Проверяем элемент на принадлежность змейке
 * @param array unit
 */
function isSnakeUnit(unit) {
    let check = false;

    if (snake.includes(unit)) {
        check = true;
    }

    return check;
}

/**
 * Функция размещения еды на поле
 */
function createFood() {
    let array = numberOfFood;

    if (array[1] < array[0]) {
        let foodCreated = false;
        while (!foodCreated) {
            //Выбираем случайную клетку
            let foodX = Math.floor(Math.random() * (FIELD_SIZE_X));
            let foodY = Math.floor(Math.random() * (FIELD_SIZE_Y));

            let foodCell = document.getElementsByClassName("cell-" + foodX + "-" + foodY)[0];
            let foodCellClasses = foodCell.getAttribute("class").split(" ");

            //Если тут нет змейки, то размещаем еду
            if (!foodCellClasses.includes("snake-unit") && !foodCellClasses.includes("food-unit") && !foodCellClasses.includes("poison-unit")) {
                //ставим в выбранную ячейку едук
                foodCell.setAttribute("class", foodCellClasses.join(" ") + " food-unit");
                foodCreated = true;
                array[1]++;
            }
        }
    }
}

/*
* Функция размещения препятствий
* */
function createPoison() {
    let array = numberOfPoison;

    if (array[1] < array[0]) {
        let foodCreated = false;
        while (!foodCreated) {
            //Выбираем случайную клетку
            let foodX = Math.floor(Math.random() * (FIELD_SIZE_X));
            let foodY = Math.floor(Math.random() * (FIELD_SIZE_Y));

            let foodCell = document.getElementsByClassName("cell-" + foodX + "-" + foodY)[0];
            let foodCellClasses = foodCell.getAttribute("class").split(" ");

            //Если тут нет змейки, то размещаем еду
            if (!foodCellClasses.includes("snake-unit") && !foodCellClasses.includes("food-unit") && !foodCellClasses.includes("poison-unit")) {
                //ставим в выбранную ячейку едук
                foodCell.setAttribute("class", foodCellClasses.join(" ") + " poison-unit");
                foodCreated = true;
                array[1]++;
                array[2].push([foodX, foodY])
            }
        }
    }
}

function removePoison() {
    if (numberOfPoison[2].length > 0) {
        let cellCoords = numberOfPoison[2].shift();
        let unit = document.getElementsByClassName("cell-" + cellCoords[0] + "-" + cellCoords[1])[0];
        let unitClasses = unit.getAttribute("class").split(" ");
        unit.setAttribute("class", unitClasses[0] + " " + unitClasses[1] + " " + unitClasses[3]);
        numberOfPoison[1]--;
    }
}

/**
 * Проверяем встречу с едой
 */
function haveFood(unit) {
    let check = false;

    let unitClasses = unit.getAttribute("class").split(" ");

    //змейка нашла еду
    if (unitClasses.includes("food-unit")) {
        check = true;

        unit.setAttribute("class", unitClasses[0] + " " + unitClasses[1] + " " + unitClasses[3]);

        //создаём новую еду
        createFood();

        //увеличиваем очки
        score++;
        document.getElementById('snake_score').innerText = score;
    }

    return check;
}

/**
 * Проверяем встречу с препятствием
 */
function havePoison(unit) {
    let unitClasses = unit.getAttribute("class").split(" ");

    return unitClasses.includes("poison-unit");
}

function changeSnakeDirection(e) {
    //console.log(e.keyCode);
    switch (e.keyCode) {
        case 38:    //Если нажата клавиша вверх
            if (snakeDirection != "y+") {
                snakeDirection = "y-";
            }
            break;
        case 39:    //Если нажата клавиша вправо
            if (snakeDirection != "x-") {
                snakeDirection = "x+";
            }
            break;
        case 40:    //Если нажата клавиша вниз
            if (snakeDirection != "y-") {
                snakeDirection = "y+";
            }
            break;
        case 37:    //Если нажата клавиша влево
            if (snakeDirection != "x+") {
                snakeDirection = "x-";
            }
            break;
    }
}

/**
 * Старт игры
 */
function startGame() {
    gameIsRunning = true;
    respawn();

    snakeTimer = setInterval(moveSnake, snakeSpeed);
    foodTimer = setInterval(createFood, foodCreationSpeed);
    poisonTimer = setInterval(createPoison, foodCreationSpeed);
    poisonRemoveTimer = setInterval(removePoison, poisonRemoveSpeed);
}

/**
 * Перезагрузки игры
 * */
function renewGame() {
    location.reload();
}

/**
 * Информация об остановке игры
 */
function finishTheGame() {
    gameIsRunning = false;

    alert("Игра окончена!");
}

window.onload = init;