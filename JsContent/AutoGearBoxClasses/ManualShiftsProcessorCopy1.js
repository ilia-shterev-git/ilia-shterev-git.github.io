
import ResultStatus from '../Enums/ResultStatus.js';

import GearsEnum from '../Enums/GearsEnum.js';

import EngineCharacteristicsObj from '../JsonArrays/EngineCharacteristics.js';

import BreakDecelerationCharacteristics from '../JsonArrays/BreakDecelerationCharacteristicsV2.js';



const ManualShiftsProcessor = class ManualShiftsProcessor {

    "use strict"

    boolIsGasPositionChanged = false;

    prevCalculatedGasPosition = 0;

    calculatedGasPosition = 0;
    calculatedEngineSpeed;

    outputCarSpeed; outputEngineSpeed; tempCalculatedEngineSpeed;

    tempGasPosition;

    currentGearObj; tempGearObj; outputEngineCharacteristicsObj;

    get getCurrentManualDomGear() {

        return this.#currentManualDomGear;
    }

    calculateGasPosition(intGasPedalPositionValue) {

        if (intGasPedalPositionValue > this.prevCalculatedGasPosition) {

            this.#reducedCarSpeed = this.prevCalculatedGasPosition + 1;
        }
        else if (intGasPedalPositionValue < this.prevCalculatedGasPosition) {

            this.#reducedCarSpeed = this.prevCalculatedGasPosition - 1;
        }
    }

    getEngineSpeed() {

        this.#engineSpeed =
            EngineCharacteristicsObj.gasPositionEngineSpeed[this.#reducedCarSpeed];
    }

    getCarSpeed() {

        this.#carSpeed =
            this.#currentGearObj.carSpeedPerEngineSpeed[this.calculatedEngineSpeed];
    }

    setCurrentManualGearNumber() {

        if (this.#currentGearObj !== null)

            this.#currentGearNumber = this.#currentGearObj.gearNumber;
    }

    setManualGearObjectByAutoGear(currentGearNumber) {

        if ((currentGearNumber === GearsEnum["P"]) || (currentGearNumber === GearsEnum["N"])) {

            this.#currentGearObj = null;
            return;
        }

        this.#currentGearObj = EngineCharacteristicsObj.engineGearCharacteristics
            .find(gearObj => gearObj.gearNumber === currentGearNumber);
    }

    set setCurrentManualDomGearByAutoGearNumber(autoGearNumber) {

        if (autoGearNumber === GearsEnum["P"])

            this.#currentManualDomGear = null;

        else if (autoGearNumber === GearsEnum["D"])

            this.#currentManualDomGear = this.arrManualGears
                .find(manualGear => manualGear.gearNumber === GearsEnum["1"]);
        else

            this.#currentManualDomGear = this.arrManualGears
                .find(manualGear => manualGear.gearNumber === autoGearNumber);
    }

    setCarSpeedToZero() {

        this.outputCarSpeed = 0;
    }

    #getEngineSpeedFromCarSpeedNewVersion() {

        this.#engineSpeed = this.#currentGearObj.engineSpeedPerCarSpeed[this.#carSpeed];
    }

    #getGasPositionFromEngineSpeedNewVersion() {

        this.#engineSpeed = EngineCharacteristicsObj.gasPositionPerEngineSpeed[this.#engineSpeed];
    }

    calculateReducedSpeed(breakPedalValue) {

        if (this.#carSpeed > this.MIN_SPEED_AT_FIRST_GEAR_AT_BREAK_1_VALUE) {

            // get the speed reduction's percentage from a JS file / object
            // ../JsonArrays/BreakDecelerationCharacteristicsV2
            this.#estimateBreakingPercentage(breakPedalValue);

            // Calculate the car speed after reduction. Calculated car's speed
            // can have any value.
            this.#calculateReducedCarSpeedByPercents();

            // Bellow I check for the closest value within engine speed /car's
            // speed / current gear characteristics.
            if (this.#carSpeed > this.MIN_SPEED_AT_FIRST_GEAR_AT_BREAK_1_VALUE) {

                // Goes through all car's speeds of all gear characteristics and finds
                // the matching value to the calculated reduced car's speed.
                // Also finds current manual gear number, #currentGearObj.
                this.#findMatchingCharacteristics();
            }
            else {

                // Break pedal at position 1 should still allow some car's speed
                // Any value above that should bring the car's speed to 0
                this.#onAutoGearCheckForMinSpeedValueOrLessThanZero(breakPedalValue);

                // if the car speed is that low then only option for current manual gear is to be 1
                this.#currentGearNumber = 1;
                this.#currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);
            }

            this.#getEngineSpeedFromCarSpeedNewVersion();
            // this.#getEngineSpeedFromCarSpeedOldVersion();

            this.#getGasPositionFromEngineSpeedNewVersion();
            //this.#getGazPositionFromEngineSpeedOldVersion();
        }
    }

    #findMatchingCarSpeedWithinCharacteristicsArray(carSpeedValues) {

        // This value will either be changed if value is found or 
        // it will remain the same after the function is complete.
        this.#tempCarSpeed = ResultStatus.ValueNotFound;

        this.arrLenghtMinusTwo = carSpeedValues.length - 2;

        for (this.tempIndex = 0; this.tempIndex < this.arrLenghtMinusTwo; this.tempIndex++) {

            this.tempIndexPlusOne = this.tempIndex + 1;

            if ((carSpeedValues[this.tempIndex] <= this.#reducedCarSpeed)
                && (this.#reducedCarSpeed <= carSpeedValues[this.tempIndexPlusOne])) {

                this.#tempCarSpeed = carSpeedValues[this.tempIndex];

                break;
            }
        }

        return this.#tempCarSpeed;
    }

    // Goes through all car's speeds of all gear characteristics and finds
    // the matching value to the calculated reduced car's speed.
    // Also finds engine speed, current manual gear number, #currentGearObj
    #findMatchingCharacteristics() {

        this.#carSpeedValues = Object.values(this.#currentGearObj.carSpeedPerEngineSpeed);

        this.boolIsCicleEnded === false;

        do {
            // lastOfUpShifts designates the maximum manual gear number. In this case 5
            if (this.#tempCurrentGearObj.lastOfUpShifts === false) {

                if (this.#tempCurrentGearNumber > GearsEnum["1"]) {

                    // Needed to filter small range of car speed limits
                    // for gears 2 to 4. Gears 1 and 5 are scannned for all values.
                    this.#setCarSpeedLimits(this.#tempCurrentGearObj);

                    this.#carSpeedFilteredValues = this.#carSpeedValues
                        .filter(carSpeedValues =>
                            this.carSpeedDownLimit <= carSpeedValues &&
                            carSpeedValues <= this.carSpeedUpperLimit
                        );

                    this.#carSpeedFilteredValues.sort((a, b) => a - b);

                    this.#tempCarSpeed =
                        this.#findMatchingCarSpeedWithinCharacteristicsArray(this.#carSpeedFilteredValues);

                } else if (this.#tempCurrentGearNumber === GearsEnum["1"]) {

                    this.#carSpeedValues.sort((a, b) => a - b);

                    this.#tempCarSpeed =
                        this.#findMatchingCarSpeedWithinCharacteristicsArray(this.#carSpeedValues);
                }

            } else if (this.#tempCurrentGearObj.lastOfUpShifts === true) {

                this.#carSpeedValues.sort((a, b) => a - b);

                this.#tempCarSpeed =
                    this.#findMatchingCarSpeedWithinCharacteristicsArray(this.#carSpeedValues);
            }

            if (this.#tempCarSpeed === ResultStatus.ValueNotFound) {

                this.#tempCurrentGearNumber = this.#tempCurrentGearNumber - 1;

                this.#tempCurrentGearObj = this.#getGearObjectByGearNumber(this.#tempCurrentGearNumber);

                this.#carSpeedValues = Object.values(this.#tempCurrentGearObj.carSpeedPerEngineSpeed);

            } else {

                this.#carSpeed = this.#tempCarSpeed;

                this.#currentGearNumber = this.#tempCurrentGearNumber;

                this.#currentGearObj = this.#tempCurrentGearObj;

                this.boolIsCicleEnded === true;
            }

        } while (this.boolIsCicleEnded === false);
    }

    // Called from within #findMatchingCharacteristics()
    // when it is needed to filter specific range of car speed limits
    // for gears 2 to 4. Gears 1 and 5 are scannned for all values.
    #setCarSpeedLimits(currentGearObj) {

        this.carSpeedDownLimit =
            currentGearObj.carSpeedPerEngineSpeed[currentGearObj.downShiftingEngineSpeed];

        this.carSpeedUpperLimit =
            currentGearObj.carSpeedPerEngineSpeed[currentGearObj.downShiftingBreakEngineSpeed];
    }

    #calculateReducedCarSpeedByPercents() {

        this.#floatCarSpeed = parseFloat(this.#carSpeed);
        this.#floatsEtimatedBreakPercents = parseFloat(this.#estimatedBreakPercents);

        this.#reducedSpeedPortion = this.#floatCarSpeed * this.#floatsEtimatedBreakPercents;

        this.#reducedSpeedPortion = this.#reducedSpeedPortion / 100;

        // All of the above is just one line bellow.
        // I however like to do things explicitely.

        //this.#reducedCarSpeed =
        //    (parseFloat(this.#carSpeed) * parseFloat(this.#estimatedBreakPercents)) / 100;

        this.#reducedCarSpeed = this.#carSpeed - this.#reducedSpedPortion;
    }

    // Break pedal at position 1 should still allow some car speed
    // Any value above that should bring the car speed to 0
    #onAutoGearCheckForMinSpeedValueOrLessThanZero(breakPedalValue) {

        if (breakPedalValue === 1) {

            if (this.#reducedCarSpeed <= this.MIN_SPEED_AT_FIRST_GEAR_AT_BREAK_1_VALUE) {

                this.#reducedCarSpeed = this.MIN_SPEED_AT_FIRST_GEAR_AT_BREAK_1_VALUE;
            }
        }
        else if (breakPedalValue > 1) {

            if (this.#reducedCarSpeed < 0) {

                this.#reducedCarSpeed = 0;
            }
        }
    }

    // estimates breaking percentage based on BreakDecelerationCharacteristics JS file / object
    #estimateBreakingPercentage(breakPedalValue) {

        this.breakCharacteristicsObj = BreakDecelerationCharacteristics.breakValues
            .find(brChars => brChars.breakValue === breakPedalValue);

        this.#estimatedBreakPercents =
            this.breakCharacteristicsObj.breakingPercentage[this.#currentGearNumber];
    }

    // Called from within the constructor to set two constants
    //MIN_SPEED_AT_FIRST_GEAR_AT_BREAK_1_VALUE;
    //MIN_SPEED_AT_SECOND_GEAR_AT_BREAK_1_VALUE;
    #estimateMinSpeedAtMinBreakValue(gearNumber) {

        this.tempGearObj = EngineCharacteristicsObj.engineGearCharacteristics
            .find(gearObj => gearObj.gearNumber === gearNumber);


        return this.tempGearObj.carSpeedPerEngineSpeed["0"];
    }

    #getGearObjectByGearNumber(gearNumber) {

        return EngineCharacteristicsObj.engineGearCharacteristics
            .find(gearObj => gearObj.gearNumber === gearNumber);
    }
    //======================================================================================================

    constructor(GearBoxDomWorkerArgs) {

        this.GearBoxDomWorkerObj = GearBoxDomWorkerArgs;

        this.arrAutoGears = this.GearBoxDomWorkerObj.getAutoGearsArray;

        this.arrManualGears = this.GearBoxDomWorkerObj.getManualGearsArray;
        //================
        this.boolSomeBoolVar = false; this.intTemp = 0;

        this.boolIsMinShiftingSpeed = true;

        this.#estimatedBreakPercents; this.#reducedCarSpeed; this.tempCarSpeed; this.tempIndex;

        this.carSpeedDownLimit; this.carSpeedUpperLimit; this.#carSpeedValues; this.carSpeedFilteredValues;

        this.boolIsCicleEnded = false; this.arrLenghtMinusOne = 0;

        this.INERTIAL_DELAY_PERIODS_DURATION = 1;
        //INERTIAL_DELAY_PERIODS_DURATION = INERTIAL_DELAY_PERIODS_DURATION;

        this.MIN_SPEED_AT_FIRST_GEAR_AT_BREAK_1_VALUE = this.#estimateMinSpeedAtMinBreakValue(1);
        this.MIN_SPEED_AT_SECOND_GEAR_AT_BREAK_1_VALUE = this.#estimateMinSpeedAtMinBreakValue(2);

        // to change settings to P position.
        this.#currentGearNumber = 1; this.boolIsOnDirectGear = false; this.tempCurrentGear = -1;

        this.#currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);

        this.outputEngineCharacteristicsObj = {
            outputEngineSpeed: 0,
            outputGear: this.#currentGearNumber
        };

        this.#carSpeed; this.#engineSpeed;

        this.arrOutputEngineCharacteristics = new Array(24).fill(this.outputEngineCharacteristicsObj);

        this.prevCalculatedGasPosition = - 1; this.boolIsFirstTimeNoChange = false;
    }

    #decrementGasPositionByOneWithCheckForZero() {

        if (this.prevCalculatedGasPosition > 0) {

            this.#reducedCarSpeed = this.prevCalculatedGasPosition - 1;
        }
        else if (this.prevCalculatedGasPosition === 0) {

            this.#reducedCarSpeed = 0;
        }

        return this.#reducedCarSpeed;
    }

    #getGazPositionFromEngineSpeedOldVersion() {

        this.#engineSpeedValues = Object.values(EngineCharacteristicsObj.gasPositionEngineSpeed);

        this.#gasPositionKeys = Object.keys(EngineCharacteristicsObj.gasPositionEngineSpeed);

        this.#tempIndex = this.engineSpeedValues.indexOf(this.#engineSpeed);

        this.#tempGasPosition = this.gasPositionKeys[this.#tempIndex];

        this.#calculatedGasPosition = parseInt(this.#tempGasPosition);
    }

    #checkSetTempGearObj(outputEngineCharacteristicsObj) {

        if (this.#currentGearNumber === outputEngineCharacteristicsObj.outputGear)
            this.tempGearObj = this.#currentGearObj;
        else
            this.tempGearObj
                = this.#getGearObjectByGearNumber(outputEngineCharacteristicsObj.outputGear);

        return this.tempGearObj;
    }

    #getCarSpeed(tempGearObj, outputEngineCharacteristicsObj) {

        this.outputCarSpeed = tempGearObj
            .carSpeedPerEngineSpeed[outputEngineCharacteristicsObj.outputEngineSpeed];

        return this.outputCarSpeed;
    }

    #createNewCharacteristicsValues(currentGear, calculatedEngineSpeed) {

        this.outputEngineCharacteristicsObj = {
            outputGear: currentGear,
            outputEngineSpeed: calculatedEngineSpeed
        };

        return this.outputEngineCharacteristicsObj;
    }

    #calculateEngineSpeedGearShift(calculatedGasPosition) {

        this.calculatedEngineSpeed =
            EngineCharacteristicsObj.gasPositionEngineSpeed[calculatedGasPosition];

        if (this.boolIsOnDirectGear === false) {

            if ((this.calculatedEngineSpeed < this.#currentGearObj.downShiftingEngineSpeed)
                && (this.#currentGearNumber > 1)) {

                this.#currentGearNumber = this.#currentGearNumber - 1;

                this.#currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);

                this.tempCalculatedEngineSpeed = this.#currentGearObj.upShiftingEngineSpeed;

                this.#reducedCarSpeed = this.#currentGearObj.upShiftingGasPosition;

            } else if ((this.calculatedEngineSpeed > this.#currentGearObj.upShiftingEngineSpeed)
                && (this.#currentGearObj.lastOfUpShifts === false)) {

                this.#currentGearNumber = this.#currentGearNumber + 1;

                this.#currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);

                this.tempCalculatedEngineSpeed = this.#currentGearObj.downShiftingEngineSpeed;

                this.#reducedCarSpeed = this.#currentGearObj.downShiftingGasPosition;
            }
        }
    }

    #saveOutputEngineCharacteristicInertialDelay(outputEngineCharacteristicsObj) {

        this.arrOutputEngineCharacteristics.unshift(outputEngineCharacteristicsObj);
        this.arrOutputEngineCharacteristics.pop();
    }

    #getPrevOutputEngineCharacteristicsInertialDelay() {

        return this.arrOutputEngineCharacteristics[this.INERTIAL_DELAY_PERIODS_DURATION];
    }

    #setSpeedLimits(currentGearObj) {

        this.carSpeedDownLimit =
            currentGearObj.carSpeedPerEngineSpeed[currentGearObj.downShiftingEngineSpeed];

        this.carSpeedUpperLimit =
            currentGearObj.carSpeedPerEngineSpeed[currentGearObj.downShiftingBreakEngineSpeed];

        // return { carSpeedDownLimit: this.carSpeedDownLimit, carSpeedUpperLimit: this.carSpeedUpperLimit };
    }

    #reSetReducedCarSpeedNoFilter(gearObj) {

        this.carSpeedFilteredValues = Object.values(gearObj.carSpeedPerEngineSpeed);

        this.carSpeedFilteredValues.sort((a, b) => a - b);

        this.arrLenghtMinusOne = this.carSpeedFilteredValues.length - 1

        for (this.tempIndex2 = 0; this.tempIndex2 < this.arrLenghtMinusOne; this.tempIndex2++) {

            if ((this.carSpeedFilteredValues[this.tempIndex2] <= this.#reducedCarSpeed)
                && (this.#reducedCarSpeed <= this.carSpeedFilteredValues[this.tempIndex2 + 1])) {

                this.#reducedCarSpeed = this.carSpeedFilteredValues[this.tempIndex2];

                break;
            }
        }

        return this.#reducedCarSpeed;
    }

    #reSetReducedCarSpeedWithFilter(gearObj) {

        this.carSpeedFilteredValues = Object.values(gearObj.carSpeedPerEngineSpeed);

        this.carSpeedFilteredValues = this.carSpeedFilteredValues
            .filter(carSpeedValues =>
                this.carSpeedDownLimit <= carSpeedValues &&
                carSpeedValues <= this.carSpeedUpperLimit
            );

        this.carSpeedFilteredValues.sort((a, b) => a - b);

        this.arrLenghtMinusOne = this.carSpeedFilteredValues.length - 1

        for (this.tempIndex2 = 0; this.tempIndex2 < this.arrLenghtMinusOne; this.tempIndex2++) {

            if ((this.carSpeedFilteredValues[this.tempIndex2] <= this.#reducedCarSpeed)
                && (this.#reducedCarSpeed <= this.carSpeedFilteredValues[this.tempIndex2 + 1])) {

                this.#reducedCarSpeed = this.carSpeedFilteredValues[this.tempIndex2];

                break;
            }
        }

        return this.#reducedCarSpeed;
    }

    #reCalculateReducedSpeed() {

        this.tempCurrentGear = this.#currentGearNumber;

        do {

            /// This is not be necessary but just in case
            if (this.tempCurrentGear > 1)
                this.tempCurrentGear = this.tempCurrentGear - 1;

            this.tempGearObj
                = this.#getGearObjectByGearNumber(this.tempCurrentGear);

            // sets this.carSpeedDownLimit and this.carSpeedUpperLimit
            // based on a gearObj
            this.#setSpeedLimits(this.tempGearObj);

            if ((this.carSpeedDownLimit <= this.#reducedCarSpeed)
                && (this.#reducedCarSpeed <= this.carSpeedUpperLimit)) {

                this.#reducedCarSpeed = this.#reSetReducedCarSpeedWithFilter(this.tempGearObj);

                this.#currentGearNumber = this.tempCurrentGear;

                this.#currentGearObj = this.tempGearObj;

                this.boolIsCicleEnded = true;
            }

        } while (this.boolIsCicleEnded === false);

        return this.#reducedCarSpeed;
    }

    #calculateReducedSpeed() {

        // this a fix which should be deleted later when ...
        this.#currentGearNumber = 5; // this.boolIsOnDirectGear = false;

        this.#currentGearObj
            = this.#getGearObjectByGearNumber(this.#currentGearNumber);

        //if (this.intTemp === 0) {

        //    this.#reducedCarSpeed = 74; // 71  5
        //    this.intTemp = 1;
        //}
        //else if (this.intTemp === 1) {

        //    this.#reducedCarSpeed = 70; // 68.9  4
        //    this.intTemp = 2;
        //}
        //else if (this.intTemp === 2) {

        //    this.#reducedCarSpeed = 60;  /// 57.2  4
        //    this.intTemp = 3;
        //}
        //else if (this.intTemp === 3) {

        //    this.#reducedCarSpeed = 20;  /// 57.2  4
        //    this.intTemp = 3;
        //}

        this.#reducedCarSpeed = 20;  /// 19.1  1
        this.intTemp = 3;
        // End fix which should be deleted later when ...

        this.#setSpeedLimits(this.#currentGearObj);

        if (this.boolIsOnDirectGear === false) {

            if ((this.#currentGearNumber === 1)
                || ((this.#currentGearObj.lastOfUpShifts === true)
                    && (this.#reducedCarSpeed > this.#currentGearObj.downShiftingBreakingEngineSpeed))) {

                this.#reducedCarSpeed = this.#reSetReducedCarSpeedNoFilter(this.#currentGearObj);
            }
            else {

                if ((this.carSpeedDownLimit <= this.#reducedCarSpeed)
                    && (this.#reducedCarSpeed <= this.carSpeedUpperLimit)) {

                    this.#reducedCarSpeed = this.#reSetReducedCarSpeedWithFilter(this.#currentGearObj);
                }
                else {

                    this.#reducedCarSpeed = this.#reCalculateReducedSpeed();
                }
            }
        }
        else if (this.boolIsOnDirectGear === true) {

            this.#reducedCarSpeed = this.#reSetReducedCarSpeedNoFilter(this.#currentGearObj);
        }

        return this.#reducedCarSpeed;
    }

    #checkSetSpeedForMinValue(outputCarSpeed, intBreakPedalPositionValue) {

        this.boolIsMinShiftingSpeed = false;

        this.outputCarSpeed = outputCarSpeed;

        if (outputCarSpeed < EngineCharacteristicsObj.minShiftingSpeed) {

            this.#currentGearNumber = 1;

            this.#currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);

            this.boolIsMinShiftingSpeed = true;

            if ((intBreakPedalPositionValue <= EngineCharacteristicsObj.maxMovingBreakPedalPositionValue)
                && (outputCarSpeed < EngineCharacteristicsObj.minBreakingSpeed))

                this.outputCarSpeed = EngineCharacteristicsObj.minBreakingSpeed;
        }

        return this.outputCarSpeed;
    }

    calculateEngineCarSpeedOnDirectGear(boolIsGasPedalPressed = false
        , intGasPedalPositionValue = -1
        , boolIsBreakPedalPressed
        , intBreakPedalPositionValue) {

        if (boolIsGasPedalPressed === true) {

            // calculates gas position - this.#reducedCarSpeed based 
            // on the current gas pedal position and previously calculated gas position
            this.#calculateGasPosition(intGasPedalPositionValue);

            if (this.boolIsGasPositionChanged === false) {

                this.#saveOutputEngineCharacteristicInertialDelay(this.outputEngineCharacteristicsObj);

                return this.outputCarSpeed;
            }

            this.outputEngineCharacteristicsObj = this.#calculateEngineSpeedGearShift();

            this.#saveOutputEngineCharacteristicInertialDelay(this.outputEngineCharacteristicsObj);

            this.outputEngineCharacteristicsObj =
                this.#getPrevOutputEngineCharacteristicsInertialDelay();

            this.tempGearObj = this.#checkSetTempGearObj(this.outputEngineCharacteristicsObj);

            this.outputCarSpeed
                = this.#getCarSpeed(this.tempGearObj, this.outputEngineCharacteristicsObj)

            this.prevCalculatedGasPosition = this.#reducedCarSpeed;

            // This should never happen. If gas pedal is pressed then break pedal
            // should be released and vice versa. There should be one pointer only.
            if (boolIsBreakPedalPressed === true) {

                this.outputCarSpeed = 0;

                // eventually
                // throw new Error('Gas and Break pedals pressed simutaniously');
            }

        }
    }

    get getIsGasPositionChanged() {

        return this.boolIsGasPositionChanged;
    }

    calculateCarSpeed(boolIsGasPedalPressed = false
        , intGasPedalPositionValue = -1
        , boolIsBreakPedalPressed
        , intBreakPedalPositionValue) {

        boolIsGasPedalPressed = false;
        this.prevCalculatedGasPosition = 20;

        boolIsBreakPedalPressed = true;
        intBreakPedalPositionValue = 1;

        if (boolIsGasPedalPressed === true) {

            // calculates gas position besed on the current gas pedal position and
            // previously calculated gas position
            this.#calculateGasPosition(intGasPedalPositionValue);

            if (this.boolIsGasPositionChanged === false) {

                this.#saveOutputEngineCharacteristicInertialDelay(this.outputEngineCharacteristicsObj);

                return this.outputCarSpeed;
            }

            this.outputEngineCharacteristicsObj = this.#calculateEngineSpeedGearShift();

            this.#saveOutputEngineCharacteristicInertialDelay(this.outputEngineCharacteristicsObj);

            this.outputEngineCharacteristicsObj =
                this.#getPrevOutputEngineCharacteristicsInertialDelay();

            this.tempGearObj = this.#checkSetTempGearObj(this.outputEngineCharacteristicsObj);

            this.outputCarSpeed
                = this.#getCarSpeed(this.tempGearObj, this.outputEngineCharacteristicsObj)

            this.prevCalculatedGasPosition = this.#reducedCarSpeed;

            // This should never happen. If gas pedal is pressed then break pedal
            // should be released and vice versa. There should be one pointer only.
            if (boolIsBreakPedalPressed === true) {

                this.outputCarSpeed = 0;

                // eventually
                // throw new Error('Gas and Break pedals pressed simutaniously');
            }

        }  // End boolIsGasPedalPressed === true
        else if (boolIsGasPedalPressed === false) {

            //this.#reducedCarSpeed = this.#decrementGasPositionByOneWithCheckForZero();

            //this.outputEngineCharacteristicsObj =
            //    this.#calculateEngineSpeedGearShift(this.#reducedCarSpeed);

            //this.#saveOutputEngineCharacteristicInertialDelay(this.outputEngineCharacteristicsObj);

            ////this.outputEngineCharacteristicsObj =
            ////    this.#getPrevOutputEngineCharacteristicsInertialDelay();

            //this.tempGearObj = this.#checkSetTempGearObj(this.outputEngineCharacteristicsObj);

            //this.outputCarSpeed
            //    = this.#getCarSpeed(this.tempGearObj, this.outputEngineCharacteristicsObj);

            //    this.prevCalculatedGasPosition = this.#reducedCarSpeed;

            if (boolIsBreakPedalPressed === true) {

                /*this.#estimatedBreakPercents = this.#estimateBreakingPercentage(intBreakPedalPositionValue);*/

                //this.#reducedCarSpeed =
                //    this.#calcReducedCarSpeedByPercents(this.outputCarSpeed, this.#estimatedBreakPercents);

                //this.#reducedCarSpeed =
                //    this.#checkSetSpeedForMinValue(outputCarSpeed, intBreakPedalPositionValue);

                if (this.boolIsMinShiftingSpeed === false) {

                    this.outputCarSpeed = this.#calculateReducedSpeed(intBreakPedalPositionValue);
                }

                this.outputCarSpeed = this.#checkCarSpeedForZero(this.outputCarSpeed);
               
            } // End boolIsBreakPedalPressed === true
        }  // End boolIsGasPedalPressed === false

        console.log("red car speed after: ", this.#reducedCarSpeed, ", current Gear after: ", this.#currentGearNumber)

        //console.log("curr gas: ", this.#reducedCarSpeed,
        //    ", current Gear: ", this.#currentGearNumber,
        //    "calc eng sp: ", this.calculatedEngineSpeed,
        //    ", output Gear: ", this.outputEngineCharacteristicsObj.outputGear,
        //    "output eng sp: ", this.outputEngineCharacteristicsObj.outputEngineSpeed,
        //    "car sp: ", this.outputCarSpeed,
        //    "gas pressed: ", boolIsGasPedalPressed);

        if (this.outputCarSpeed < 8) {

            this.outputCarSpeed = 0;
        }

        return this.outputCarSpeed;
    }


    #getEngineSpeedFromCarSpeedOldVersion() {

        this.#carSpeedValues = Object.values(this.#currentGearObj.carSpeedPerEngineSpeed);

        this.#engineSpeedKeys = Object.keys(this.EngineCharacteristicsObj.carSpeedPerEngineSpeed);

        this.#indexOfCarSpeed = this.#carSpeedValues.indexOf(this.#carSpeed);

        this.#tempEngineSpeed = this.#engineSpeedKeys[this.#indexOfCarSpeed];

        this.#engineSpeed = parseInt(this.tempEngineSpeed);
    }

}

export default ManualShiftsProcessor;