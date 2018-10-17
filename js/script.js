// Задание 1

function exerciseOne() {
    console.log("Задание 1");
    let i = 0;
    while (i <= 100) {
        let d = 2;
        let divied = false;
        while (d < i) {
            if (i % d === 0) {
                divied = true;
                break;
            }
            d++;
        }
        if (!divied) {
            console.log(i);
        }
        i++;
    }
}

exerciseOne();

//Задание 2

function exerciseTwo() {
    console.log("Задание 2");
    console.log("0 - это ноль");
    let i = 1;
    do {
        if (i % 2 === 0)
            console.log(i + " - это четное число");
        else
            console.log(i + " - это нечетное число");
        i++;
    } while (i <= 10)
}

exerciseTwo();

//Задание 3

function exerciseTree() {
    console.log("Задание 3");
    for(let i = 0; i<=9; console.log(i++)){}
}

exerciseTree();

//Задание 5


//Задание 6

/*

let exercise = prompt("Введите номер задания: 1, 2, 3, 4"); //спрашивает какую операцию провести

switch (exercise) { //Выводит результат в зависимости от запрашиваемой операции
    case 1:
        console.log(exerciseOne());
        break;
    case 2:
        console.log(exercise2());
        break;
    case 3:
        console.log(exercise3());
        break;
    case 4:
        console.log(exercise4());
        break;
    default :
        console.log("Введите значение из списка")
}

*/