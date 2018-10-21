// Задание 1 // Запись числа в объект сотни-десятки-единицы

function exerciseOne() {
    console.log("Задание 1");
    let i = prompt("Введите значение от 0 до 999");
    function divide(k) {
        parseInt(k);
        let division;
        if(k > 999 || k < 0){
            console.log("Число превышает 999: ");
            return division = {};
        }
        let x = (k - k % 100) / 100; // сотни
        let y = (k % 100 - k % 10) / 10; // десятки
        let z = k % 10; // единицы
        return division = {"сотни" : x, "десятки" : y, "единицы" : z};
            }
    let result = divide(i);

    console.log(result);
}

exerciseOne();

console.log("");

//Задание 2

function exerciseTwo() {
    console.log("Задание 2");

    let goods={
        1 :{name: 'Товар 1',  cost: 100, description: 'Крутой товар'},
        2: {name: 'Товар 2',  cost: 150, description: 'Крутой товар 2'}
    };

    let basket=[
        {good_id: 1, count: 2},
        {good_id: 2, count: 1},
    ];

    let getBasketPrice=function(){
        let _bsk = basket.slice();
        let item, sum=0;
        console.log("Товары в корзине: ");

        while (item=_bsk.shift()){
            let good = goods[item.good_id];

            console.log(good.name+" стоимостью "+good.cost+"р. - "+item.count+" шт.");
            sum+= good.cost * item.count
        }


        return sum;
    };

    console.log("Итого: "+getBasketPrice()+"р.");
}

exerciseTwo();