
const CarSpeedAnalogMeterCalculator = class CarSpeedAnalogMeterCalculator {

    /*--analogMetersFullScaleDegrees: 270;  analogCarSpeedArrow */
    
        //this.MAX_CAR_SPEED, this.KILOMETERS_PER_BAR = 0, this.TOTAL_NUMBER_OF_BARS = 22;
    #CarSpeedAnalogMeterDomWorkerObj;
   
    constructor(CarSpeedAnalogMeterDomWorkerArg) {

        this.#CarSpeedAnalogMeterDomWorkerObj = CarSpeedAnalogMeterDomWorkerArg;

        this.calculatedAngle = 0;

        this.MAX_CAR_SPEED, this.KILOMETERS_PER_DEGREE = 0
            , this.TOTAL_NUMBER_OF_DEGREES = (270 - 1.9) // 1.9 is some appearence adjastment
            , this.INITIAL_ARROW_OFFESET = 0;
    }

    shutDown() {

        this.displaySpeed(0);
    }

    displaySpeed(intIncomingCarSpeed) {


        this.calculatedAngle = intIncomingCarSpeed * this.DEGREES_PER_KILOMETER;

        this.calculatedAngle = this.INITIAL_ARROW_OFFESET + this.calculatedAngle;

        this.#CarSpeedAnalogMeterDomWorkerObj.display(this.calculatedAngle)
    }

    setInitialArrowOffset() {

        this.INITIAL_ARROW_OFFESET = (this.TOTAL_NUMBER_OF_DEGREES / 2);

        this.INITIAL_ARROW_OFFESET = this.INITIAL_ARROW_OFFESET - 1;

        this.INITIAL_ARROW_OFFESET = -this.INITIAL_ARROW_OFFESET;
    }

    get getInitialArrowOffset() {

        return this.INITIAL_ARROW_OFFESET;
    }

    set setMaxCarSpeed(maxCarSpeed) {

        this.MAX_CAR_SPEED = maxCarSpeed;
    }

    setDegreesPerKilometer() {

        this.DEGREES_PER_KILOMETER = this.TOTAL_NUMBER_OF_DEGREES / this.MAX_CAR_SPEED;
    }
}

export default CarSpeedAnalogMeterCalculator;