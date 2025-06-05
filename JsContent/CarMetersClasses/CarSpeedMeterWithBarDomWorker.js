
import ResultStatusObj from '../Enums/ResultStatusEnum.js';

const CarSpeedMeterWithBarsDomWorker = class CarSpeedMeterWithBarsDomWorker {

    "use strict"

    carSpeedBarsMeter = document.getElementById("carSpeedBarsMeter");

    constructor() {

        this.LEVEL_STRING = "Level"; this.intCurrentBarsLevel = 0; this.prevBarsLevel = 0;

        this.tempVar = 0;

        this.tempDiv; this.tempLevelString;

        this.BAR_MAIN_UNIT_CSS_CLASS = "bar-main-unit";
    }

    display(incomingBarsNumber) {

        if (incomingBarsNumber === ResultStatusObj.NoChange)
            return;

        this.intCurrentBarsLevel = this.prevBarsLevel + incomingBarsNumber;

        if (incomingBarsNumber > 0) {

            this.#addBars(incomingBarsNumber, this.intCurrentBarsLevel, this.prevBarsLevel);
        }
        else if (incomingBarsNumber < 0) {

            this.#removeBars(incomingBarsNumber, this.intCurrentBarsLevel, this.prevBarsLevel);
        }
        else if (incomingBarsNumber === 0) {

            this.#removeAllBars();
        }

        this.prevBarsLevel = this.intCurrentBarsLevel;

        this.intCurrentBarsLevel = 0;
    }

    #removeAllBars() {

        while (carSpeedBarsMeter.hasChildNodes()) {
            carSpeedBarsMeter.removeChild(carSpeedBarsMeter.lastChild);
        }
    }

    #addBars(incomingBarsNumber, intCurrentBarsLevel, prevBarsLevel) {

        if (incomingBarsNumber === 1) {

            this.#addOneBarToDom(intCurrentBarsLevel);
        }
        else if (incomingBarsNumber > 1) {

            do {

                prevBarsLevel = prevBarsLevel + 1;

                this.#addOneBarToDom(prevBarsLevel);

            } while (prevBarsLevel < intCurrentBarsLevel);
        }
    }

    #addOneBarToDom(currentBarsLevel) {

        this.tempLevelString = this.LEVEL_STRING + currentBarsLevel.toString();

        this.tempDiv = document.createElement("div");

        this.tempDiv.id = this.tempLevelString;

        this.tempDiv.classList.add("bar-main-unit", "good-range-color");

        carSpeedBarsMeter.appendChild(this.tempDiv);
    }

    #removeBars(incomingBarsNumber, currentBarsLevel, prevBarsLevel) {

        if (incomingBarsNumber === (-1)) {

            this.#removeOneBarFromDom(prevBarsLevel);
        }
        else if (incomingBarsNumber < (-1)) {

            do {

                this.#removeOneBarFromDom(prevBarsLevel);

                prevBarsLevel = prevBarsLevel - 1;

            } while (prevBarsLevel > currentBarsLevel);
        }
    }

    #removeOneBarFromDom(currentBarsLevel) {

        //this.tempLevelString = this.LEVEL_STRING + currentBarsLevel.toString();

        //this.tempDiv = document.getElementById(this.tempLevelString);

        //if (carSpeedBarsMeter.hasChildNodes()) {

        //    carSpeedBarsMeter.removeChild(this.tempDiv);
        //}

        // Using the line
        carSpeedBarsMeter.removeChild(carSpeedBarsMeter.firstChild);
    }

    set setTotalNumberOfBars(totalNumberOfBars) {

        this.TOTAL_NUMBER_OF_BARS = totalNumberOfBars;
    }
}

export default CarSpeedMeterWithBarsDomWorker;