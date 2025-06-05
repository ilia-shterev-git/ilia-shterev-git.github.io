
import EnumEngineStatusObj from './Enums/EngineStatusEnum.js';

import getRandomInteger from './UtilRandomizer.js';

const EngineStarterClass = class EngineStarterObj {

    "use strict";

    #EngineObj;

    #boolIsIsEngineStartingFinished; #engineStartingStatus;

    #maxNumberOfStartingBars;

    constructor(EngineArgs) {

        this.#EngineObj = EngineArgs;

        const ENGINE_SPEED_PER_BAR = this.#EngineObj.getEngineSpeedPerBar;
        this.ENGINE_SPEED_PER_BAR = ENGINE_SPEED_PER_BAR;

        const MIN_NUMBER_OF_STARTING_BARS = 3;
        this.MIN_NUMBER_OF_STARTING_BARS = MIN_NUMBER_OF_STARTING_BARS;

        // TO DO Needs to be hoocked and take values from a connected source.
        // Either from Car Obj or Digital engine speed meter
        const MIN_STARTING_SPEED = 225;
        this.MIN_STARTING_SPEED = MIN_STARTING_SPEED;

        const MAX_NUMBER_OF_STARTING_BARS = 6;
        this.MAX_NUMBER_OF_STARTING_BARS = MAX_NUMBER_OF_STARTING_BARS;

        const MIN_NUMBER_OF_STARTING_CICLES = 2;
        this.MIN_NUMBER_OF_STARTING_CICLES = MIN_NUMBER_OF_STARTING_CICLES;

        const MAX_NUMBER_OF_STARTING_CICLES = 5;
        this.MAX_NUMBER_OF_STARTING_CICLES = MAX_NUMBER_OF_STARTING_CICLES;

        const STARTER_PULSE_CLOCKS_DURATION = 7;
        this.STARTER_PULSE_CLOCKS_DURATION = STARTER_PULSE_CLOCKS_DURATION;

        /*this.#boolIsSystemsCheckOk = false;*/

        this.engineSpeed = 0; this.someVar = 0;

        this.numberOfStartingCicles = 0; this.cyclesCounter = 0; this.boolIsEngineSpeedAddition = true;

        this.currentMaxEngineStartingSpeed = 0;

        this.localCounter = 0;

        this.boolIsToIncrementCounter = true;

        this.#boolIsIsEngineStartingFinished = false; 

    }

    manageOnStarting() {

            if (this.boolIsFirstPass === true) {

                this.boolIsFirstPass = false;

                this.currentMaxEngineStartingSpeed =
                    this.#getRandomMaxStartingSpeed(this.MIN_NUMBER_OF_STARTING_BARS, this.MAX_NUMBER_OF_STARTING_BARS);

                this.numberOfStartingCicles =
                    this.#getRandomNumberOfStartingCicles(this.MIN_NUMBER_OF_STARTING_CICLES, this.MAX_NUMBER_OF_STARTING_CICLES);
            }

            if (this.cyclesCounter < this.numberOfStartingCicles) {

                // Here is where each cycle of rollng starter end

                this.#setStarterPulses();
            }
            else if (this.cyclesCounter === this.numberOfStartingCicles) {

                // Here is where all cycles of rollng starter end
                this.#boolIsIsEngineStartingFinished = true;

                this.#engineStartingStatus = EnumEngineStatusObj.EngineStarted;
            }

         // END if (this.#boolIsSystemsCheckOk === true)
    }

    #setStarterPulses() {

        if (this.boolIsToIncrementCounter === true) {

            // STARTER_PULSE_CLOCKS_DURATION, Number of cicles for one bar to appear and either 
            // disappear or another one to apppear. It is in the range of several of tens
            if (this.localCounter < this.STARTER_PULSE_CLOCKS_DURATION) {

                this.localCounter++;
            }
            else {
                
                this.boolIsToIncrementCounter = false;

                // Switching pulsing starting speed for N periods
                if (this.boolIsAdditionOfSpeed === true) {

                    if (this.engineSpeed < this.currentMaxEngineStartingSpeed) {

                        this.engineSpeed = this.engineSpeed + this.ENGINE_SPEED_PER_BAR;

                        if (this.engineSpeed === this.currentMaxEngineStartingSpeed) {

                            this.boolIsAdditionOfSpeed = false;
                        }
                    }
                    else {

                        this.boolIsAdditionOfSpeed = false;
                    }
                }
                else if (this.boolIsAdditionOfSpeed === false)  ///  this.boolIsAdditionOfSpeed === false
                {
                    if (this.engineSpeed > this.MIN_STARTING_SPEED) {

                        this.engineSpeed = this.engineSpeed - this.ENGINE_SPEED_PER_BAR;

                        if (this.engineSpeed <= this.MIN_STARTING_SPEED) {

                            this.boolIsAdditionOfSpeed = true;

                            // Inside this statement is the end of one full cicle of starter's rolling.
                            // I.e. the engine speed has gone from zero to max and back to zero.
                            // So next lines are for the end of the cicle.
                            this.cyclesCounter++;

                            this.currentMaxEngineStartingSpeed =
                                this.#getRandomMaxStartingSpeed(this.MIN_NUMBER_OF_STARTING_BARS, this.MAX_NUMBER_OF_STARTING_BARS);
                        }
                    }
                    else {

                        this.boolIsAdditionOfSpeed = true;
                    }
                } // END else if (this.boolIsAdditionOfSpeed === true)

                this.#EngineObj.setEngineSpeed = this.engineSpeed;

            } // END else if (this.localCounter === this.STARTER_PULSE_CLOCKS_DURATION)
        } // END  if (this.boolIsToIncrementCounter === true)
        else if (this.boolIsToIncrementCounter === false) 
        {

            this.boolIsToIncrementCounter = true;

            this.localCounter = 0;
        }
    }

    resetOnStart() {

        this.boolIsFirstPass = true;
        this.numberOfStartingCicles = 0;

        this.boolIsAdditionOfSpeed = true;

        this.localCounter = 0;
        this.boolIsToIncrementCounter = true;
        this.cyclesCounter = 0;

        this.#boolIsIsEngineStartingFinished = false;
    }

    #getRandomNumberOfStartingCicles(minNumberOfStartingCicles, maxNumberOfStartingCicles) {

        this.numberOfStartingCicles = getRandomInteger(minNumberOfStartingCicles, maxNumberOfStartingCicles);

        return this.numberOfStartingCicles;
    }

    #getRandomMaxStartingSpeed(minNumberOfStartingBars, maxNumberOfStartingBars) {

        this.#maxNumberOfStartingBars = getRandomInteger(minNumberOfStartingBars, maxNumberOfStartingBars);

        this.currentMaxEngineStartingSpeed = this.#maxNumberOfStartingBars * this.ENGINE_SPEED_PER_BAR;

        return this.currentMaxEngineStartingSpeed;
    }

    get getIsEngineStartingFinished() {

        return this.#boolIsIsEngineStartingFinished;
    }

    get getEngineStartingStatus() {

        return this.#engineStartingStatus;
    }
}

export default EngineStarterClass;