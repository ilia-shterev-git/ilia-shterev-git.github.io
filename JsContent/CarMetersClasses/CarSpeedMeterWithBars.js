

import ResultStatusObj from '../Enums/ResultStatusEnum.js';

const CarSpeedMeterWithBarsCalculator = class CarSpeedMeterWithBarsCalculator {

    "use strict"

    #CarSpeedMeterWithBarsDomWorkerObj

    constructor(CarSpeedMeterWithBarsDomWorkerArgs) {

        this.#CarSpeedMeterWithBarsDomWorkerObj = CarSpeedMeterWithBarsDomWorkerArgs;

        this.MAX_CAR_SPEED, this.KILOMETERS_PER_BAR = 0, this.TOTAL_NUMBER_OF_BARS = 22;

        this.LEVEL_STRING = "Level";

        this.intCurrentBarsLevel = -1, this.prevBarsLevel = 0,
            this.calculatedBarsNumber = 0, this.prevResultBarsNumber = 0;
    }

    shutDown() {

        this.displaySpeed(0);

        this.intCurrentBarsLevel = -1, this.prevBarsLevel = 0,
            this.calculatedBarsNumber = 0, this.prevResultBarsNumber = 0;
    }

    displaySpeed(incomingCarSpeed) {

        if ((incomingCarSpeed > this.KILOMETERS_PER_BAR) && (incomingCarSpeed <= this.MAX_CAR_SPEED))
            this.intCurrentBarsLevel = Math.round(incomingCarSpeed / this.KILOMETERS_PER_BAR);

        else if ((incomingCarSpeed > 0) && (incomingCarSpeed <= this.KILOMETERS_PER_BAR))
            this.intCurrentBarsLevel = 1;

        else if (incomingCarSpeed === 0)
            this.intCurrentBarsLevel = 0;

        else if (incomingCarSpeed > this.MAX_CAR_SPEED)
            this.intCurrentBarsLevel = this.TOTAL_NUMBER_OF_BARS;     

        if (this.intCurrentBarsLevel === this.prevBarsLevel)
            return ResultStatusObj.NoChange;

        this.calculatedBarsNumber = (this.intCurrentBarsLevel - this.prevBarsLevel);

        this.prevBarsLevel = this.intCurrentBarsLevel;

        //return this.calculatedBarsNumber;

        this.#CarSpeedMeterWithBarsDomWorkerObj.display(this.calculatedBarsNumber);
    }

    setTotalNumberOfBarsForDomWorker() {

        this.#CarSpeedMeterWithBarsDomWorkerObj.setTotalNumberOfBars = this.TOTAL_NUMBER_OF_BARS;
    }

    get getTotalNumberOfBars() {

        return this.TOTAL_NUMBER_OF_BARS;
    }

    set setMaxCarSpeed(maxCarSpeed) {

        this.MAX_CAR_SPEED = maxCarSpeed;
    }

    setKilometersPerBar() {

        this.KILOMETERS_PER_BAR = this.MAX_CAR_SPEED / this.TOTAL_NUMBER_OF_BARS;
    }
}

export default CarSpeedMeterWithBarsCalculator;