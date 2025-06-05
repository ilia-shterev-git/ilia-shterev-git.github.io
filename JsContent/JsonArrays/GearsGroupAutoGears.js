
import GearsEnum from '../Enums/GearShiftsEnum.js';

const AutoGears = {

    autoGears: [
        {
            gearNumber: GearsEnum["P"],
            dataSetNumber: 0,
            boolIsFixedGear: false,
            domId: "autoGearPark",
            domAutoGear: ""
        },
        {
            gearNumber: GearsEnum["N"],
            dataSetNumber: 1,
            boolIsFixedGear: false,
            domId: "autoGearNeutral",
            domAutoGear: ""
        },
        {
            gearNumber: GearsEnum["D"],
            dataSetNumber: 2,
            boolIsFixedGear: false,
            domId: "autoGearDirect",
            domAutoGear: ""
        },
        {
            gearNumber: GearsEnum["R"],
            dataSetNumber: 3,
            boolIsFixedGear: true,
            domId: "autoGearReverse",
            domAutoGear: ""
        },
        {
            gearNumber: GearsEnum["1"],
            dataSetNumber: 4,
            boolIsFixedGear: true,
            domId: "autoGearFirst",
            domAutoGear: ""
        },
        {
            gearNumber: GearsEnum["2"],
            dataSetNumber: 5,
            boolIsFixedGear: true,
            domId: "autoGearSecond",
            domAutoGear: ""
        }
    ]
}

export default AutoGears;