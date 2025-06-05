/// <reference path="../JsonArrays/GearsGroupAutoGears.js" />

import ManualGears from '../JsonArrays/GearsGroupManualGears.js';

import AutoGears from '../JsonArrays/GearsGroupAutoGears.js';

import GearsEnum from '../Enums/GearShiftsEnum.js';



const GearBoxDomWorker = class GearBoxDomWorker {

    "use strict"

    autoGearBox = document.getElementById("autoGearBox");

    #classActiveGearMark = "active-gear-mark";
    classInactiveGearMark = "inactive-gear-mark";

    classBorderColorGreen = "border-color-green";
    classBorderColorRed = "border-color-red";

    classCurrent = "a";

    #arrManualGears; #prevGearNumber;

    constructor() {

        this.tempVar = 0; this.tempDomElement = 0;

        this.#prevGearNumber = null;

        this.#setAutoGearsArray();

        this.#setManualGearsArray();
    }

    setCurrentCssClasses(currentGear) {

        currentGear.classList.add(this.classCurrent);
    }

    setRedBorderCssClasses(currentGear) {

        currentGear.classList.add(this.classBorderColorRed);
    }

    removeRedBorderCssClasses(currentGear) {

        currentGear.classList.remove(this.classBorderColorRed);
    }

    removeActiveSetInactiveCssClasses(currentGear) {

        currentGear.classList.remove(this.#classActiveGearMark);
        currentGear.classList.add(this.classInactiveGearMark);
    }

    removeInactiveSetActiveCssClasses(currentGear) {

        currentGear.classList.remove(this.classInactiveGearMark);
        currentGear.classList.add(this.#classActiveGearMark);
    }

    setAlertCssClasses(currentGear) {

        currentGear.classList.remove(this.#classActiveGearMark);
        currentGear.classList.add(this.classInactiveGearMark);
        currentGear.classList.add(this.classBorderColorRed);
    }

    removeAlertCssClasses(currentGear) {

        currentGear.classList.remove(this.classBorderColorRed);
        currentGear.classList.remove(this.classInactiveGearMark);
        currentGear.classList.add(this.#classActiveGearMark);
    }

    flipInactiveAndActiveGearCssClasses(prevGearObj, currentManualGearObj) {

        prevGearObj.domManualGear.classList.remove(this.#classActiveGearMark);
        prevGearObj.domManualGear.classList.add(this.classInactiveGearMark);

        currentManualGearObj.domManualGear.classList.remove(this.classInactiveGearMark);
        currentManualGearObj.domManualGear.classList.add(this.#classActiveGearMark);

    }

    setActiveGearCssClassesWithNullCheck(currentManualGearObj) {

        if (currentManualGearObj !== null) {

            currentManualGearObj.domManualGear.classList.remove(this.classInactiveGearMark);
            currentManualGearObj.domManualGear.classList.add(this.#classActiveGearMark);
        }
    }

    setActiveGearCssClasses(currentGear) {

        currentGear.classList.remove(this.classInactiveGearMark);
        currentGear.classList.add(this.#classActiveGearMark);
    }

    setInactiveGearCssClassesWithNullCheck(currentManualGearObj) {

        if (currentManualGearObj !== null) {

            currentManualGearObj.domManualGear.classList.remove(this.#classActiveGearMark);
            currentManualGearObj.domManualGear.classList.add(this.classInactiveGearMark);
        }
    }

    setInactiveGearCssClasses(currentGear) {

        currentGear.classList.remove(this.#classActiveGearMark);
        currentGear.classList.add(this.classInactiveGearMark);
    }

    display() {


    }

    get getAutoGearBoxDomElement() {

        return this.autoGearBox;
    }

    get getManualGearsArray() {

        return this.#arrManualGears;
    }

    get getAutoGearsArray() {

        return this.arrAutoGears;
    }

    #setManualGearsArray() {

        ManualGears.manualGears.forEach(manualGear => {

            manualGear.domManualGear = document.getElementById(manualGear.domId);
        });

        this.#arrManualGears = ManualGears.manualGears;
    }

    #setAutoGearsArray() {

        AutoGears.autoGears.forEach(autoGear => {

            autoGear.domAutoGear = document.getElementById(autoGear.domId);
        });

        this.arrAutoGears = AutoGears.autoGears;
    }

    //set setTotalNumberOfBars() {

    //}

    //set setTotalNumberOfBars() {

    //}
}

export default GearBoxDomWorker;
