
import EnumGenericStatusObj from './Enums/GenericStatusEnum.js';

const BreakPedalClass = class BreakPedalObj {

    "use strict";

    boolIsBreakPedalPressed = false;

    classBorderColorGreen = "border-color-green";
    classBorderColorRed = "border-color-red";

    #boolIsPedalFirmlyPressed;

    #intBreakPedalPositionValue; #intPrevBreakPedalPositionValue;

    pBreakPedalValue = document.getElementById("breakPedalValue");
    breakPedal = document.getElementById("breakPedal");

    breakFirmPressSignaler = document.getElementById("breakFirmlyPressSignaler");

    constructor() {

        this.GenericStatusObj = EnumGenericStatusObj;

        const PEDAL_FIRMLY_PRESSED_VALUE = 2;
        this.PEDAL_FIRMLY_PRESSED_VALUE = PEDAL_FIRMLY_PRESSED_VALUE;

        const SIGNALING_PULSE_CLOCKS_DURATION = 578;
        this.SIGNALING_PULSE_CLOCKS_DURATION = SIGNALING_PULSE_CLOCKS_DURATION;

        const NUMBER_OF_SIGNALING_PERIODS = 3;
        this.NUMBER_OF_SIGNALING_PERIODS = NUMBER_OF_SIGNALING_PERIODS;

        this.BREAK_PEDAL_VALUE_FOR_PARTIAL_AUTO_RETRACT = 1;

        this.strBreakPedalPositionValue = "0";
        this.#intBreakPedalPositionValue = 0;

        this.intPrevBreakPedalPositionValue = -1;

        this.#intBreakPedalPositionValue = 0;

        this.#intPrevBreakPedalPositionValue = -1;

        this.breakPedal.value = this.strBreakPedalPositionValue;

        this.breakPedal.addEventListener("input", this.#cbSetBreakPedalPressed.bind(this));
        this.breakPedal.addEventListener("mouseup", this.#cbSetBreakPedalNOTPressed.bind(this));

        this.boolIsPedalCheckedForEngineStart = false;

        this.#boolIsPedalFirmlyPressed = false;

    }

    #getBreakPedalPosition() {

        this.strBreakPedalPositionValue = this.breakPedal.value;

        this.#intBreakPedalPositionValue = parseInt(this.strBreakPedalPositionValue);
    }

    #setBreakLabelValue() {

        if (this.#intBreakPedalPositionValue !== this.#intPrevBreakPedalPositionValue) {

            this.pBreakPedalValue.textContent = this.#intBreakPedalPositionValue.toString();

            this.#intPrevBreakPedalPositionValue = this.#intBreakPedalPositionValue;
        }
    }

    #setBreakPedalAutoRetraction() {

        this.#intBreakPedalPositionValue = this.#intBreakPedalPositionValue - 1;

        if (this.#intBreakPedalPositionValue < 0) {

            this.#intBreakPedalPositionValue = 0;
        }

        this.strBreakPedalPositionValue = this.#intBreakPedalPositionValue.toString();
        this.breakPedal.value = this.strBreakPedalPositionValue;
    }

    checkBreakPedalPositionCheckAutoRetract(boolIsIgnitionOnContact, boolIsEngineRunning) {

        this.#getBreakPedalPosition();

        if (this.boolIsBreakPedalPressed === false) {

            // We want to have break pedal auto retracting 
            // if it is not pressed or having value greater than 0
            // Unlike gas pedal, break pedal has additional requirements
            // Auto retract for any value if ignition contact is off and the engine is not running.
            // In any other case auto retract only if braek pedal is pressed under specific value.
            if (this.#intBreakPedalPositionValue > 0) {

                if ((boolIsIgnitionOnContact === false) && (boolIsEngineRunning === false)) {

                    this.#setBreakPedalAutoRetraction();
                }
                else {

                    // Auto retracting only for values bellow or equal to 
                    // BREAK_PEDAL_VALUE_FOR_PARTIAL_AUTO_RETRACT
                    if (this.#intBreakPedalPositionValue <= this.BREAK_PEDAL_VALUE_FOR_PARTIAL_AUTO_RETRACT) {

                        this.#setBreakPedalAutoRetraction();
                    }
                }
            }
        }

        this.#setBreakLabelValue();

    }

    #cbSetBreakPedalNOTPressed() {

        this.boolIsBreakPedalPressed = false;
    }

    get getIsBreakPedalPressed() {

        return this.boolIsBreakPedalPressed;
    }

    #cbSetBreakPedalPressed() {

        this.boolIsBreakPedalPressed = true;
    }

    //----------------------------------
    addAlarmingColor() {

        this.breakFirmPressSignaler.classList.add(this.classBorderColorRed);
    }

    removeAlarmingColor() {

        this.breakFirmPressSignaler.classList.remove(this.classBorderColorRed);
    }

    // ----------------------
    get getBreakPedalFirmlyPressedValue() {

        return this.PEDAL_FIRMLY_PRESSED_VALUE;
    }

    get getBreakPedalPosition() {

        return this.#intBreakPedalPositionValue;
    }

    get isBreakPedalFirmlyPressed() {

        this.#boolIsPedalFirmlyPressed = this.#intBreakPedalPositionValue >= this.PEDAL_FIRMLY_PRESSED_VALUE;

        return this.#boolIsPedalFirmlyPressed;
    }

    reportOnEngineStart() {

        return this.isBreakPedalFirmlyPressed;
    }

}

export default BreakPedalClass;