

import ALL_CAR_CONTROLS_TEXTS from "./LanguagesManager/LangTextsEnums/AllCarControlsTexts.js";

import EnumEngineStatusObj from './Enums/EngineStatusEnum.js';

import GearsEnum from './Enums/GearShiftsEnum.js';


import EnumGenericStatusObj from './Enums/GenericStatusEnum.js';

import PulsesCreatorClass from './PulsesCreatorClass.js';

const CarClass = class CarObj {

    "use strict";

    callBackToStartStopRoadWithTHIS;

    clockCounter; #boolIsSystemsCheckOk

    boolIsGasPedalPressed;
    #currentAutoGearObj; #currentAutoGearNumber;
    boolIsEngineStopRequest;

    engineSpeed; carSpeed;

    #arrReportingObjects; #arrAlarmingObjects;

    cssPointerEventsNone = "pointer-events-none";

    cssInactiveBgAndShadowStartEngineButton = "start-engine-inactive-background-shadow";
    cssActiveBgAndShadowStartEngineButton = "start-engine-active-background-shadow";

    cssStartEngineActiveBtnText = "start-engine-active-btn-text";

    cssInactiveBorderColor = "common-inactive-border-color";
    cssSignalingActiveBorderColor = "common-signaling-active-border-color";
    cssNormalActiveBorderColor = "common-normal-active-border-color";

    startEngineButton = document.getElementById("startEngineButton");
    initialContactWrapper = document.getElementById("initialContactWrapper");
    initialContactCheckBox = document.getElementById("initialContact");
    breaksFirmPressSignaler = document.getElementById("breaksFirmPressSignaler");
    startEngineButtonText = document.getElementById("pStartButtonText");

    cbAddCsscssPointerEventsNoneForGasPedal; cbRemoveCsscssPointerEventsNoneForGasPedal;

    #tempAlarmingObject; #totalStartingAlertCycles;
    #arrAlarmingObject; #tempIsSystemsCheckOk;

    #totalStartAlertObjects; #currentStartAlertObject;

    #TOTAL_STARTING_ALERT_PULSES; #STARTING_ALERT_PULSE_DURATON; #BREAK_PEDAL_FIRMLY_PRESSED_VALUE;
    constructor(
        BreakPedalArgs,
        GasPedalArgs,

        EngineArgs,
        EngineStarterArgs,

        GearBoxManagerArgs,

        EngineSpeedMeterWithBarsArgs,
        EngineSpeedDigitalMeterArgs,
        EngineSpeedAnalogMeterArgs,

        CarSpeedMeterWithBarsArgs,
        CarSpeedDigitalMeterArgs,
        CarSpeedAnalogMeterArgs,

        RoadArgs,

        currentLanguageArgs

    ) {

        this.BreakPedalObj = BreakPedalArgs;
        this.GasPedalObj = GasPedalArgs;

        this.EngineObj = EngineArgs;
        this.EngineStarterObj = EngineStarterArgs;

        this.GearBoxManagerObj = GearBoxManagerArgs;

        this.EngineSpeedMeterWithBarsObj = EngineSpeedMeterWithBarsArgs;
        this.EngineSpeedDigitalMeterObj = EngineSpeedDigitalMeterArgs;
        this.EngineSpeedAnalogMeterObj = EngineSpeedAnalogMeterArgs;

        this.CarSpeedMeterWithBarsObj = CarSpeedMeterWithBarsArgs;
        this.CarSpeedDigitalMeterObj = CarSpeedDigitalMeterArgs;
        this.CarSpeedAnalogMeterObj = CarSpeedAnalogMeterArgs;

        this.RoadObj = RoadArgs;

        this.currentLanguage = currentLanguageArgs;

        this.MAX_CAR_SPEED = 160;

        this.initialContactCheckBox.addEventListener("change", this.#cbSetIgnitionContact.bind(this));
        this.startEngineButton.addEventListener("click", this.#cbStartEngine.bind(this));

        this.EngineSpeedMeterWithBarsObj.getMaxEngineSpeed_SetRevsPerBar = this.EngineObj.getEngineMaxSpeed;

        this.EngineObj.setRevsPerBar = this.EngineSpeedMeterWithBarsObj.getRevsPerBar;
        this.EngineObj.setNumberOfIdleBars = this.EngineSpeedMeterWithBarsObj.getNumberOfIdleBars;

        //this.EngineObj.setMaxEngineStartinSpeed();

        this.CarSpeedMeterWithBarsObj.setMaxCarSpeed = this.MAX_CAR_SPEED;
        this.CarSpeedMeterWithBarsObj.setKilometersPerBar();
        this.CarSpeedMeterWithBarsObj.setTotalNumberOfBarsForDomWorker();

        this.CarSpeedAnalogMeterObj.setMaxCarSpeed = this.MAX_CAR_SPEED;
        this.CarSpeedAnalogMeterObj.setDegreesPerKilometer();
        this.CarSpeedAnalogMeterObj.setInitialArrowOffset();

        // This was an attempt to fix slight shift between the css angles of
        //  the arrow and thenthe angle given by the calcluations.
        // Possible fix is still on my agenda.
        this.CarSpeedAnalogMeterObj.setInitialArrowOffsetthis
            = this.CarSpeedAnalogMeterObj.getInitialArrowOffset;

        this.boolIsEngineRunning = false;

        this.boolIsBreakPedalSetForAutoRetracting = true;

        this.boolIsGasPedalPressed; this.boolIsBreakPedalPressed;

        this.intGasPositionValue = 0; this.intBreakPedalPositionValue = 0;

        this.boolIsStartEngineButtonOn = false;

        this.boolIsFirstStageDone = false;
        this.boolIsEngineStarting = false; this.boolIsCarOnContact = false;
        this.gasPedalCheckStatus; this.autoGearBoxCheckStatus; this.engineStartCheckStatus;
        this.boolIsBreakPedalChecked = false; this.boolIsAutoGearChecked = false;
        this.boolIsThatFirstEngineStartAttempt = false; this.boolIsEngineStopRequest = false;

        this.boolIsAutoGearBoxShifting = false;

        this.boolIsCarOnGear = true;

        this.barsNumber; this.calculatedAngle;

        // Assigning class method to a variable gets a bit messy. Not like assigning
        // regular function. I could just use GasPedalObj ...
        this.cbAddCssPointerEventsNoneForGasPedal =
            this.GasPedalObj.addCssPointerEventsNone.bind(this.GasPedalObj);

        this.cbRemoveCssPointerEventsNoneForGasPedal =
            this.GasPedalObj.removeCssPointerEventsNone.bind(this.GasPedalObj);

        this.#arrReportingObjects = new Array(); this.#arrAlarmingObjects = new Array();

        this.#pushAllReportingObjectsInArray(this.BreakPedalObj, this.GearBoxManagerObj);

        this.#TOTAL_STARTING_ALERT_PULSES = 2; this.#STARTING_ALERT_PULSE_DURATON = 84;

        this.boolIsEngineStopRequest = false;

        this.ALL_CONTROLS_TEXTS = ALL_CAR_CONTROLS_TEXTS[this.currentLanguage];

        this.startEngineButtonText.textContent = this.ALL_CONTROLS_TEXTS.BtnStartEngine.StartEngineText;

        this.engineSpeed = 0; this.carSpeed = 0;

        /* this.#totalStartingAlertCycles = 0; */
    }

    manageMainClockCycle(globalCounter) {

        this.boolIsGasPedalPressed = this.GasPedalObj.getIsGasPedalPressed;

        /*if (globalCounter % 2 === 0) { }        if (globalCounter % 18 === 0) { }*/
        // #region GasAndBreakPedalSettings   ===============

        this.intGasPositionValue = this.GasPedalObj.getGasPedalPosition;

        if (this.boolIsGasPedalPressed === true) {

            this.GasPedalObj.setGasLabelValue();
        }
        else if ((this.boolIsGasPedalPressed === false)
            && (this.intGasPositionValue > 0)) {

            this.GasPedalObj.setSetGasPedalForAutoRetract();
            this.GasPedalObj.setGasLabelValue();
        }
        //-------------------------------------
        this.BreakPedalObj
            .checkBreakPedalPositionCheckAutoRetract(this.boolIsCarOnContact, this.boolIsEngineRunning);

        this.intBreakPedalPositionValue = this.BreakPedalObj.getBreakPedalPosition;

        this.boolIsBreakPedalPressed = this.BreakPedalObj.getIsBreakPedalPressed;

        //  #endregion GasAndBreakPedalSettings   ===============

        // Gas pedal is blocked (pointer-events: none) while break pedal is
        // pressed, i.e.held with the mause or value greater than 0.
        if (this.intBreakPedalPositionValue > 0) {

            // Added those boolean flag vars to avoid messing in the DOM's
            // CSS multiple number of times
            if (this.GasPedalObj.getIsPointerEventsNoneApplied === false) {

                // Using functions assigned to vars for no aparent reason :)
                this.cbAddCssPointerEventsNoneForGasPedal();

                this.GasPedalObj.setIsPointerEventsNoneApplied = true;
            }
        }
        else if (this.intBreakPedalPositionValue === 0) {

            // Added those boolean flag vars to avoid messing in the DOM's
            // CSS multiple number of times
            if (this.GasPedalObj.getIsPointerEventsNoneApplied === true) {

                this.cbRemoveCssPointerEventsNoneForGasPedal();

                this.GasPedalObj.setIsPointerEventsNoneApplied = false;
            }
        }

        //this.boolIsEngineRunning = true;
        //this.boolIsEngineStarting = false;

        if (this.boolIsEngineStarting === true) {

            if (this.#boolIsSystemsCheckOk === true) {

                this.EngineStarterObj.manageOnStarting();

                this.engineSpeed = this.EngineObj.getEngineSpeed;

                //  Display Engine Speed on all 3 readers
                this.#displayEngineSpeed(this.engineSpeed);

                if (this.EngineStarterObj.getIsEngineStartingFinished === true) {

                    if (this.EngineStarterObj.getEngineStartingStatus === EnumEngineStatusObj.EngineStarted) {

                        this.boolIsEngineStarting = false;
                        this.EngineObj.setIsEngineStarting = this.boolIsEngineStarting;

                        this.boolIsEngineRunning = true;
                        this.EngineObj.setIsEngineRunning = this.boolIsEngineRunning;

                        this.startEngineButtonText.textContent = this.ALL_CONTROLS_TEXTS.BtnStartEngine.StopEngineText;
                    }
                    else {

                        // TO DO smth if this app gets complicated enough
                        // Like adding additional complexity like engine did not start
                        // for some reason and system alert why it did not happen
                    }
                }
            } // END this.#boolIsSystemsCheckOk === true
            else if (this.#boolIsSystemsCheckOk === false) {

                if (this.#tempAlarmingObject.getIsFullCycleEnded === false) {

                    this.#tempAlarmingObject.setPulses();
                }
                else if (this.#tempAlarmingObject.getIsFullCycleEnded === true) {

                    this.#currentStartAlertObject++;

                    if (this.#currentStartAlertObject < this.#totalStartAlertObjects) {

                        this.#tempAlarmingObject = this.#arrAlarmingObjects[this.#currentStartAlertObject];
                    }
                    else {

                        // This marks end of all cycles of blinking areas
                        this.boolIsEngineStarting = false;
                        this.EngineObj.setIsEngineStarting = this.boolIsEngineStarting;

                        this.startEngineButtonText.textContent = this.ALL_CONTROLS_TEXTS.BtnStartEngine.StartEngineText;
                    }
                }
            }
        }
        else if (this.boolIsEngineRunning === true) {

            this.currentAutoGearNumber = this.GearBoxManagerObj.getCurrentAutoGearNumber;

            //#region ManageGears

            if (this.currentAutoGearNumber === GearsEnum["D"]) {

                if (globalCounter % 30 === 0) {

                    this.GearBoxManagerObj
                            .manageOnDirectGear(this.intGasPositionValue, this.intBreakPedalPositionValue);

                    this.engineSpeed = this.GearBoxManagerObj.getEngineSpeed;

                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;
                }

                if (globalCounter % 6 === 0) {

                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);

                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);
                }
            }
            else if (this.currentAutoGearNumber === GearsEnum["P"]) {

                if (globalCounter % 6 === 0) { 

                    this.GearBoxManagerObj.manageOnPark();

                    this.EngineObj.manageEngineSpeed(this.intGasPositionValue);

                    this.engineSpeed = this.EngineObj.getEngineSpeed;

                    this.carSpeed = 0;

                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);

                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);

                }
            }
            else if (this.currentAutoGearNumber === GearsEnum["N"]) {

                if (globalCounter % 36 === 0) {

                    this.GearBoxManagerObj
                        .manageOnNeutral(this.intBreakPedalPositionValue);
                }

                if (globalCounter % 6 === 0) {

                    // Currently not used. TO BE deleted most probably
                    if (this.GearBoxManagerObj.getIsDirectToNeutralShift === true) { }

                    this.EngineObj.manageEngineSpeed(this.intGasPositionValue, globalCounter);

                    this.engineSpeed = this.EngineObj.getEngineSpeed;

                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;

                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);

                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);
                }



            }
            else if (this.currentAutoGearNumber === GearsEnum["R"]) {

                if (globalCounter % 8 === 0) {

                    this.GearBoxManagerObj
                        .manageOnReverse(this.intGasPositionValue, this.intBreakPedalPositionValue);
                }

                if (globalCounter % 4 === 0) {

                    this.engineSpeed = this.GearBoxManagerObj.getEngineSpeed;

                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;

                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);

                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);
                }
            }
            else if (this.currentAutoGearNumber === GearsEnum["1"]) {

                if (globalCounter % 8 === 0) {

                    this.GearBoxManagerObj
                        .manageOnFirst(this.intGasPositionValue, this.intBreakPedalPositionValue);
                }

                if (globalCounter % 4 === 0) {

                    this.engineSpeed = this.GearBoxManagerObj.getEngineSpeed;

                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;

                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);

                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);
                }
            }
            else if (this.currentAutoGearNumber === GearsEnum["2"]) {

                if (globalCounter % 12 === 0) {

                    this.GearBoxManagerObj
                        .manageOnSecond(this.intGasPositionValue, this.intBreakPedalPositionValue);
                }

                if (globalCounter % 6 === 0) {

                    this.engineSpeed = this.GearBoxManagerObj.getEngineSpeed;

                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;

                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);

                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);
                }
            }

            //#endregion ManageGears
        }  // END this.boolIsEngineRunning === true

        // If engine is shut off while car is moving, i.e. this.carSpeed > 0
        // I want to immitate car stopping with some inertia.
        if (this.boolIsEngineStopRequest === true) {

            if (this.carSpeed > 0) {

                this.GearBoxManagerObj
                    .manageOnRunningCarEngineOff();

                this.carSpeed = this.GearBoxManagerObj.getCarSpeed;
            }
            else if (this.carSpeed === 0)
                this.boolIsEngineStopRequest = false;
        }

        //============================
        this.boolIsAutoGearBoxShifting = this.GearBoxManagerObj.getIsAutoGearBoxShifting;

        if ((this.boolIsAutoGearBoxShifting === true) && (globalCounter % 32 === 0)) {

            this.boolIsBreakPedalFirmlyPressed = this.BreakPedalObj.isBreakPedalFirmlyPressed;

            this.GearBoxManagerObj
                .setAutoGearBoxShifting(this.boolIsEngineRunning
                    , this.getIsCarMoving
                    , this.boolIsBreakPedalFirmlyPressed);
        }


        //  Display the moving road
        if (this.getIsCarMoving === true) {

            this.RoadObj.move(this.carSpeed,
                this.currentAutoGearNumber, globalCounter);
        }


    }  // ------- End checkSetCarAndControls()

    #displayCarSpeed(carSpeed) {

        //----------   Display Engine Speed on all 3 readers    ----------------
        this.CarSpeedMeterWithBarsObj.displaySpeed(carSpeed);

        /*if (globalCounter % 3 === 0)*/
        this.CarSpeedDigitalMeterObj.displaySpeed(carSpeed);

        this.CarSpeedAnalogMeterObj.displaySpeed(carSpeed);
    }

    #displayEngineSpeed(engineSpeed) {

        //----------   Display Engine Speed on all 3 readers    ----------------
        this.EngineSpeedMeterWithBarsObj.displaySpeed(engineSpeed);

        /*if (globalCounter % 3 === 0)*/
        this.EngineSpeedDigitalMeterObj.displaySpeed(engineSpeed);

        this.EngineSpeedAnalogMeterObj.displaySpeed(engineSpeed);
    }

    #shutDownAllEngineSpeedMeters() {

        this.EngineSpeedDigitalMeterObj.shutDown();
        this.EngineSpeedAnalogMeterObj.shutDown();
        this.EngineSpeedMeterWithBarsObj.shutDown();       
    }

    #shutDownAllCarSpeedMeters() {

        this.CarSpeedDigitalMeterObj.shutDown();
        this.CarSpeedAnalogMeterObj.shutDown();
        this.CarSpeedMeterWithBarsObj.shutDown();
    }

    #checkSystemsReady() {

        this.#boolIsSystemsCheckOk = true;

        this.#arrAlarmingObjects.length = 0;

        // In this case arrReportingObjects are break pedal obj
        // and gear box obj. Break pedal reports if it is pressed to position 2 or
        // higher. Gear box reports if it is on P position
        this.#arrReportingObjects.forEach(reportingObject => {

            this.#tempIsSystemsCheckOk = reportingObject.reportOnEngineStart();

            if (this.#tempIsSystemsCheckOk === false) {

                this.PulsesCreatorObj =
                    new PulsesCreatorClass(reportingObject
                        , this.#TOTAL_STARTING_ALERT_PULSES
                        , this.#STARTING_ALERT_PULSE_DURATON);

                this.#arrAlarmingObjects.push(this.PulsesCreatorObj);

                this.#boolIsSystemsCheckOk = false;
            }
        });

        // this.EngineStarterObj.setIsSystemsCheckOk = this.#boolIsSystemsCheckOk;

        return this.#boolIsSystemsCheckOk;
    }

    #cbSetIgnitionContact() {

        if (this.initialContactCheckBox.checked) {

            this.startEngineButton.classList.remove(this.cssPointerEventsNone);

            this.boolIsBreakPedalSetForAutoRetracting = false;
            this.boolIsCarOnContact = true;
        }
        else {

            if ((this.boolIsEngineStarting === false)
                && (this.boolIsEngineRunning === false)) {

                this.startEngineButton.classList.add(this.cssPointerEventsNone);

                this.boolIsCarOnContact = false;
            }
        }
    }

    #cbStartEngine() {

        // I have put a pointer events none on the Start Engine button
        // which is removed or put back with Contact button
        // so this should not be necessary
        //if (this.boolIsCarOnContact === false)
        //    return;

        if ((this.boolIsEngineStarting === false)
            && (this.boolIsEngineRunning === false)) {

            this.boolIsEngineStarting = true;
            this.EngineObj.setIsEngineStarting = this.boolIsEngineStarting;

            this.initialContactWrapper.classList.add(this.cssPointerEventsNone);

            this.startEngineButtonText.textContent = this.ALL_CONTROLS_TEXTS.BtnStartEngine.StartingEngineText;

            this.#boolIsSystemsCheckOk = this.#checkSystemsReady();

            if (this.#boolIsSystemsCheckOk === true) {

                this.EngineStarterObj.resetOnStart();

                this.engineSpeed = 0;
            }
            else if (this.#boolIsSystemsCheckOk === false) {

                this.#currentStartAlertObject = 0;

                this.#totalStartAlertObjects = this.#arrAlarmingObjects.length;

                this.#tempAlarmingObject = this.#arrAlarmingObjects[this.#currentStartAlertObject];
            }
        }
        else if ((this.boolIsEngineRunning === true)
            || (this.boolIsEngineStarting === true)) {

            // if the engine is either running or starting shut it off

            this.initialContactWrapper.classList.remove(this.cssPointerEventsNone);

            this.startEngineButtonText.textContent = this.ALL_CONTROLS_TEXTS.BtnStartEngine.StartEngineText;

            if (this.boolIsEngineRunning === true) {

                // If engine is shut off while car is moving, i.e. this.carSpeed > 0
                // I want to immitate car stopping with some inertia.
                // Setting boolIsEngineStopRequest = true will play role in the main clock's cycle
                if ((this.currentAutoGearNumber !== GearsEnum["P"])
                    && (this.carSpeed > 0)) {

                    this.boolIsEngineStopRequest = true;
                }

                this.boolIsEngineRunning = false;
                this.EngineObj.setIsEngineRunning = this.boolIsEngineRunning;

                this.EngineObj.resetCalculatedGasPositionValue();

                //this.carSpeed = 0;
                //this.GearBoxManagerObj.setCarSpeed = this.carSpeed;

                 this.GearBoxManagerObj.resetOnEngineStop();

                this.#shutDownAllEngineSpeedMeters();
                this.#shutDownAllCarSpeedMeters();
            }
            else if (this.boolIsEngineStarting === true) {

                // If for whatever reason Stop Engine button is pressed
                // during engine start a quick reacton is necessary
                this.boolIsEngineStarting = false;
                this.EngineObj.setIsEngineRunning = this.boolIsEngineStarting;

                if (this.#boolIsSystemsCheckOk === true) {

                    // this means that most probably that starter has rolled the engine
                    // and all engine speed meters are displaying some 
                    // values and need to be shut down
                    // Plus the car's digital meter which shows inital 0 value
                    // upon pressing the button
                    this.#shutDownAllEngineSpeedMeters();

                    this.CarSpeedDigitalMeterObj.shutDown();
                }
                else {
                    // Here means that most probably that only 2 speed
                    // meters are displaying some values and need to be shut down.
                    // The engine's digital speed meter and the car's speed digit meter
                    // Those 2 should be combined in a function ... eventually
                    this.EngineSpeedDigitalMeterObj.shutDown();
                    this.CarSpeedDigitalMeterObj.shutDown();

                    // Also means that some alarming colors hae been shown and need
                    // to be cleared
                    this.#resetAlarmingColors();
                }
            }

            this.engineSpeed = 0;
            this.EngineObj.setEngineSpeed = this.engineSpeed;

            this.startEngineButtonText.textContent = this.ALL_CONTROLS_TEXTS.BtnStartEngine.StartEngineText;
        }
    }

    #resetAlarmingColors() {

        if (this.#arrAlarmingObjects.length > 0) {

            this.#arrAlarmingObjects
                .forEach(alarmingObject => alarmingObject.clearAlert());
        }

        this.#arrAlarmingObjects.length = 0;
    }

    #pushAllReportingObjectsInArray() {

        for (var i = 0; i < arguments.length; i++) {

            this.#arrReportingObjects.push(arguments[i]);
        }
    }

    // #region Getters Setters

    get getIsCarMoving() {

        return this.carSpeed > 0;
    }

    setCarMovingForward() {

        this.RoadObj.boolIsRoadMovingForward = true;
    }

    setCarMovingBackward() {

        this.RoadObj.boolIsRoadMovingForward = false;
    }

    setCarStopped() {

        this.RoadObj.boolIsRoadMoving = false;
    }

    setCarMoving() {

        this.RoadObj.boolIsRoadMoving = true;
    }

    //get getIsCarMoving() {

    //    return this.RoadObj.boolIsRoadMoving;
    //}

    get isCarMoving() {

        this.RoadObj.getRoadMovingStatus();
    }

    callBackToStartStopRoad() {

        this.RoadObj.changeRoadMovingStatus();
    }

    changeMovingDirection() {

        this.RoadObj.boolIsRoadMovingForward = !this.RoadObj.boolIsRoadMovingForward;
    }

    get getMovingDirection() {

        return this.RoadObj.boolIsRoadMovingForward;
    }

    setAlertOnEngineStart() {

    }

    // #endregion Getters Setters

}

export default CarClass;