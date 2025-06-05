
import ResultStatus from '../Enums/ResultStatusEnum.js';

import GearsEnum from '../Enums/GearShiftsEnum.js';

import EngineCharacteristicsObj from '../JsonArrays/EngineCharacteristics.js';

import BreakDecelerationCharacteristicsObj from '../JsonArrays/BreakDecelerationCharacteristicsV2.js';

const GearShiftsProcessor = class GearShiftsProcessor {

    "use strict"

    #BELOW_NORM_ENGINE_SPEED_MAX;

    #CRUISING_CAR_SPEED_FIRST_GEAR; #CRUISING_CAR_SPEED_SECOND_GEAR;
    #CRUISING_CAR_SPEED_SECOND_GEAR_BREAK_AT_CRUISING_BREAK;

    #CRUISING_BREAK_POSITION; #CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK; 

    #INERTIAL_DECALARATION_PERCENTS;

    boolIsGasPositionChanged = false;

    #reducedCarSpeed; #tempCarSpeed; #tempIndex;

    #estimatedBreakPercents; #currentGearNumber;

    #currentGearObj; #currentManualGearObj; #boolIsCicleEnded; #arrLenghtMinusTwo;

    #carSpeedDownLimit; #carSpeedUpperLimit; #carSpeedValues;

    #calculatedGasPosition; #carSpeed; #engineSpeed; #displayEngineSpeed;

    #tempIndexPlusOne; #tempGearObj; #prevGearObj; #prevDomGearObj;  #boolIsGearShifted;

    #tempGearNumber; #floatCarSpeed; #floatsEtimatedBreakPercents; #reducedSpeedPortion;

    #arrManualDomGears;

    #intermediateSpeedPortion;

    #belowNormEngineSpeed; 

    #getGearObjectByGearNumber(gearNumber) {

        return EngineCharacteristicsObj.engineGearCharacteristics
            .find(gearObj => gearObj.gearNumber === gearNumber);
    }

    #getEngineSpeedFromGasPosition(gasPosition) {

        this.engineSpeed =
            EngineCharacteristicsObj.engineSpeedFromGasPosition[gasPosition];

        return this.engineSpeed;
    }

    constructor() {

        //================
        this.boolSomeBoolVar = false; this.intTemp = 0;

        //this.boolIsMinShiftingSpeed = true;

        this.#estimatedBreakPercents = 0;

        this.INERTIAL_DELAY_PERIODS_DURATION = 1;

        this.#currentGearNumber = null; this.currentManualGearObj = null;

        // Those lines have their important sequence
        // I would include them in a private function but left for now for seeing what is happenning

        this.#tempGearObj = this.#getGearObjectByGearNumber(GearsEnum["1"]);

        this.IDLE_ENGINE_SPEED = this.#getEngineSpeedFromGasPosition(0);

        this.#CRUISING_CAR_SPEED_FIRST_GEAR = this.#tempGearObj.cruisingSpeed;
        this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK = this.#tempGearObj.cruisingSpeedBreak1;

        this.#tempGearObj = this.#getGearObjectByGearNumber(GearsEnum["2"]);

        this.#CRUISING_CAR_SPEED_SECOND_GEAR = this.#tempGearObj.cruisingSpeed;
        this.#CRUISING_CAR_SPEED_SECOND_GEAR_BREAK_AT_CRUISING_BREAK = this.#tempGearObj.cruisingSpeedBreak1;

        this.#CRUISING_BREAK_POSITION = 1;

        this.BELOW_NORM_ENGINE_SPEED_MAX = EngineCharacteristicsObj.belowNormEngineSpeedMax;

        const INERTIAL_DECALARATION_PERCENTS = 4.0;
        this.#INERTIAL_DECALARATION_PERCENTS = INERTIAL_DECALARATION_PERCENTS;

        this.#tempGearObj = null; this.prevGearObj = null; this.prevDomGearObj = null;

        // END Those lines have their important sequence

        this.belowNormEngineSpeed = 0;


        this.#calculatedGasPosition = 0; this.carSpeed = 0; this.engineSpeed = 0;

        // This would take place if an inertial delays are to e introduced
        this.arrOutputEngineCharacteristics = new Array(24).fill(this.outputEngineCharacteristicsObj);

        //this.outputEngineCharacteristicsObj = {
        //    outputEngineSpeed: 0,
        //    outputGear: this.#currentGearNumber
        //};

        this.#reducedSpeedPortion = 0; this.#displayEngineSpeed = 0;

        this.currentGearObj = null; this.currentDomGearObj = null;

        /*this.boolIsFirstTimeNoChange = false;*/
    }

    #getEngineSpeedFromCarSpeedNewVersion(carSpeed) {

        if (this.currentGearObj === null) {

            // engineSpeed should not be set this way
            // Temp solution only
            this.engineSpeed = 900;
            return this.engineSpeed;
        }

        this.engineSpeed = this.currentGearObj.engineSpeedFromCarSpeed[carSpeed];

        return this.engineSpeed;
    }

    #setDisplayEngineSpeed(carSpeed) {

        if (carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR)

            this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

        else {

            this.#displayEngineSpeed
                = this.#getEngineSpeedFromCarSpeedNewVersion(carSpeed);
        }

        return this.#displayEngineSpeed;
    }

    #setCalculatedGasPosition(engineSpeed) {

        if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR)

            this.#calculatedGasPosition = 0;

        else {

            this.#calculatedGasPosition
                = this.#getGasPositionFromEngineSpeedNewVersion(engineSpeed);
        }

        return this.#calculatedGasPosition;
    }

    #getGasPositionFromEngineSpeedNewVersion(engineSpeed) {

        this.#calculatedGasPosition
            = EngineCharacteristicsObj.gasPositionFromEngineSpeed[engineSpeed];

        return this.#calculatedGasPosition;
    }

    #getCarSpeedFromEngineSpeed(engineSpeed) {

        this.carSpeed =
            this.currentGearObj.carSpeedFromEngineSpeed[engineSpeed];

        return this.carSpeed;
    }

    #getBreakingPercentage(breakPedalValue) {

        this.breakCharacteristicsObj = BreakDecelerationCharacteristicsObj.breakValues
            .find(brChars => brChars.breakValue === breakPedalValue);

        this.#estimatedBreakPercents =
            this.breakCharacteristicsObj.breakingPercentage[this.#currentGearNumber];

        return this.#estimatedBreakPercents;
    }

    #calculateReducedCarSpeedByPercents(estimatedBreakPercents) {

        this.#floatCarSpeed = parseFloat(this.carSpeed);
        this.#floatsEtimatedBreakPercents = parseFloat(estimatedBreakPercents);

        this.#reducedSpeedPortion = this.#floatCarSpeed * this.#floatsEtimatedBreakPercents;

        this.#reducedSpeedPortion = this.#reducedSpeedPortion / 100;

        // All of the above is just one line bellow.
        // I however like to do things explicitely.

        //this.#reducedCarSpeed =
        //    (parseFloat(this.carSpeed) * parseFloat(this.#estimatedBreakPercents)) / 100;

        this.#reducedCarSpeed = this.carSpeed - this.#reducedSpeedPortion;

        if (this.#reducedCarSpeed < 0) {

            this.#reducedCarSpeed = 0;
        }

        return this.#reducedCarSpeed;
    }

    checkForGearShiftRecalculateEngineSpeedGasPosition(engineSpeed) {

        if ((engineSpeed < this.currentGearObj.downShiftingEngineSpeed)
            && (this.#currentGearNumber > 1)) {

            this.prevGearObj = this.currentGearObj;

            this.#currentGearNumber = this.#currentGearNumber - 1;

            this.#boolIsGearShifted = true;

            this.currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);

            this.engineSpeed = this.currentGearObj.upShiftingEngineSpeed;

            this.#calculatedGasPosition =
                this.#getGasPositionFromEngineSpeedNewVersion(this.engineSpeed);

        } else if ((engineSpeed > this.currentGearObj.upShiftingEngineSpeed)
            && (this.currentGearObj.lastOfUpShifts === false)) {

            this.prevGearObj = this.currentGearObj;

            this.#currentGearNumber = this.#currentGearNumber + 1;

            this.#boolIsGearShifted = true;

            this.currentGearObj = this.#getGearObjectByGearNumber(this.#currentGearNumber);

            this.engineSpeed = this.currentGearObj.downShiftingEngineSpeed;

            this.#calculatedGasPosition =
                this.#getGasPositionFromEngineSpeedNewVersion(this.engineSpeed);
        }
    }

    calculateGasPosition(intGasPedalPositionValue) {

        if (intGasPedalPositionValue > this.#calculatedGasPosition) {

            this.#calculatedGasPosition = this.#calculatedGasPosition + 1;
        }
        else if (intGasPedalPositionValue < this.#calculatedGasPosition) {

            this.#calculatedGasPosition = this.#calculatedGasPosition - 1;
        }

        return this.#calculatedGasPosition;
    }

    #calculateGasPositionOnDecrementWithZeroCheck() {
        
        if (this.#calculatedGasPosition > 0)

            this.#calculatedGasPosition = this.#calculatedGasPosition - 1;

        return this.#calculatedGasPosition;
    }

    #findMatchingCarSpeedWithinCharacteristicsArray(carSpeedValues, reducedCarSpeed) {

        // This value will either be changed if value is found or 
        // it will remain the same after the function is ccomplete.
        this.#tempCarSpeed = ResultStatus.ValueNotFound;

        this.#arrLenghtMinusTwo = carSpeedValues.length - 2;

        for (this.#tempIndex = 0; this.#tempIndex < this.#arrLenghtMinusTwo; this.#tempIndex++) {

            this.#tempIndexPlusOne = this.#tempIndex + 1;

            if ((carSpeedValues[this.#tempIndex] <= reducedCarSpeed)
                && (reducedCarSpeed <= carSpeedValues[this.#tempIndexPlusOne])) {

                this.#tempCarSpeed = carSpeedValues[this.#tempIndex];

                break;
            }
        }

        return this.#tempCarSpeed;
    }

    // Goes through all car's speeds of all gear characteristics and finds
    // the matching value to the calculated reduced car's speed.
    // Also finds engine speed, current manual gear number, #currentGearObj
    #findMatchingCharacteristics(reducedCarSpeed) {

        if (this.currentGearObj === null)
            return reducedCarSpeed;
               
        this.#boolIsCicleEnded = false;

        this.#tempGearObj = this.currentGearObj;

        this.#tempGearNumber = this.#tempGearObj.gearNumber;

        do {

            this.carSpeedValues = Object.values(this.#tempGearObj.carSpeedFromEngineSpeed);

            if (this.#tempGearNumber > GearsEnum["1"]) {

                if (this.#tempGearObj.lastOfUpShifts === false) {

                    // Needed to filter small range of car speed limits
                    // for gears 2 to 4. Gears 1 and 5 are scannned for all values.
                    this.getCarUpperSpeedLimitFromEngineSpeed(this.#tempGearObj);

                    this.carSpeedValues = this.carSpeedValues
                        .filter(carSpeedValues => carSpeedValues <= this.carSpeedUpperLimit);
                        

                }   // lastOfUpShifts designates the maximum manual gear number. In this case 5
                else if (this.#tempGearObj.lastOfUpShifts === true) {

                    // TO DO filter engine speed values from max engine speed to down shifting speed
                }

                this.carSpeedValues.sort((a, b) => a - b);

                this.#tempCarSpeed =
                    this.#findMatchingCarSpeedWithinCharacteristicsArray(this.carSpeedValues, reducedCarSpeed);

                if (this.#tempCarSpeed === ResultStatus.ValueNotFound) {

                    this.#tempGearNumber = this.#tempGearNumber - 1;

                    this.#tempGearObj = this.#getGearObjectByGearNumber(this.#tempGearNumber);

                }
                else {

                    this.#boolIsCicleEnded = true;
                }
            }
            else if (this.#tempGearNumber === GearsEnum["1"]) {

                this.carSpeedValues.sort((a, b) => a - b);

                this.#tempCarSpeed =
                    this.#findMatchingCarSpeedWithinCharacteristicsArray(this.carSpeedValues, reducedCarSpeed);

                // TO DO filter engine speed values from 0 engine speed to up-shifting speed

                this.#boolIsCicleEnded = true;
            }

        } while (this.#boolIsCicleEnded === false);

        if (this.#tempCarSpeed === ResultStatus.ValueNotFound) {

            this.#reducedCarSpeed = 0;

            // TO DO eventually to throw an error

        } else {

            this.#reducedCarSpeed = this.#tempCarSpeed;

            this.#currentGearNumber = this.#tempGearNumber;

            this.currentGearObj = this.#tempGearObj;
        }

        return this.#reducedCarSpeed;

    }  // End #findMatchingCharacteristics()

    #findMatchingSpeedForGear(gearObj, reducedCarSpeed) {

        this.carSpeedValues = Object.values(gearObj.carSpeedFromEngineSpeed);

        this.#reducedCarSpeed
            = this.#findMatchingCarSpeedWithinCharacteristicsArray(this.carSpeedValues, reducedCarSpeed);

        if (this.#tempCarSpeed = ResultStatus.ValueNotFound) {

            this.#tempCarSpeed = 0;

            // TO DO = eventually to throw an exeption (error) here
        }    

        return this.#reducedCarSpeed;
    }

    #calculateReducedSpeedByInertia() {

        if (this.carSpeed <= 0)
            return 0;

        this.#reducedCarSpeed = this.#calculateReducedCarSpeedByPercents(this.#INERTIAL_DECALARATION_PERCENTS);

        return this.#reducedCarSpeed;

    }

    #calculateReducedSpeedByBreaking(breakPedalValue) {

        if (this.carSpeed <= 0)
            return 0;
       
        // get the speed reduction's percentage from a JS file / object
        // ../JsonArrays/BreakDecelerationCharacteristicsV2
        this.#estimatedBreakPercents = this.#getBreakingPercentage(breakPedalValue);

        // Calculate the car speed after reduction. Calculated car's speed
        // can have any value.
        this.#reducedCarSpeed = this.#calculateReducedCarSpeedByPercents(this.#estimatedBreakPercents);

        //// Goes through all car's speeds of all gear characteristics and finds
        //// the matching value to the calculated reduced car's speed.
        //// Also finds current manual gear number, #currentGearObj.
        //this.#reducedCarSpeed = this.#findMatchingCharacteristics(this.#reducedCarSpeed);

        return this.#reducedCarSpeed;
    }

    resetOnEngineStop() {
        // I am not really sure if they all need to reset but just in case.
        this.#currentGearNumber = null;
        this.currentManualGearObj = null;
        this.currentDomGearObj = null;
        this.#calculatedGasPosition = 0;
        this.prevDomGearObj = null;
        this.currentGearObj = null;

        this.#tempGearObj = null;
        this.prevGearObj = null;
    }

    //#region ManageAutoGearShifts

    manageOnRunningCarEngineOff() {

        this.carSpeed = this.carSpeed - 1;

        if (this.carSpeed < 0)
            this.carSpeed = 0;
    }

    manageOnSecondBreakingApplied(intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === this.#CRUISING_BREAK_POSITION) {

            if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                // Above
                // #CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK is the cruising speed 
                // when gas pedal is not pressed and break is applied with position 1.
                // Also auto gear is either on "D" or fixed on "1". Added as a constant for
                // easear access. Calculated from a Js file on each class instantiation

                this.belowNormEngineSpeed =
                    this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

                // Here I have two types of engine speeds - #belowNormEngineSpeed is the one
                // which takes care when car moves at cruising speeds and break pedal is pressed
                // It is is needed because the gas pedal gets returned at position 0 diring breaking
                // and can not be used as a indicator what is the engine speed.

                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard, this.engineSpeed - used in all other
                // cases when gas pedal is pressed or released to 0 but no breaking is applied.

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            } // End if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) Still in if (intBreakPedalPositionValue === 1) 
            else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                    this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK;
                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

                    this.#calculatedGasPosition = 0;
                    return;
                }

                this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            }  // End else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK)
        }
        else if (intBreakPedalPositionValue > this.#CRUISING_BREAK_POSITION) {

            // Reducing the car's speed directly without going through upper gears
            // 
            this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

            if (this.carSpeed === 0) {

                // keeping track of calculatedGasPosition for when it is needed again
                this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;
                this.#calculatedGasPosition = 0;
                return;
            }

            // Now matching it against the charcteristic's speeds for this gear
            this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

            // keeping track of calculatedGasPosition for when it is needed again
            this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);
        }
    }

    manageOnSecondNoBreakingApplied(intGasPedalPositionValue) {

        // CRUISING_CAR_SPEED_FIRST_GEAR is the cruising speed when gas pedal is not pressed and 
        // break is not applied. Also auto gear is either on "D" or directly on "1".
        // Also means the car is moving slowly forward. Same applys when break pedal
        // is pressed to position 1 -  the car is moving slowly forward.
        if ((intGasPedalPositionValue > 0) || (this.#calculatedGasPosition > 0)) {

            // Calculates gas position based on the current gas pedal position
            // and the previuos (from previous cicle) calculated gas position.
            // That allows gradually to increase or decrease engine's and car's speed
            this.#calculatedGasPosition = this.calculateGasPosition(intGasPedalPositionValue);

            // Gets engine speed from EngineCharacteristicsObj based on the 
            // calculated gas position.
            this.engineSpeed = this.#getEngineSpeedFromGasPosition(this.#calculatedGasPosition);

            // Gets car's speed based on currentGearObj and engine speed
            this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.engineSpeed);

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed
                = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

        }
        else if ((intGasPedalPositionValue === 0) && (this.#calculatedGasPosition === 0)) {

            // Here I have two types of engine speeds - #belowNormEngineSpeed is the one 
            // which takes care when car moves at cruising speeds and break pedal is pressed
            // It is is needed because the gas pedal gets returned at position 0 diring breaking
            // and can not be used as a indicator what is the engine speed.

            this.belowNormEngineSpeed =
                this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

            if (this.belowNormEngineSpeed < this.BELOW_NORM_ENGINE_SPEED_MAX) {

                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard one this.engineSpeed - used in all other cases
                // when gas pedal is pressed or released to 0 but no breaking is applied.
                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

            }
            else if (this.belowNormEngineSpeed >= this.BELOW_NORM_ENGINE_SPEED_MAX) {

                this.engineSpeed = this.IDLE_ENGINE_SPEED;

                this.carSpeed = this.#CRUISING_CAR_SPEED_SECOND_GEAR;
            }

            // The other engine speed is the standard, this.engineSpeed - used in all other
            // cases when gas pedal is pressed or released to 0 but no breaking is applied.

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

        } // End else if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR)
    }

    manageOnFirstBreakingApplied(intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === this.#CRUISING_BREAK_POSITION) {

            if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                // Above
                // #CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK is the cruising speed 
                // when gas pedal is not pressed and break is applied with position 1.
                // Also auto gear is either on "D" or fixed on "1". Added as a constant for
                // easear access. Calculated from a Js file on each class instantiation

                this.belowNormEngineSpeed =
                    this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

                // Here I have two types of engine speeds - #belowNormEngineSpeed is the one
                // which takes care when car moves at cruising speeds and break pedal is pressed
                // It is is needed because the gas pedal gets returned at position 0 diring breaking
                // and can not be used as a indicator what is the engine speed.

                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard, this.engineSpeed - used in all other
                // cases when gas pedal is pressed or released to 0 but no breaking is applied.

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            } // End if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) Still in if (intBreakPedalPositionValue === 1) 
            else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                    this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                    if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                        this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK;
                        // keeping track of calculatedGasPosition for when it is needed again
                        this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

                        this.#calculatedGasPosition = 0;
                        return;
                    }

                    this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                    // The engine speed which will show at the engine speed meters
                    this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);
             
            }  // End else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK)
        }
        else if (intBreakPedalPositionValue > this.#CRUISING_BREAK_POSITION) {

                // Reducing the car's speed directly without going through upper gears
                // 
                this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                if (this.carSpeed === 0) {

                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;
                    this.#calculatedGasPosition = 0;
                    return;
                }

                // Now matching it against the charcteristic's speeds for this gear
                this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);
        }
    }

    manageOnFirstNoBreakingApplied(intGasPedalPositionValue) {

        // CRUISING_CAR_SPEED_FIRST_GEAR is the cruising speed when gas pedal is not pressed and 
        // break is not applied. Also auto gear is either on "D" or directly on "1".
        // Also means the car is moving slowly forward. Same applys when break pedal
        // is pressed to position 1 -  the car is moving slowly forward.
        if ((intGasPedalPositionValue > 0) || (this.#calculatedGasPosition > 0)) {

            // Calculates gas position based on the current gas pedal position
            // and the previuos (from previous cicle) calculated gas position.
            // That allows gradually to increase or decrease engine's and car's speed
            this.#calculatedGasPosition = this.calculateGasPosition(intGasPedalPositionValue);

            // Gets engine speed from EngineCharacteristicsObj based on the 
            // calculated gas position.
            this.engineSpeed = this.#getEngineSpeedFromGasPosition(this.#calculatedGasPosition);

            // Gets car's speed based on currentGearObj and engine speed
            this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.engineSpeed);

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed
                = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

        }
        else if ((intGasPedalPositionValue === 0) && (this.#calculatedGasPosition === 0)) {

            // Here I have two types of engine speeds - #belowNormEngineSpeed is the one 
            // which takes care when car moves at cruising speeds and break pedal is pressed
            // It is is needed because the gas pedal gets returned at position 0 diring breaking
            // and can not be used as a indicator what is the engine speed.

            this.belowNormEngineSpeed =
                this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

            if (this.belowNormEngineSpeed < this.BELOW_NORM_ENGINE_SPEED_MAX) {

                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard one this.engineSpeed - used in all other cases
                // when gas pedal is pressed or released to 0 but no breaking is applied.
                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);
            }
            else if (this.belowNormEngineSpeed >= this.BELOW_NORM_ENGINE_SPEED_MAX) {

                this.engineSpeed = this.IDLE_ENGINE_SPEED;

                this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR;
            }

            // The other engine speed is the standard, this.engineSpeed - used in all other
            // cases when gas pedal is pressed or released to 0 but no breaking is applied.

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

        } // End else if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR)
    }

    manageOnReverseBreakingApplied(intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === this.#CRUISING_BREAK_POSITION) {

            if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                // Above
                // #CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK is the cruising speed 
                // when gas pedal is not pressed and break is applied with position 1.
                // Also auto gear is either on "D" or fixed on "1". Added as a constant for
                // easear access. Calculated from a Js file on each class instantiation

                this.belowNormEngineSpeed =
                    this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

                // Here I have two types of engine speeds - #belowNormEngineSpeed is the one
                // which takes care when car moves at cruising speeds and break pedal is pressed
                // It is is needed because the gas pedal gets returned at position 0 diring breaking
                // and can not be used as a indicator what is the engine speed.

                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard, this.engineSpeed - used in all other
                // cases when gas pedal is pressed or released to 0 but no breaking is applied.

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            } // End if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) Still in if (intBreakPedalPositionValue === 1) 
            else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                    this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK;
                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

                    this.#calculatedGasPosition = 0;
                    return;
                }

                this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            }  // End else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK)
        }
        else if (intBreakPedalPositionValue > this.#CRUISING_BREAK_POSITION) {

            // Reducing the car's speed directly without going through upper gears
            // 
            this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

            if (this.carSpeed === 0) {

                // keeping track of calculatedGasPosition for when it is needed again
                this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;
                this.#calculatedGasPosition = 0;
                return;
            }

            // Now matching it against the charcteristic's speeds for this gear
            this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

            // keeping track of calculatedGasPosition for when it is needed again
            this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);
        }
    }

    manageOnReverseNoBreakingApplied(intGasPedalPositionValue) {

        // CRUISING_CAR_SPEED_FIRST_GEAR is the cruising speed when gas pedal is not pressed and 
        // break is not applied. Also auto gear is either on "D" or directly on "1".
        // Also means the car is moving slowly forward. Same applys when break pedal
        // is pressed to position 1 -  the car is moving slowly forward.
        if ((intGasPedalPositionValue > 0) || (this.#calculatedGasPosition > 0)) {

            // Calculates gas position based on the current gas pedal position
            // and the previuos (from previous cicle) calculated gas position.
            // That allows gradually to increase or decrease engine's and car's speed
            this.#calculatedGasPosition = this.calculateGasPosition(intGasPedalPositionValue);

            // Gets engine speed from EngineCharacteristicsObj based on the 
            // calculated gas position.
            this.engineSpeed = this.#getEngineSpeedFromGasPosition(this.#calculatedGasPosition);

            // Gets car's speed based on currentGearObj and engine speed
            this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.engineSpeed);

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed
                = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

        }
        else if ((intGasPedalPositionValue === 0) && (this.#calculatedGasPosition === 0)) {

            // Here I have two types of engine speeds - #belowNormEngineSpeed is the one 
            // which takes care when car moves at cruising speeds and break pedal is pressed
            // It is is needed because the gas pedal gets returned at position 0 diring breaking
            // and can not be used as a indicator what is the engine speed.

            this.belowNormEngineSpeed =
                this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

            if (this.belowNormEngineSpeed < this.BELOW_NORM_ENGINE_SPEED_MAX) {


                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard one this.engineSpeed - used in all other cases
                // when gas pedal is pressed or released to 0 but no breaking is applied.
                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

            }
            else if (this.belowNormEngineSpeed >= this.BELOW_NORM_ENGINE_SPEED_MAX) {

                this.engineSpeed = this.IDLE_ENGINE_SPEED;

                this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR;
            }

            // The other engine speed is the standard, this.engineSpeed - used in all other
            // cases when gas pedal is pressed or released to 0 but no breaking is applied.

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

        } // End else if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR)
    }

    manageOnDirectGearBreakingApplied(intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === this.#CRUISING_BREAK_POSITION) {

            if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                // Above
                // #CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK is the cruising speed 
                // when gas pedal is not pressed and break is applied with position 1.
                // Also auto gear is either on "D" or fixed on "1". Added as a constant for
                // easear access. Calculated from a Js file on each class instantiation

                this.belowNormEngineSpeed =
                    this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

                // Here I have two types of engine speeds - #belowNormEngineSpeed is the one
                // which takes care when car moves at cruising speeds and break pedal is pressed
                // It is is needed because the gas pedal gets returned at position 0 diring breaking
                // and can not be used as a indicator what is the engine speed.

                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard, this.engineSpeed - used in all other
                // cases when gas pedal is pressed or released to 0 but no breaking is applied.

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            } // End if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) Still in if (intBreakPedalPositionValue === 1) 
            else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                if (this.#currentGearNumber === GearsEnum["1"]) {

                    this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                    if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                        this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK;
                        // keeping track of calculatedGasPosition for when it is needed again
                        this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

                        this.#calculatedGasPosition = 0;
                        return;
                    }

                    this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                    // The engine speed which will show at the engine speed meters
                    this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

                } // End  if (currentGearNumber === GearsEnum["1"])
                else {

                    // Calculates gas position based on the current gas pedal position
                    // and the previuos (from previous cicle) calculated gas position.
                    // That allows gradually to increase or decrease engine's and car's speed
                    this.#calculatedGasPosition =
                        this.#calculateGasPositionOnDecrementWithZeroCheck();

                    // Gets engine speed from EngineCharacteristicsObj based on the 
                    // calculated gas position.
                    this.engineSpeed = this.#getEngineSpeedFromGasPosition(this.#calculatedGasPosition);

                    // Checks if the current engine speed is above or bellow gear shifting engine speed.
                    // If needed it shifts the gear number up or down. Main function in auto gear shifting.
                    // Eventually it recalculates and sets new values for:
                    // this.#currentGearNumber, this.currentGearObj, this.engineSpeed this.#calculatedGasPosition
                    this.checkForGearShiftRecalculateEngineSpeedGasPosition(this.engineSpeed);

                    // Getting the car's speed
                    this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.engineSpeed);

                    // Now reducing it
                    this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                    // Is it possible for the car speed to be reduced from any gear number down to
                    // #CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK while break position is on position 1 ??
                    // Currently I can not determine. Need to think this over. Put it just in case.
                    if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK) {

                        this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK;
                        // keeping track of calculatedGasPosition for when it is needed again
                        this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;
                        this.#calculatedGasPosition = 0;
                        return;
                    }

                    // Goes through all car's speeds of all gear characteristics and finds
                    // the matching value to the calculated reduced car's speed.
                    // Also finds engine speed, current manual gear number, #currentGearObj
                    this.carSpeed = this.#findMatchingCharacteristics(this.carSpeed);

                    this.engineSpeed = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                    // The engine speed which will show at the engine speed meters
                    this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

                }   // End  else for (currentGearNumber === GearsEnum["1"])
            }  // End else if (this.carSpeed > this.#CRUISING_CAR_SPEED_FIRST_GEAR_AT_CRUISING_BREAK)
        }  // End  if (intBreakPedalPositionValue === this.#CRUISING_BREAK_POSITION)
        else if (intBreakPedalPositionValue > this.#CRUISING_BREAK_POSITION) {

            if (this.#currentGearNumber === GearsEnum["1"]) {

                // Reducing the car's speed directly without going through upper gears
                // 
                this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                if (this.carSpeed === 0) {

                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;
                    this.#calculatedGasPosition = 0;
                    return;
                }

                // Now matching it against the charcteristic's speeds for this gear
                this.carSpeed = this.#findMatchingSpeedForGear(this.currentGearObj, this.carSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            } // End  if (currentGearNumber === GearsEnum["1"])
            else {

                // Calculates gas position based on the current gas pedal position
                // and the previuos (from previous cicle) calculated gas position.
                // That allows gradually to increase or decrease engine's and car's speed
                this.#calculatedGasPosition =
                    this.#calculateGasPositionOnDecrementWithZeroCheck();

                // Gets engine speed from EngineCharacteristicsObj based on the 
                // calculated gas position.
                this.engineSpeed = this.#getEngineSpeedFromGasPosition(this.#calculatedGasPosition);

                // Checks if the current engine speed is above or bellow gear shifting engine speed.
                // If needed it shifts the gear number up or down. Main function in auto gear shifting.
                // Eventually it recalculates and sets new values for:
                // this.#currentGearNumber, this.currentGearObj, this.engineSpeed this.#calculatedGasPosition
                this.checkForGearShiftRecalculateEngineSpeedGasPosition(this.engineSpeed);

                // Getting the car's speed
                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.engineSpeed);

                // Now reducing it
                this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);

                if (this.carSpeed <= this.#CRUISING_CAR_SPEED_FIRST_GEAR) {

                    this.#currentGearNumber = 1;
                    this.currentGearObj = this.#getGearObjectByGearNumber(this.#tempGearNumber);

                    // keeping track of calculatedGasPosition for when it is needed again
                    this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;
                    this.#calculatedGasPosition = 0;
                    return;
                }

                // Goes through all car's speeds of all gear characteristics and finds
                // the matching value to the calculated reduced car's speed.
                // Also finds engine speed, current manual gear number, #currentGearObj
                this.carSpeed = this.#findMatchingCharacteristics(this.carSpeed);

                this.engineSpeed = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The engine speed which will show at the engine speed meters
                this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);

            }   // End  else for (currentGearNumber === GearsEnum["1"])
        }
            ///   else if (intBreakPedalPositionValue === this.#CRUISING_BREAK_POSITION) {}*/
    }  // End  method manageOnDirectGearBreakingApplied

    manageOnDirectGearNoBreakingApplied(intGasPedalPositionValue, prevAutoGearNumber) {

        // CRUISING_CAR_SPEED_FIRST_GEAR is the cruising speed when gas pedal is not pressed and 
        // break is not applied. Also auto gear is either on "D" or directly on "1".
        // Also means the car is moving slowly forward. Same applys when break pedal
        // is pressed to position 1 -  the car is moving slowly forward.
        if ((intGasPedalPositionValue > 0) || (this.#calculatedGasPosition > 0)) {

            // Calculates gas position based on the current gas pedal position
            // and the previuos (from previous cicle) calculated gas position.
            // That allows gradually to increase or decrease engine's and car's speed
            this.#calculatedGasPosition = this.calculateGasPosition(intGasPedalPositionValue);

            // Gets engine speed from EngineCharacteristicsObj based on the 
            // calculated gas position.
            this.engineSpeed = this.#getEngineSpeedFromGasPosition(this.#calculatedGasPosition);

            // Checks if the current engine speed is above or bellow gear shifting engine speed.
            // If needed it shifts the gear number up or down. Main function in auto gear shifting.
            // Eventually it recalculates and sets new values for:
            // #currentGearNumber, #currentGearObj, #engineSpeed #calculatedGasPosition
            this.checkForGearShiftRecalculateEngineSpeedGasPosition(this.engineSpeed);

            // Gets car's speed based on currentGearObj and engine speed
            this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.engineSpeed);

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed
                = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

        }
        else if ((intGasPedalPositionValue === 0) && (this.#calculatedGasPosition === 0)) {

            // Here I have two types of engine speeds - #belowNormEngineSpeed is the one 
            // which takes care when car moves at cruising speeds and break pedal is pressed
            // It is is needed because the gas pedal gets returned at position 0 diring breaking
            // and can not be used as a indicator what is the engine speed.

            this.belowNormEngineSpeed =
                this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

            if (this.belowNormEngineSpeed < this.BELOW_NORM_ENGINE_SPEED_MAX) {


                this.belowNormEngineSpeed = this.belowNormEngineSpeed + 1;

                // keeping track of calculatedGasPosition for when it is needed again
                this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);

                // The other engine speed is the standard one this.engineSpeed - used in all other cases
                // when gas pedal is pressed or released to 0 but no breaking is applied.
                this.carSpeed = this.#getCarSpeedFromEngineSpeed(this.belowNormEngineSpeed);

            }
            else if (this.belowNormEngineSpeed >= this.BELOW_NORM_ENGINE_SPEED_MAX) {

                /*if (this.carSpeed === this.#CRUISING_CAR_SPEED_FIRST_GEAR) {}*/
                this.engineSpeed = this.IDLE_ENGINE_SPEED;
               
                this.carSpeed = this.#CRUISING_CAR_SPEED_FIRST_GEAR;
            }

            // The other engine speed is the standard, this.engineSpeed - used in all other
            // cases when gas pedal is pressed or released to 0 but no breaking is applied.

            // The engine speed which will show at the engine speed meters
            this.#displayEngineSpeed = this.IDLE_ENGINE_SPEED;

        } // End else if (this.carSpeed < this.#CRUISING_CAR_SPEED_FIRST_GEAR

    } // End method manageOnDirectGearNoBreakingApplied

    manageOnNeutral(intBreakPedalPositionValue) {

        this.carSpeed = this.#calculateReducedSpeedByInertia();

        if (intBreakPedalPositionValue > 0) {

            this.carSpeed = this.#calculateReducedSpeedByBreaking(intBreakPedalPositionValue);
        }

        // Actually currentGearObj is null always on neutral shift.
        // I need to rethink the logic here
        if (this.currentGearObj === null) {

            this.carSpeed = 0;
            this.engineSpeed = 0;
            this.#calculatedGasPosition = 0;
        }
        else {

            // Goes through all car's speeds of all gear characteristics and finds
            // the matching value to the calculated reduced car's speed.
            // Also finds engine speed, current manual gear number, #currentGearObj
            this.carSpeed = this.#findMatchingCharacteristics(this.carSpeed);

            this.engineSpeed = this.#getEngineSpeedFromCarSpeedNewVersion(this.carSpeed);

            // keeping track of calculatedGasPosition for when it is needed again
            this.#calculatedGasPosition = this.#setCalculatedGasPosition(this.engineSpeed);
        }


        // The engine speed which will show at the engine speed meters
        /*this.#displayEngineSpeed = this.#setDisplayEngineSpeed(this.carSpeed);*/
    }

    manageOnPark() {

        if (this.currentGearObj !== null)       
            this.#setManualGearObjectToNull();
    }

    //#endregion ManageAutoGearShifts

    #setManualGearObjectToNull() {

        this.currentGearObj = null;
    }

    // Called from GearBoxManager after currentManualDomGearObj is detrmined
    // Based on currentManualDomGearObj.gearNumber currentGearObj is found and assigned
    setManualGearObject(incomingGearObj, boollIsDirectToNeutralShift) {

        if (incomingGearObj === null) {

            this.currentGearObj = null;
            return;
        }

        // IMPORTANT - this if must be before the next
        if (boollIsDirectToNeutralShift === true) {

            return;
        }

        if ((incomingGearObj.gearNumber === GearsEnum["P"])
            || (incomingGearObj.gearNumber === GearsEnum["N"])) {

            this.currentGearObj = null;
            return;
        }

        this.currentGearObj = EngineCharacteristicsObj.engineGearCharacteristics
            .find(gearObj => gearObj.gearNumber === incomingGearObj.gearNumber)  
    }

    getCurrentDomGearObjByAutoGearNumber(autoGearNumber) {

        if (autoGearNumber === GearsEnum["P"])

            this.currentDomGearObj = null;

        else if (autoGearNumber === GearsEnum["D"])

            this.currentDomGearObj = this.#arrManualDomGears
                .find(manualGear => manualGear.gearNumber === GearsEnum["1"]);
        else

            this.currentDomGearObj = this.#arrManualDomGears
                .find(manualGear => manualGear.gearNumber === autoGearNumber);

        return this.currentDomGearObj;
    }

    // Called from within #findMatchingCharacteristics()
    // It is needed to filter ranges of car speed values.
    // That is in order to find the closest matching value to the reduced car speed.
    // Gears 1 and 5 are scannned for all values. For gears 2 to 4 only the working ranges are scanned.
    getCarUpperSpeedLimitFromEngineSpeed(currentGearObj) {

        // Not needed any more
        //this.carSpeedDownLimit =
        //    currentGearObj.carSpeedFromEngineSpeed[currentGearObj.downShiftingEngineSpeed];

        this.carSpeedUpperLimit =
            currentGearObj.carSpeedFromEngineSpeed[currentGearObj.downShiftingBreakEngineSpeed];
    }

    setCurrentManualGearNumber() {

        if (this.currentGearObj !== null)

            this.#currentGearNumber = this.currentGearObj.gearNumber;
    }

    get getIsGasPositionChanged() {

        return this.boolIsGasPositionChanged;
    }

    getCarSpeedFromEngineSpeedToZero() {

        this.carSpeed = 0;
    }

    set assignManualDomGears(arrManualDomGears) {

        this.#arrManualDomGears = arrManualDomGears;
    }

    get getEngineSpeed() {

        return this.#displayEngineSpeed;
    }

    set setCarSpeed(carSpeed) {

        this.carSpeed = carSpeed;
    }

    get getCarSpeed() {

        return this.carSpeed;
    }

    get getCurrentGearObj() {

        return this.currentGearObj;
    }

    get getPrevGearObj() {

        return this.prevGearObj;
    }


    getDomGearObjByGearNumber(gearNumber) {

        this.tempManualDomGear = this.#arrManualDomGears
            .find(manualGear => manualGear.gearNumber === gearNumber);

        return this.tempManualDomGear;
    }

    get getIsGearShifted() {

        return this.#boolIsGearShifted;
    }

    reSetIsGearShifted() {

        this.#boolIsGearShifted=false;
    }

    get getCalculatedGasPosition() {

        return this.#calculatedGasPosition;
    }

    get getCurrentGearNumber() {

        return this.#currentGearNumber;
    }

}

export default GearShiftsProcessor;