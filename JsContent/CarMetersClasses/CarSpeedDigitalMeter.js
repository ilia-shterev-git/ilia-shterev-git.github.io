
const CarSpeedDigitalMeter = class CarEngineSpeedDigitalMeter {

    "use strict";

    baseCssClass = "display-numb-";
    tempCssClass = "";

    carSpeedMeterOnesDigit = document.getElementById("carSpeedMeterOnesDigit");
    carSpeedMeterTensDigit = document.getElementById("carSpeedMeterTensDigit");
    carSpeedMeterHundredsDigit = document.getElementById("carSpeedMeterHundredsDigit");

    arrayAllDigits = new Array();
    arraySpeedDigits = new Array();

    constructor() {

        this.arrayAllDigits.unshift(carSpeedMeterHundredsDigit
            , carSpeedMeterTensDigit
            , carSpeedMeterOnesDigit);

        this.arrSpeedDigitsLength = 0;
        this.speedToString = "";
        this.arrSpeedDigitsUpperLimit = 0;
        this.arrSpeedDigitsDownLimit = 0;
        this.forIndex = 0;

        this.prevEngineSpeed = -1;

        this.arrSpeedDigitsUpperLimit = this.arrayAllDigits.length - 1;

        /// making it globally available
        const DYSPLAY_NONE_PART_CLASS = "None";
        this.DYSPLAY_NONE_PART_CLASS = DYSPLAY_NONE_PART_CLASS;

        const DISPLAY_NONE_CLASS = "display-numb-None"
        this.DISPLAY_NONE_CLASS = DISPLAY_NONE_CLASS;

        this.intIncomingEngineSpeed = 0;
    }

    shutDown() {

        for (this.forIndex = 0; this.forIndex < this.arrayAllDigits.length; this.forIndex++) {

            this.arrayAllDigits[this.forIndex].className = this.DISPLAY_NONE_CLASS;
        }

        this.prevEngineSpeed = -1;
    }

    displaySpeed(incomingCarSpeed) {

        this.intIncomingEngineSpeed = Math.round(incomingCarSpeed);

        // No need to re-display eng. speed if it is the same as previuos. 
        if ((this.prevEngineSpeed === this.intIncomingEngineSpeed) || (this.intIncomingEngineSpeed < 0))
            return;

        this.prevEngineSpeed = this.intIncomingEngineSpeed;

        this.speedToString = this.intIncomingEngineSpeed.toString();

        this.arraySpeedDigits = this.speedToString.split("");

        if (this.intIncomingEngineSpeed < 100) {

            this.arrSpeedDigitsLength = this.arraySpeedDigits.length;
            this.arrSpeedDigitsDownLimit = this.arrayAllDigits.length - this.arrSpeedDigitsLength;

            for (this.forIndex = 0; this.forIndex < this.arrSpeedDigitsDownLimit; this.forIndex++) {

                this.arraySpeedDigits.unshift(this.DYSPLAY_NONE_PART_CLASS);
            }
        }

        for (this.forIndex = this.arrSpeedDigitsUpperLimit; this.forIndex >= 0; this.forIndex--) {

            this.tempCssClass = this.baseCssClass + this.arraySpeedDigits[this.forIndex];
            this.arrayAllDigits[this.forIndex].className = this.tempCssClass;
        }
    }
}

export default CarSpeedDigitalMeter;