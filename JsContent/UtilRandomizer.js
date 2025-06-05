export default function getRandomInteger(min, max) {

    //min = Math.ceil(min);
    //max = Math.floor(max);

    let tempNumber = (Math.random() * (max - min)) + min;

    tempNumber = Math.round(tempNumber);

    return tempNumber;
}