
import ResultStatusObj from '../Enums/ResultStatusEnum.js';

const CarSpeedAnalogMeterDomWorker = class CarSpeedAnalogMeterDomWorker {

    "use strict"

    analogCarSpeedArrow = document.getElementById("analogCarSpeedArrow");

    constructor() {}

    display(incommingAngle) {

        this.analogCarSpeedArrow.style.transform = `rotate(${incommingAngle}deg)`;
    }

    set setInitialArrowOffset(incommingAngle) {

        this.analogCarSpeedArrow.style.transform = `rotate(${incommingAngle}deg)`;
    }
}

export default CarSpeedAnalogMeterDomWorker;