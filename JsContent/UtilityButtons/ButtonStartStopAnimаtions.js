

import genericButtonFn from './ButtonGeneric.js';

import BTN_START_STOP_ANIMATIONS_TEXTS from "../LanguagesManager/LangTextsEnums/BtnStartStopAnimationsTexts.js";

"use strict";
export default function btnStartStopAnimation(CarObject, currentLanguage="en") {

    let btnStartStopAnimation = document.getElementById("btnStartStopAnime")
        , boolStartStopAnime = false
        , INTERVALID = null
        , globalCounter = 0
        , MAIN_CLOCK_INTERVAL_DURATION_MS = 6;

    btnStartStopAnimation.textContent = BTN_START_STOP_ANIMATIONS_TEXTS[currentLanguage].StartText;

    function setMainFunctionality() {

        globalCounter++;

        CarObject.manageMainClockCycle(globalCounter);
    }

    function callBackToStartStopAnimation() {

        if (boolStartStopAnime === false) {

            INTERVALID = setInterval(setMainFunctionality, MAIN_CLOCK_INTERVAL_DURATION_MS);

            btnStartStopAnimation.textContent = BTN_START_STOP_ANIMATIONS_TEXTS[currentLanguage].StopTexts;

            boolStartStopAnime = true;
        }
        else if (boolStartStopAnime === true) {

            clearInterval(INTERVALID);

            btnStartStopAnimation.textContent = BTN_START_STOP_ANIMATIONS_TEXTS[currentLanguage].StartText;

            boolStartStopAnime = false;
        }
    }

    genericButtonFn(btnStartStopAnimation, "click", callBackToStartStopAnimation);
}

