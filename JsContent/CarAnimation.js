

import LanguageDetectorObj from "./LanguagesManager/LanguageDetector.js";

import CarClass from './CarClass.js';

import RoadClass from './RoadClass.js';

import EngineClass from './EngineClass.js';

import EngineStarterClass from './EngineStarterClass.js';

import EngineSpeedMeterWithBarsClass from './CarMetersClasses/EngineSpeedMeterWithBars.js';

import EngineSpeedDigitalMeterClass from './CarMetersClasses/EngineSpeedDigitalMeter.js';

import EngineSpeedAnalogMeterClass from './CarMetersClasses/EngineSpeedAnalogMeter.js';

import CarSpeedMeterWithBars from './CarMetersClasses/CarSpeedMeterWithBars.js';
import CarSpeedMeterWithBarsDomWorker from './CarMetersClasses/CarSpeedMeterWithBarDomWorker.js';

import CarSpeedAnalogMeter from './CarMetersClasses/CarSpeedAnalogMeter.js';
import CarSpeedAnalogMeterDomWorker from './CarMetersClasses/CarSpeedAnalogMeterDomWorker.js';

import CarSpeedDigitalMeter from './CarMetersClasses/CarSpeedDigitalMeter.js';

import GasPedalClass from './GasPedalClass.js';

import BreakPedalClass from './BreakPedalClass.js';

import GearBoxDomWorker from './AutoGearBoxClasses/GearBoxDomWorker.js';

import GearShiftsProcessor from './AutoGearBoxClasses/GearShiftsProcessor.js';

import AutoGearBoxProcessor from './AutoGearBoxClasses/AutoGearBoxProcessor.js';

import GearBoxManager from './AutoGearBoxClasses/GearBoxManager.js';

import btnStartStopAnimations from './UtilityButtons/ButtonStartStopAnimаtions.js';

(async function () {

    let currentLanguage = LanguageDetectorObj.getCurrentLanguage;

    const BreakPedalObj = new BreakPedalClass(),
        GasPedalObj = new GasPedalClass(),

        EngineObj = new EngineClass(),
        EngineStarterObj = new EngineStarterClass(EngineObj),

        GearBoxDomWorkerObj = new GearBoxDomWorker(),
        AutoGearBoxProcessorObj = new AutoGearBoxProcessor(),
        GearShiftsProcessorObj = new GearShiftsProcessor(),

        GearBoxManagerObj = new GearBoxManager(AutoGearBoxProcessorObj,
            GearShiftsProcessorObj, GearBoxDomWorkerObj),

        EngineSpeedMeterWithBarsObj = new EngineSpeedMeterWithBarsClass(),
        EngineSpeedDigitalMetersObj = new EngineSpeedDigitalMeterClass(),
        EngineSpeedAnalogMeterObj = new EngineSpeedAnalogMeterClass(EngineObj.getEngineMaxSpeed),

        CarSpeedMeterWithBarsDomWorkerObj = new CarSpeedMeterWithBarsDomWorker(),
        CarSpeedMeterWithBarsObj = new CarSpeedMeterWithBars(CarSpeedMeterWithBarsDomWorkerObj),

        CarSpeedDigitalMetersObj = new CarSpeedDigitalMeter(),

        CarSpeedAnalogMeterDomWorkerObj = new CarSpeedAnalogMeterDomWorker(),
        CarSpeedAnalogMeterObj = new CarSpeedAnalogMeter(CarSpeedAnalogMeterDomWorkerObj),

        RoadObj = new RoadClass();

    const CarObj = new CarClass(
      
        BreakPedalObj,
        GasPedalObj,

        EngineObj,
        EngineStarterObj,

        GearBoxManagerObj,

        EngineSpeedMeterWithBarsObj,
        EngineSpeedDigitalMetersObj,
        EngineSpeedAnalogMeterObj,

        CarSpeedMeterWithBarsObj,
        CarSpeedDigitalMetersObj,
        CarSpeedAnalogMeterObj,

        RoadObj,

        currentLanguage
    );

    btnStartStopAnimations(CarObj, currentLanguage);

}());
