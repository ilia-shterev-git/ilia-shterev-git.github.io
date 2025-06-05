

import AnalogEngSpeedNumbersObj from '../JsonArrays/AnalogEngSpeedNumbers.js';


const EngineAnalogRevsMeter = class EngineAnalogRevsMeter {

    "use strict";

    boolIsEngineStarting = false;
    boolIsEngineRunning = false;

    #ENGINE_MAX_SPEED = 0;
    #ENGINE_MAX_SPEED_ROUND = 0;
    #NUMBER_OF_DIAL_BARS = 0;
    #DEGREES_PER_THOUSAND_REVS = 0;

    #anglesPerRev = 0;
    calculatedAngle = 0;

    #cssRootElement = getComputedStyle(document.documentElement);

    #speedMeterFullScaleDegrees = this.#cssRootElement.getPropertyValue("--analogMetersFullScaleDegrees");

    #initialArrowOffset= 0;

    analogEngineSpeedArrow = document.getElementById("analogEngineSpeedArrow");

    analogEngineSpeedMeter = document.getElementById("analogEngineSpeedMeter");

    setAnalogRevsMeterNumbersV1() {

        let allJsonNumbers = AnalogEngSpeedNumbersObj.getJsonNumbers;

        let allNumberObjects = JSON.parse(allJsonNumbers);

        let tempSpan, tempDiv;

        allNumberObjects.forEach(function (numberObject) {

            tempSpan = document.createElement("span");

            tempSpan.textContent = numberObject.numberValue;

            tempSpan.style.transform = `rotate(${numberObject.numberOrientation}deg)`;

            tempDiv = document.createElement("div");

            tempDiv.style.transform = `rotate(${numberObject.numberPosition}deg)`;

            tempDiv.classList.add("number");

            tempDiv.appendChild(tempSpan);

            analogEngineSpeedMeter.appendChild(tempDiv);
        });

    }

    setAnalogRevsMeterNumbersV2() {

        let allJsonNumbers = AnalogEngSpeedNumbersObj.getJsonNumbers;

        let allNumberObjects = JSON.parse(allJsonNumbers);

        let tempSpan, tempDiv, tempNumberClass;

        allNumberObjects.forEach(function (numberObject) {

            tempSpan = document.createElement("span");

            tempSpan.textContent = numberObject.numberValue;

            tempDiv = document.createElement("div");

            tempNumberClass = "number" + numberObject.numberValue;

            tempDiv.classList.add("number");

            tempDiv.classList.add(tempNumberClass);

            tempDiv.appendChild(tempSpan);

            analogEngineSpeedMeter.appendChild(tempDiv);
        });

    }

    constructor(engineMaxSpeed) {

        // The code in the subsection calculates angles per engine speed - rev/sec 
        // I use hard coded values as little as posible. engineMaxSpeed is imported from
        // Engine obj. #speedMeterFullScaleDegrees comes from css var.
        // This var is also a base for other calculations inside the css styles.
        this.#ENGINE_MAX_SPEED = engineMaxSpeed;

        if (isNaN(this.#speedMeterFullScaleDegrees) === false) {

            this.#speedMeterFullScaleDegrees = parseInt(this.#speedMeterFullScaleDegrees)
        }
        else {

            this.#speedMeterFullScaleDegrees = 270;
        }

        this.#initialArrowOffset = (this.#speedMeterFullScaleDegrees / 2);

        this.#initialArrowOffset = -this.#initialArrowOffset;
        
        this.#anglesPerRev = this.#speedMeterFullScaleDegrees / this.#ENGINE_MAX_SPEED;

        // -----  End angles per engine speed  --------------------------------------------

        // The code in the subsection calculates #DEGREES_PER_DIAL_BAR and sends it to
        // a css var. Again use of hard coded values as little as posible. 
        this.#ENGINE_MAX_SPEED_ROUND = this.#roundNumberToFactor(this.#ENGINE_MAX_SPEED, 1000);

        this.#NUMBER_OF_DIAL_BARS = this.#ENGINE_MAX_SPEED_ROUND / 1000;

        this.#DEGREES_PER_THOUSAND_REVS = this.#speedMeterFullScaleDegrees / this.#NUMBER_OF_DIAL_BARS;

        document.documentElement.style.setProperty("--degreesPerThousandRevs", `${this.#DEGREES_PER_THOUSAND_REVS.toString()}deg`);

        // V1 rotates the divs directly with style.transform. V2 assigns corresponding classes.
        this.setAnalogRevsMeterNumbersV1();

        this.prevEngineSpeed = -1;
    }

    #roundNumberToFactor(num, factor = 1000) {

        const quotient = num / factor;
        const res = Math.round(quotient) * factor;
        return res;
    }

    shutDown() {

        this.calculatedAngle = this.#initialArrowOffset + 3; // Some angle correction added
        // as it does not match with the CSS offset. For appearence adjustment

        this.analogEngineSpeedArrow.style.transform = `rotate(${this.calculatedAngle}deg)`;

        this.prevEngineSpeed = -1;
    }

    displaySpeed(intIncomingEngineSpeed) {

        // No need to re-display eng. speed if it is the same as previuos. 
        if ((this.prevEngineSpeed === intIncomingEngineSpeed) || (intIncomingEngineSpeed < 0))
            return;

        this.prevEngineSpeed = intIncomingEngineSpeed;

        this.calculatedAngle = intIncomingEngineSpeed * this.#anglesPerRev;

        this.calculatedAngle = this.#initialArrowOffset + this.calculatedAngle;

        this.analogEngineSpeedArrow.style.transform = `rotate(${this.calculatedAngle}deg)`;
    }
}

export default EngineAnalogRevsMeter;