


import EnumGenericStatusObj from './Enums/GenericStatusEnum.js';

const EngineClass = class EngineObj {

    "use strict";

    intGasPedalPositionValue; 

    ENGINE_SPEED_PER_BAR; NUMBER_OF_IDLE_BARS; MAX_ENGINE_STARTING_SPEED; IS_IDLE_SPEED_PULSING;

    constructor() {

        this.GenericStatusObj = EnumGenericStatusObj;

        /// making constants globally available

        const GAS_PEDAL_UNITS = 25;
        this.GAS_PEDAL_UNITS = GAS_PEDAL_UNITS;

        const ENGINE_SPEED_METER_WITH_BARS_UNITS = 22;
        this.ENGINE_SPEED_METER_WITH_BARS_UNITS = ENGINE_SPEED_METER_WITH_BARS_UNITS;

        const IDLE_ENGINE_SPEED = 900;
        this.IDLE_ENGINE_SPEED = IDLE_ENGINE_SPEED;

        const MAX_ENGINE_SPEED = 4950;
        this.MAX_ENGINE_SPEED = MAX_ENGINE_SPEED;

        const GAS_PEDAL_ENGINE_SPEED = this.MAX_ENGINE_SPEED - this.IDLE_ENGINE_SPEED;
        this.GAS_PEDAL_ENGINE_SPEED = GAS_PEDAL_ENGINE_SPEED;

        const ENGINE_REVS_PER_GAS_PEDAL_UNIT = this.GAS_PEDAL_ENGINE_SPEED / this.GAS_PEDAL_UNITS;
        this.ENGINE_REVS_PER_GAS_PEDAL_UNIT = ENGINE_REVS_PER_GAS_PEDAL_UNIT;

        const ENGINE_INERTIAL_DELAY_PERIODS_DURATION = 12;
        this.ENGINE_INERTIAL_DELAY_PERIODS_DURATION = ENGINE_INERTIAL_DELAY_PERIODS_DURATION;

        const IDLE_PULSE_PERIOD_DURATION = 2;
        this.IDLE_PULSE_PERIOD_DURATION = IDLE_PULSE_PERIOD_DURATION;

        const IS_IDLE_SPEED_PULSING = true;
        this.IS_IDLE_SPEED_PULSING = IS_IDLE_SPEED_PULSING;

        const ENGINE_SPEED_PER_BAR =
            Math.floor(this.MAX_ENGINE_SPEED / this.ENGINE_SPEED_METER_WITH_BARS_UNITS);
        this.ENGINE_SPEED_PER_BAR = ENGINE_SPEED_PER_BAR;

        // This should determine if engine speed has to be delayed
        // i.e. to imitate slight inertial delays between thes gas pedal being
        // pressed and te engine reaction
        //const IS_ENGINE_SPEED_INERTIAL = true;
        //this.IS_ENGINE_SPEED_INERTIAL = IS_ENGINE_SPEED_INERTIAL;

        this.engineSpeed = 0;

        this.calculatedGasPosition = -1;

        this.boolIsEngineStarting = false;
        this.boolIsEngineRunning = false;
        this.engineSpeed = 0; this.localCounter = 0;

        this.boolIsEngineChecked = false; this.checkResult; this.boolIsFirstCheck=true;

        // Not used any more
        // this.arrEngineSpeed = new Array(44).fill(this.IDLE_ENGINE_SPEED);
    }

    #checkForPulsingIdle() {

        // Switching pulsing ON / OFF idle bar for N periods
        if (this.boolIsToIncrement === true) {

            if (this.localCounter < this.IDLE_PULSE_PERIOD_DURATION) {

                this.localCounter++;
            }
            else {
                this.boolIsToIncrement = false;
            }

            return this.ENGINE_REVS_PER_GAS_PEDAL_UNIT;
        }
        else {
            if (this.localCounter > 0) {

                this.localCounter--;
            }
            else {
                this.boolIsToIncrement = true;
            }

            return 0;
        }
    }

    reduceGasPosition() {

        this.calculatedGasPosition = this.calculatedGasPosition - 1;
        
        return this.calculatedGasPosition;
    }

    calculateGasPosition(intGasPedalPositionValue) {

        if (intGasPedalPositionValue > this.calculatedGasPosition) {

            this.calculatedGasPosition = this.calculatedGasPosition + 1;
        }
        else if (intGasPedalPositionValue < this.calculatedGasPosition) {

            this.calculatedGasPosition = this.calculatedGasPosition - 1;
        }

        return this.calculatedGasPosition;
    }

    manageEngineSpeed(intIncomingGasPositionValue) {

        if (intIncomingGasPositionValue === 0) {

            if (this.calculatedGasPosition > 0) {

                this.calculatedGasPosition = this.reduceGasPosition();

                this.engineSpeed = this.calculatedGasPosition * this.ENGINE_REVS_PER_GAS_PEDAL_UNIT;

                this.engineSpeed = this.engineSpeed + this.IDLE_ENGINE_SPEED;

                return;
            }

            this.engineSpeed = this.IDLE_ENGINE_SPEED;

            if (this.IS_IDLE_SPEED_PULSING === true) {

                this.engineSpeed = this.engineSpeed + this.#checkForPulsingIdle();
            }

            // this.setEngineInertialDelay(this.engineSpeed);         
        }
        else {

            this.calculatedGasPosition = this.calculateGasPosition(intIncomingGasPositionValue);

            this.engineSpeed = this.calculatedGasPosition * this.ENGINE_REVS_PER_GAS_PEDAL_UNIT;

            this.engineSpeed = this.engineSpeed + this.IDLE_ENGINE_SPEED;

            //this.setEngineInertialDelay(this.engineSpeed);

            //this.engineSpeed = this.getEngineInertialDelay()           
        }
    }


    // #region Inrertial Delay ==================
    // I am not using that inertial immitation any more
    setEngineInertialDelay(engineSpeed) {

        this.arrEngineSpeed.unshift(engineSpeed);
        this.arrEngineSpeed.pop();
    }

    getEngineInertialDelay() {

        return this.arrEngineSpeed[this.ENGINE_INERTIAL_DELAY_PERIODS_DURATION];
    }
    // #endregion Inrertial Delay ==================

    // #region Getters Setters

    set setNumberOfIdleBars(numberOfIdleBars) {

        this.NUMBER_OF_IDLE_BARS = numberOfIdleBars;
    }

    resetCalculatedGasPositionValue() {

        this.calculatedGasPosition = 0;
    }

    get getEngineSpeed() {

        return this.engineSpeed;
    }

    checkEngine() {

        return this.GenericStatusObj.AllCorrect;
    }

    set setEngineSpeed(engineSpeed) {

        this.engineSpeed = engineSpeed;
    }

    setEngineSpeedZero() {

        this.engineSpeed = 0;
    }

    set setRevsPerBar(engineRevsPerBar) {

        this.ENGINE_SPEED_PER_BAR = engineRevsPerBar;
    }

    get getEngineSpeedPerBar() {

        return this.ENGINE_SPEED_PER_BAR;
    }

    get getEngineMaxSpeed() {

        return this.MAX_ENGINE_SPEED;
    }


    set setIsEngineRunning(booleanValue) {

        this.boolIsEngineRunning = booleanValue;
    }

    get getIsEngineStarting() {

        return this.boolIsEngineStarting;
    }

    set setIsEngineStarting(booleanValue) {

        this.boolIsEngineStarting = booleanValue;
    }


// #endregion Getters Setters
}

export default EngineClass;