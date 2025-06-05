
import DigitalEngineSpeedMeterColorsObj from '../JsonArrays/DigitalEngSpeedMeterColors.js';

const EngineSpeedDigitalMeterClass = class EngineSpeedDigitalMeterObj {

    "use strict";

    baseCssClass = "display-numb-";
    tempCssClass = "";

    engineSpeedMeterOnesDigit = document.getElementById("engineSpeedMeterOnesDigit");
    engineSpeedMeterTensDigit = document.getElementById("engineSpeedMeterTensDigit");
    engineSpeedMeterHundredsDigit = document.getElementById("engineSpeedMeterHundredsDigit");
    engineSpeedMeterThousandsDigit = document.getElementById("engineSpeedMeterThousandsDigit");

    arrayAllDigits = new Array();
    arrayCurrentSpeedDigits = new Array();
    allRangesAndColors = new Array();

    #cssRootElement;

    #setSpeedRangesAndColors() {

        let allJsonRangesAndColors = DigitalEngineSpeedMeterColorsObj.getJsonRangesAndColors;

        // One silly domonstration of using stringify / parse
        this.allRangesAndColors = JSON.parse(allJsonRangesAndColors);

        this.allRangesAndColors.forEach((rangesAndColorsObject) => {

        rangesAndColorsObject.colorValue
                = this.computedStyle.getPropertyValue(rangesAndColorsObject.colorCssVar);

        this.initSemiGreen
            = this.computedStyle.getPropertyValue("--bellowRangeColor");
                   
        })
    }

    constructor() {

        this.arrayAllDigits.unshift(engineSpeedMeterThousandsDigit
            , engineSpeedMeterHundredsDigit
            , engineSpeedMeterTensDigit
            , engineSpeedMeterOnesDigit);

        this.arrSpeedDigitsLength = 0;
        this.speedToString = "";
        this.arrSpeedDigitsUpperLimit = 0;
        this.arrCurrSpeedDigitsDownLimit = 0;
        this.forIndex = 0;

        this.prevEngineSpeed = -1;

        this.arrSpeedDigitsUpperLimit = this.arrayAllDigits.length - 1;

        /// making const globally available
        const DYSPLAY_NONE_PART_CLASS = "None";
        this.DYSPLAY_NONE_PART_CLASS = DYSPLAY_NONE_PART_CLASS;

        const DISPLAY_NONE_CLASS = "display-numb-None"
        this.DISPLAY_NONE_CLASS = DISPLAY_NONE_CLASS;

        const DIGITAL_SPEED_METER_MAIN_COLOR = "--digitalEngineSpeedMeterMainColor";
        this.DIGITAL_SPEED_METER_MAIN_COLOR = DIGITAL_SPEED_METER_MAIN_COLOR;

        this.digitalEngSpeedMeterMainColor;

        this.#cssRootElement = document.querySelector(':root');
        this.computedStyle = getComputedStyle(this.#cssRootElement);

        this.prevMinRangeValue = -1;

        this.currentRangeAndColors;

        this.#setSpeedRangesAndColors();
    }

    shutDown() {

        this.displaySpeed(0);

        for (this.forIndex = 0; this.forIndex < this.arrayAllDigits.length; this.forIndex++) {

            this.arrayAllDigits[this.forIndex].className = this.DISPLAY_NONE_CLASS;
        }

        this.#cssRootElement.style
            .setProperty(this.DIGITAL_SPEED_METER_MAIN_COLOR, this.initSemiGreen);


        this.prevEngineSpeed = -1;
    }

    displaySpeed(incomingEngineSpeed) {

        // No need to re-display eng. speed if it is the same as previuos. 
        if ((this.prevEngineSpeed === incomingEngineSpeed) || (incomingEngineSpeed < 0))
            return;

        this.prevEngineSpeed = incomingEngineSpeed;

        this.speedToString = incomingEngineSpeed.toString();

        this.arrayCurrentSpeedDigits = this.speedToString.split("");

        this.arrSpeedDigitsLength = this.arrayCurrentSpeedDigits.length;

        this.arrCurrSpeedDigitsDownLimit = this.arrayAllDigits.length - this.arrSpeedDigitsLength;

        // Here I keep two arrays. One with all digts and the other with corresponding classes.
        // The second one is filled dinamically on each iteration. Its values will help form the digit.
        // In the second for loop I match the digits with the corresponding display classes.
        // Which forms the digit needed.
        if (incomingEngineSpeed < 1000) {

            for (this.forIndex = 0; this.forIndex < this.arrCurrSpeedDigitsDownLimit; this.forIndex++) {

                this.arrayCurrentSpeedDigits.unshift(this.DYSPLAY_NONE_PART_CLASS);
            }
        }

        for (this.forIndex = this.arrSpeedDigitsUpperLimit; this.forIndex >= 0; this.forIndex--) {

                this.tempCssClass = this.baseCssClass + this.arrayCurrentSpeedDigits[this.forIndex];
                this.arrayAllDigits[this.forIndex].className = this.tempCssClass;       
        }

        this.currentRangeAndColors = this.allRangesAndColors
            .find((rangesAndColorsObject) =>
                (rangesAndColorsObject.minSpeedValue <= incomingEngineSpeed) && (incomingEngineSpeed <= rangesAndColorsObject.maxSpeedValue))

        // Reset the engine speed meter color only if it is different than prev.
        if (this.prevMinRangeValue !== this.currentRangeAndColors.minSpeedValue) {

            this.prevMinRangeValue = this.currentRangeAndColors.minSpeedValue;

            this.#cssRootElement.style
                .setProperty(this.DIGITAL_SPEED_METER_MAIN_COLOR, this.currentRangeAndColors.colorValue);
        }
    }
}

export default EngineSpeedDigitalMeterClass;