
const GasPedalClass = class GasPedalObj {

    "use strict";

    #boolIsGasPedalPressed;

    #cssPointerEventsNone;

    #intGasPositionValue; #intPrevGasPedalPositionValue;

    pGasRangeValue = document.getElementById("gasRangeValue");
    gasPedal = document.getElementById("gasPedal");

    constructor() {

        this.cssPointerEventsNone = "pointer-events-none";

        this.boolIsGasPedalPressed = false;

        this.boolIsPointerEventsNoneApplied = false;

        this.intGasPositionValue = 0;
        this.strGasPedalValue = "0";

        this.intPrevGasPedalPositionValue = -1;
        //this.intGasPedalValue = -1;

        this.gasPedal.value = this.strGasPedalValue;
        this.pGasRangeValue.textContent = this.strGasPedalValue;

        this.gasPedal.addEventListener("input", this.#cbSetGasPedalPressed.bind(this));
        this.gasPedal.addEventListener("mouseup", this.#cbSetGasPedalNOTPressed.bind(this));

        //this.gasPedal.addEventListener("mousedown", this.#getSetGasPedalPressed.bind(this));
    }

    set setIsPointerEventsNoneApplied(booleanValue) {

        this.boolIsPointerEventsNoneApplied = booleanValue;
    }
    get getIsPointerEventsNoneApplied() {

        return this.boolIsPointerEventsNoneApplied;
    }

    setGasLabelValue() {

        if (this.intGasPositionValue === this.intPrevGasPedalPositionValue)
            return;

        this.pGasRangeValue.textContent = this.intGasPositionValue.toString();

        this.intPrevGasPedalPositionValue = this.intGasPositionValue;
    }

    #setAutoRetraction() {

        this.intGasPositionValue = this.intGasPositionValue - 1;

        // This should not be needed as I have if statement in the Car's object main flow
        // i.e. else if ((this.boolIsGasPedalPressed === false) && (this.intGasPositionValue > 0))
        //if (this.intGasPositionValue < 0)
        //    this.intGasPositionValue = 0;

        this.strGasPedalValue = this.intGasPositionValue.toString();
        this.gasPedal.value = this.strGasPedalValue;
    }

    // public, called in the main clock interval
    setSetGasPedalForAutoRetract() {

        // We want to have gas pedal auto retracting
        // if it is not pressed and having value greater than 0
        // I moved this line in the main Car's obj'
        /*if ((this.boolIsGasPedalPressed === false) && (this.intGasPositionValue > 0))*/
        this.#setAutoRetraction();
    }

    get getIsGasPedalPressed() {

        return this.boolIsGasPedalPressed;
    }

    #cbSetGasPedalNOTPressed() {

        this.boolIsGasPedalPressed = false;
    }

    #cbSetGasPedalPressed() {

        this.boolIsGasPedalPressed = true;
    }

    get getGasPedalPosition() {

        this.strGasPedalValue = this.gasPedal.value;
        this.intGasPositionValue = parseInt(this.strGasPedalValue);

        return this.intGasPositionValue;
    }

    addCssPointerEventsNone() {

        this.gasPedal.classList.add(this.cssPointerEventsNone);
    }

    removeCssPointerEventsNone() {

        this.gasPedal.classList.remove(this.cssPointerEventsNone);
    }
}

export default GasPedalClass;