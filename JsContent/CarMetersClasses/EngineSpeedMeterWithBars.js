const EngineSpeedMeterWithBars = class EngineSpeedMeterWithBars {

    "use strict";

    boolIsEngineStarting = true;
    boolIsEngineRunning = false;

    MAX_ENGINE_SPEED = 0;

    ENGINE_REVS_PER_BAR = 0;

    oldTargetLevel;

    newTargetLevel = -1;

    indexLevel;

    inactiveColorClass = "inactive-color";

    allRevsBarsNode = document.querySelectorAll("#engineSpeedBarsMeter :not(.bar-blank-unit)");

    arrAllRevsBars;

    constructor() {

        this.arrAllRevsBars = Array.from(this.allRevsBarsNode);

        /// making it globally available
        const TOTAL_NUMBER_OF_BARS = this.arrAllRevsBars.length;
        this.TOTAL_NUMBER_OF_BARS = TOTAL_NUMBER_OF_BARS

        /// making it globally available
        const UPPER_REVS_ARRAY_INDEX = this.arrAllRevsBars.length - 1;
        this.UPPER_REVS_ARRAY_INDEX = UPPER_REVS_ARRAY_INDEX;

        const NUMBER_OF_IDLE_BARS = 4;
        this.NUMBER_OF_IDLE_BARS = NUMBER_OF_IDLE_BARS;

        this.oldTargetLevel = this.UPPER_REVS_ARRAY_INDEX;
    }

    shutDown() {

        this.displaySpeed(0);
        this.oldTargetLevel = this.UPPER_REVS_ARRAY_INDEX;
    }

    displaySpeed(intIncommingEngineSpeed) {

        let intCalculatedEngineSpeed = Math.ceil(intIncommingEngineSpeed / 225)

        if ((intCalculatedEngineSpeed < 0) || (intCalculatedEngineSpeed > this.TOTAL_NUMBER_OF_BARS))
            return;

        this.newTargetLevel = this.UPPER_REVS_ARRAY_INDEX - intCalculatedEngineSpeed;

        if (this.newTargetLevel === this.oldTargetLevel)
            return;

        this.indexLevel = this.oldTargetLevel;

        if (this.newTargetLevel < this.oldTargetLevel) {

            for (this.indexLevel;
                this.newTargetLevel < this.indexLevel;
                this.indexLevel--) {

                this.arrAllRevsBars[this.indexLevel].classList.remove(this.inactiveColorClass);
            }
        }    
        else if (this.newTargetLevel > this.oldTargetLevel) {

            for (this.indexLevel;
                this.newTargetLevel >= this.indexLevel;
                this.indexLevel++) {

                if (this.indexLevel < 0)
                    this.indexLevel = 0;

                this.arrAllRevsBars[this.indexLevel].classList.add(this.inactiveColorClass);
            }
        }

        this.oldTargetLevel = this.newTargetLevel;
    }

    get getNumberOfIdleBars() {

        return this.NUMBER_OF_IDLE_BARS;
    }

    get getRevsPerBar() {

        return this.ENGINE_REVS_PER_BAR;
    }

    set getMaxEngineSpeed_SetRevsPerBar(maxEngineSpeed) {

        this.MAX_ENGINE_SPEED = maxEngineSpeed;

        this.ENGINE_REVS_PER_BAR = this.MAX_ENGINE_SPEED / this.TOTAL_NUMBER_OF_BARS;
    }
}

export default EngineSpeedMeterWithBars;