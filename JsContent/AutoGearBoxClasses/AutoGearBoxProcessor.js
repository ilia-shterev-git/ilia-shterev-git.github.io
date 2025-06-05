

import EnumGenericStatusObj from '../Enums/GenericStatusEnum.js';

const AutoGearBoxProcessor = class AutoGearBoxProcessor {

    #boolIsOnClickResponse = false; 
    #boolIsFirstPass = false;

    #classActiveGearMark;
    #currentAutoGearObj;
    #currentAutoGearNumber;
    #arrAutoGears; #targetAutoGear; #currentAutoGear;

    #intCurrentDatSetNumber; #intTargetDatSetNumber;

    constructor() {

        this.GenericStatusObj = EnumGenericStatusObj;

        const SIGNALING_PULSE_CLOCKS_DURATION = 78;
        this.SIGNALING_PULSE_CLOCKS_DURATION = SIGNALING_PULSE_CLOCKS_DURATION;

        const NUMBER_OF_SIGNALING_PERIODS = 3;
        this.NUMBER_OF_SIGNALING_PERIODS = NUMBER_OF_SIGNALING_PERIODS;

        this.boolIsAutoGearCheckedForEngineStart = false;
        this.classCurrent = "";

        const INT_AUTO_GEAR_BOX_INITIAL_GEAR = 0;
        this.INT_AUTO_GEAR_BOX_INITIAL_GEAR = INT_AUTO_GEAR_BOX_INITIAL_GEAR;

        this.#currentAutoGearNumber;  this.currentManualGear;
    }

    checkForBreakPedalPressed(boolIsEngineRunning, boolIsBreakPedalFirmlyPressed) {

        if ((boolIsEngineRunning === true)
            && (boolIsCarMoving === false)
            && (boolIsBreakPedalFirmlyPressed === false)) {

            return false;
        }
    }

    checkForAllowedGears(boolIsEngineRunning, boolIsCarMoving, boolIsBreakPedalFirmlyPressed) {

        // I have thought this to be replaced with a not fixed JS file values
        // compared to this hard code. But then I was thinking that this code does not change
        // so frequently. So bringing file values with iterations
        // would carry unnecessary resource consumming loops
        // IMPORTANT the first "if else if" should not be moved 
        // after the next if (boolIsEngineRunning === true)
        if ((this.#currentAutoGearObj.gearNumber === GearsEnum["D"])
            && (this.#targetAutoGear.gearNumber === GearsEnum["N"])) {

            return true;
        }
        else if ((this.#currentAutoGearObj.gearNumber === GearsEnum["N"])
            && (this.#targetAutoGear.gearNumber === GearsEnum["D"])) {

            return true;
        }

        if (boolIsEngineRunning === true) { 

            if ((boolIsCarMoving === false) && (boolIsBreakPedalFirmlyPressed === true)) {

                return true;
            }
            else {

                return false;
            }
        }
        else if (boolIsEngineRunning === false) {

            return true;
        }


    }

    setCurrentAutoGearObjByDataSetNumber() {

        this.#currentAutoGearObj = this.#arrAutoGears
            .find(arrAutoGear => arrAutoGear.dataSetNumber === this.#intCurrentDatSetNumber);
    }

    setCurrentDataSetNumber() {

        this.#intCurrentDatSetNumber = this.#currentAutoGearObj.dataSetNumber;
    }

    // sets #intCurrentDatSetNumber and #intTargetDatSetNumber based on 
    // the current and target element's datasets
    shiftCurrentDatSetNumber() {

        if (this.#intCurrentDatSetNumber < this.#intTargetDatSetNumber)
            this.#intCurrentDatSetNumber = this.#intCurrentDatSetNumber + 1;

        else if (this.#intCurrentDatSetNumber > this.#intTargetDatSetNumber)
            this.#intCurrentDatSetNumber = this.#intCurrentDatSetNumber - 1;
    }

    get getIsShiftingCicleEnded() {

        return this.#intCurrentDatSetNumber === this.#intTargetDatSetNumber;
    }


    setTargetDataSetNumber() {

        this.#intTargetDatSetNumber = this.#targetAutoGear.dataSetNumber;
    }

    set setCurrentAutoGearByGearObj(gearNumber) {

        this.#currentAutoGearObj = this.#arrAutoGears
            .find(arrAutoGear => arrAutoGear.gearNumber === gearNumber);

        this.#currentAutoGearNumber = this.#currentAutoGearObj.gearNumber;
    }

    set setTargetAutoGearByDomId(domId) {

        this.#targetAutoGear = this.#arrAutoGears
            .find(arrAutoGear => arrAutoGear.domId === domId);
    }

    get getTargetAutoGear() {

        return this.#targetAutoGear;
    }

    get getIsAutoGearBoxShifting() {

        return this.#boolIsOnClickResponse;
    }

    resetOnEngineStartAutoGearCheck() {

        this.boolIsAutoGearCheckedForEngineStart = false;
    }

    set assignAutoGears(arrAutoGears) {

        this.#arrAutoGears = arrAutoGears;
    }

    get getCurrentAutoGearNumber() {

        return this.#currentAutoGearNumber;
    }

    get getCurrentAutoGearObj() {

        return this.#currentAutoGearObj;
    }
}

export default AutoGearBoxProcessor;