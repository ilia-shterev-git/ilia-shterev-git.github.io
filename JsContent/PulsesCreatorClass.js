


const PulsesCreatorClass = class PulsesCreatorObj {

    #TOTAL_PULSES_NUMBER; #PULSE_HALF_DURATION; 

    #pulsesCounter; #boolIsToIncrementCounter; #localCounter; #boolIsFullCycleEnded;

    #AlertObj;

    initReset() {

        this.#localCounter = 0;
        this.#boolIsToIncrementCounter = true;
        this.#pulsesCounter = 0;
        this.#boolIsFullCycleEnded = false;
    }
    constructor(AlertObj, totalsPulsesNumber, pulseDuration) {

        this.#AlertObj = AlertObj;

        this.#TOTAL_PULSES_NUMBER = totalsPulsesNumber;

        this.#PULSE_HALF_DURATION = pulseDuration;

        this.initReset();
    }

    clearAlert() {

        this.#AlertObj.removeAlarmingColor();
    }

    setPulses() {

        if (this.#boolIsToIncrementCounter === true) {

            if (this.#localCounter < this.#PULSE_HALF_DURATION) {

                this.#localCounter++;
            }
            else {

                this.#boolIsToIncrementCounter = false;

                this.#AlertObj.addAlarmingColor();
            }
        }
        else if (this.#boolIsToIncrementCounter === false) {

            if (this.#localCounter > 0) {

                this.#localCounter--;
            }
            else {

                this.#boolIsToIncrementCounter = true;

                this.#AlertObj.removeAlarmingColor();

                this.#pulsesCounter++;

                if (this.#pulsesCounter === this.#TOTAL_PULSES_NUMBER) {

                    this.#boolIsFullCycleEnded = true;

                }
            }

        }
    }

    get getIsFullCycleEnded() {

        return this.#boolIsFullCycleEnded;
    }
}

export default PulsesCreatorClass;