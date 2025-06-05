

import GearsEnum from '../Enums/GearsEnum.js';

const AllowedAutoGearsCombinations = {

    // initial attempt to use files and not hard coded IFs in estimating
    //  allowed auto gears combinations
    gearCombinations: [
        {
            currentGearNumber: GearsEnum["D"],
            allowedCombinations: [GearsEnum["N"]]
        },
        {
            currentGearNumber: GearsEnum["R"],
            allowedCombinations: null
        }
    ]
}
