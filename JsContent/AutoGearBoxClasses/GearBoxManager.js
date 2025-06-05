


import EnumGenericStatusObj from '../Enums/GenericStatusEnum.js';

import GearsEnum from '../Enums/GearShiftsEnum.js';


const GearBoxManager = class GearBoxManager {

    #GearShiftsProcessorObj; #AutoGearBoxProcessorObj; #GearBoxDomWorkerObj;

    #currentAutoGearObj; #currentAutoGearNumber; #prevAutoGearNumber;

    #boollIsDirectToNeutralShift;

    #currentManualGearObj; #currentManualDomGearObj;
    #boolIsShiftingGears; boolIsFirstPassOnAutoGearShifting;
    currentGearNumber;

    #boolIsCarMoving; #targetAutoGear; #prevManualGearObj;

    #arrManualDomGears; #arrManualGears;  

    #DEFAULT_INITIAL_AUTO_GEAR; 

    boolIsCssClassPointerEventsNoneAdded; boolIsCssClassPointerEventsNoneRemoved;

    #prevGearObj; #engineSpeed; #carSpeed;

    constructor(AutoGearBoxProcessorArgs, GearShiftsProcessorArgs, GearBoxDomWorkerArgs) {

        this.#AutoGearBoxProcessorObj = AutoGearBoxProcessorArgs;
        this.#GearShiftsProcessorObj = GearShiftsProcessorArgs;
        this.#GearBoxDomWorkerObj = GearBoxDomWorkerArgs;

        this.autoGearBox = this.#GearBoxDomWorkerObj.getAutoGearBoxDomElement;

        // ==========    Arranging initial auto gear status
        this.arrAutoGears = this.#GearBoxDomWorkerObj.getAutoGearsArray,

        this.#AutoGearBoxProcessorObj.assignAutoGears = this.arrAutoGears;

        this.#AutoGearBoxProcessorObj
            .setCurrentAutoGearByGearObj = GearsEnum["P"];

        this.#AutoGearBoxProcessorObj.setCurrentDataSetNumber();

        this.#currentAutoGearObj = this.#AutoGearBoxProcessorObj.getCurrentAutoGearObj;

        this.#currentAutoGearNumber = this.#currentAutoGearObj.gearNumber;

        this.#GearBoxDomWorkerObj.setActiveGearCssClasses(this.#currentAutoGearObj.domAutoGear);

        this.#arrManualDomGears = this.#GearBoxDomWorkerObj.getManualGearsArray;

        this.#GearShiftsProcessorObj.assignManualDomGears = this.#arrManualDomGears;

        this.currentGearObj = null; //this.#prevManualGearNumber = null;

        const DEFAULT_INITIAL_AUTO_GEAR = this.#currentAutoGearObj.domAutoGear;
        this.#DEFAULT_INITIAL_AUTO_GEAR = DEFAULT_INITIAL_AUTO_GEAR;

        // Currently those lines are not needed as I know that initial value for auto gear
        // will be "P" and there is no corresponding manual gear for it
        //currentManualGearObj = #GearShiftsProcessorObj.getCurrentManualGearObj;

        //// The technical side of manual gears is set by the currentGearObj which is set bellow
        //// with setManualGearObjectByGearNumber()
        //this.#GearShiftsProcessorObj
        //    .setCurrentManualGearObjByAutoGearNumber = this.#currentAutoGearObj.gearNumber;

         // ==========   END  Arranging initial gear status

        this.boolIsCssClassPointerEventsNoneAdded = false; this.boolIsCssClassPointerEventsNoneRemoved = false;

        /*this.boolIsAutoGearCheckedOnEngineStart = false; this.boolIsWrongAutoGear = false;*/

        /*this.boolIsWrongAutoGear = false;*/

        // In these case I am declaring and setting them
        /*this.#resetCounterVarsOnEngineStart();*/

        this.autoGearBox.addEventListener("click", this.#cbAutoGearBoxShift.bind(this));

        this.currentDomGearObj = null; this.currentManualDomGear = null;

        this.boollIsDirectToNeutralShift = false;

        this.prevAutoGearNumber = null;

        // temps to be removed
        //this.#GearShiftsProcessorObj.setManualGearObjectByGearNumber=1;
        //this.#GearShiftsProcessorObj.setCurrentManualGearNumber();
        // temps to be removed
    }

    resetOnEngineStop() {

        this.#GearShiftsProcessorObj.resetOnEngineStop();
    }

    //#region ManageAutoGearShifts

    manageOnRunningCarEngineOff() {

        this.#GearShiftsProcessorObj.manageOnRunningCarEngineOff();
    }

    manageOnSecond(intGasPedalPositionValue, intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === 0) {

            this.#GearShiftsProcessorObj
                .manageOnSecondNoBreakingApplied(intGasPedalPositionValue);

        }
        else if (intBreakPedalPositionValue > 0) {

            this.#GearShiftsProcessorObj
                .manageOnSecondBreakingApplied(intBreakPedalPositionValue);
        }
    }

    manageOnFirst(intGasPedalPositionValue, intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === 0) {

            this.#GearShiftsProcessorObj
                .manageOnFirstNoBreakingApplied(intGasPedalPositionValue);

        }
        else if (intBreakPedalPositionValue > 0) {

            this.#GearShiftsProcessorObj
                .manageOnFirstBreakingApplied(intBreakPedalPositionValue);
        }
    }

    manageOnReverse(intGasPedalPositionValue, intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === 0) {

            this.#GearShiftsProcessorObj
                .manageOnReverseNoBreakingApplied(intGasPedalPositionValue);

        }
        else if (intBreakPedalPositionValue > 0) {

            this.#GearShiftsProcessorObj
                .manageOnReverseBreakingApplied(intBreakPedalPositionValue);
        }
    }

    manageOnPark() {

        this.#GearShiftsProcessorObj.manageOnPark();
    }

    manageOnNeutral(intBreakPedalPositionValue) {

        this.#GearShiftsProcessorObj
            .manageOnNeutral(intBreakPedalPositionValue, this.prevAutoGearNumber);
    }

    manageOnDirectGear(intGasPedalPositionValue, intBreakPedalPositionValue) {

        if (intBreakPedalPositionValue === 0) {

            this.#GearShiftsProcessorObj
                .manageOnDirectGearNoBreakingApplied(intGasPedalPositionValue);

        }
        else if (intBreakPedalPositionValue > 0) {

            // If break is applied all calculations are different. There are 2 criteria
            // which decide if the break pedal is pressed. intBreakPedalPositionValue
            // holds when the pedal is released and autoretracting or stays fixed
            // ---------------
            // First I estimate breaking percentage (breaking strenght) from an externa JS
            // file with all the breaking characteristics - BreakDecelerationCharacteristicsV2.js.
            // Then the current car's speed is reduced by those percents.

            // Since the resulting car's speed can be any I match it against 
            // the engine speed characteristics from EngineCharacteristics.js
            // If there is no exact match I get the closest one.
            // From the matching reduced car's speed current gear number is calculated
            // as well as Gas position value and engine speed

            this.#GearShiftsProcessorObj
                .manageOnDirectGearBreakingApplied(intBreakPedalPositionValue);

        }

        // Switches colors of the previous shifted gear and current
        if (this.#GearShiftsProcessorObj.getIsGearShifted === true) {

            this.#GearShiftsProcessorObj.reSetIsGearShifted();

            this.prevGearObj = this.#GearShiftsProcessorObj.getPrevGearObj;

            this.prevDomGearObj = this.#GearShiftsProcessorObj
                .getDomGearObjByGearNumber(this.prevGearObj.gearNumber);

            this.currentGearObj = this.#GearShiftsProcessorObj.getCurrentGearObj;

            this.currentDomGearObj = this.#GearShiftsProcessorObj
                .getDomGearObjByGearNumber(this.currentGearObj.gearNumber);

            this.#GearBoxDomWorkerObj
                .flipInactiveAndActiveGearCssClasses(this.prevDomGearObj, this.currentDomGearObj);
        }

        //this.#engineSpeed = this.#GearShiftsProcessorObj.getEngineSpeed;
        //this.#carSpeed = this.#GearShiftsProcessorObj.getCarSpeed;
    }

    //#endregion ManageAutoGearShifts

    get getEngineSpeed() {

        return this.#GearShiftsProcessorObj.getEngineSpeed;
    }

    get getCarSpeed() {

        return this.#GearShiftsProcessorObj.getCarSpeed;
    }
    set setCarSpeed(carSpeed) {

        this.#GearShiftsProcessorObj.setCarSpeed = carSpeed;
    }


    //#region AutoGearBoxShifting

    // called at the end of setAutoGearBoxShifting
    #shiftAutoGear() {

        // unsets / removes the active classes from the old current gear and sets it inactive
        this.#GearBoxDomWorkerObj.setInactiveGearCssClasses(this.#currentAutoGearObj.domAutoGear);

        // Here I send the obj itself as it will be checked for null. Auto gear position "P" has no
        // corresponding manual gear so this check is a must
        this.#GearBoxDomWorkerObj
            .setInactiveGearCssClassesWithNullCheck(this.currentDomGearObj);

        // increases or decreases #intCurrentDatSetNumber by 1 depending on  
        // the target position with respect to the current gear number
        this.#AutoGearBoxProcessorObj.shiftCurrentDatSetNumber();

        // Finds the next new auto gear and sets it as current
        this.#AutoGearBoxProcessorObj.setCurrentAutoGearObjByDataSetNumber();

        this.#currentAutoGearObj = this.#AutoGearBoxProcessorObj.getCurrentAutoGearObj;

        // Next I set manual gears, like which is current number, 
        // their CSS classes, active, inactive etc.

        // I have 2 types of manual gears objects.

        // One is related to the DOM.
        // ../ JsonArrays / GearsGroupManualGears.js'

        // It takes the DOM element by id and saves it in this type of obj.
        // Looks at it bellow
        //{
        //    gearNumber: GearsEnum["1"],
        //    domId: "manGearFirst",
        //    domManualGear: "someDomElement"
        //}

        // Through the Dom element I also manipulate CSS for active or inactive manuals gears.

        // The other manual gears object is related to the engine characteristics.
        // All about transmission, gas position, engine speed, 
        // car speed, gear shifting values, etc.

        /// ../ JsonArrays / EngineCharacteristics.js';

        // The link between the two manual gear sets is through gearNumber: XX property

        // Here I work with the Dom manual gear object.
        // Checks for correspondence between auto gears and manual gears
        // finds the new manual gear and sets it as current
        // #currentManualDomGear is present mostly for the purpose of setting the DOM
        // elements as inactive ad / or active.

        // sets the active classes of the new current gear and sets it active.
        // currentManualearObj and currentManualDomGearObj
        this.#GearBoxDomWorkerObj.setActiveGearCssClasses(this.#currentAutoGearObj.domAutoGear);


        // The technical side of manual gears is set by the currentGearObj which is set bellow
        // with getCurrentDomGearObjByAutoGearNumber()
        // This is a DOM object with purpose of setting active colors to it.
        this.currentDomGearObj = this.#GearShiftsProcessorObj
            .getCurrentDomGearObjByAutoGearNumber(this.#currentAutoGearObj.gearNumber);

        /*this.currentDomGearObj = this.#GearShiftsProcessorObj.getCurrentManualDomGearObj;*/

        // Here I send the obj itself as it will be checked for null. Auto gear position "P" has no
        // corresponding manual gear so this check is a must
        this.#GearBoxDomWorkerObj.setActiveGearCssClassesWithNullCheck(this.currentDomGearObj);

        // If this is the end of the auto stick travel, it is needed to set currentGearObj.
        // The currentGearObj contains all data from a JSON file for gas positions and car speed.
        // in the setGearObjectByGearNumber method. The currentGearObj contains all data
        // from a JSON file for gas positions and car speed
        // ../JsonArrays/EngineCharacteristics.js'
        if (this.#AutoGearBoxProcessorObj.getIsShiftingCicleEnded) {

            this.#boolIsShiftingGears = false;

            this.#currentAutoGearNumber = this.#currentAutoGearObj.gearNumber;

            if ((this.#currentAutoGearNumber === GearsEnum["N"])
                && (this.prevAutoGearNumber === GearsEnum["D"])) {

                this.boollIsDirectToNeutralShift = true;
            }

            this.#GearShiftsProcessorObj
                .setManualGearObject(this.currentDomGearObj, this.boollIsDirectToNeutralShift)

            this.#GearShiftsProcessorObj.setCurrentManualGearNumber();

            this.boollIsDirectToNeutralShift = false;

        }
    }

    checkForAllowedGearShifting(boolIsEngineRunning, boolIsCarMoving, boolIsBreakPedalFirmlyPressed) {

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

    // Called from the main clock cycle. But only when the auto gear is clicked and shifting.
    // When the shifting is finsished, i.e. the auto gear has moved from its current position to the
    // desired position it is not called any more. This can be achived either by setting a var along the
    // main clock cycle or calling it but leaving with return based on another var.
    setAutoGearBoxShifting(boolIsEngineRunning, boolIsCarMoving, boolIsBreakPedalFirmlyPressed) {

       // boolIsCarMoving = false;

        //if (this.#boolIsShiftingGears === false)
        //        return;

        if (this.boolIsFirstPassOnAutoGearShifting === true) {

            this.boolIsFirstPassOnAutoGearShifting = false;

            if (this.checkForAllowedGearShifting(boolIsEngineRunning,
                    boolIsCarMoving, boolIsBreakPedalFirmlyPressed) === false) {

                this.#boolIsShiftingGears = false;
                return;
            }

            this.prevAutoGearNumber = this.#currentAutoGearNumber;

        }

        this.#shiftAutoGear();
        
    }

    // This event listener catches bubling events on the gear section 
    /// which inludes all gear blocks  this.RoadObj.boolIsRoadMoving = true;
    #cbAutoGearBoxShift(event) {

        let targetElement = event.target;

        // If no element is selected ...        
        // That should not happen but just in case ...
        if (targetElement === false)
            return;

        // If selected element is the span inside the gear div we need to get the parent div
        if (targetElement.tagName === "SPAN")
            targetElement = targetElement.parentElement;

        /// If this is happening it means outside the gear mark is clicked but 
        // within the auto gear box area
        if (targetElement.id === this.autoGearBox.id)
            return;

        /// means same gear
        if (targetElement.id === this.#currentAutoGearObj.domId)
            return;

        this.#AutoGearBoxProcessorObj.setTargetAutoGearByDomId = targetElement.id;

        this.#targetAutoGear = this.#AutoGearBoxProcessorObj.getTargetAutoGear;

        this.#AutoGearBoxProcessorObj.setTargetDataSetNumber();

        this.#boolIsShiftingGears = true;
        this.boolIsFirstPassOnAutoGearShifting = true;
    }

    //#endregion AutoGearBoxShifting

    //#region EngineStarting

    reportOnEngineStart() {

        if (this.#currentAutoGearObj.gearNumber === GearsEnum["P"])

            return true;
        else
            return false;
    }

    addAlarmingColor() {

        this.#GearBoxDomWorkerObj
            .setRedBorderCssClasses(this.#DEFAULT_INITIAL_AUTO_GEAR);
    }

    removeAlarmingColor() {

        this.#GearBoxDomWorkerObj.removeRedBorderCssClasses(this.#DEFAULT_INITIAL_AUTO_GEAR);
    }

    //#endregion EngineStarting

    get getCurrentAutoGearNumber() {

        return this.#currentAutoGearNumber;
    }

    get getIsAutoGearBoxShifting() {

        return this.#boolIsShiftingGears;
    }



}

export default GearBoxManager;