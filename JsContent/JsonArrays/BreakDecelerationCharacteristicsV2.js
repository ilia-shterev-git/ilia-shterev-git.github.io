
import GearsEnum from '../Enums/GearShiftsEnum.js';

const BreakDecelerationCharacteristics = {

    breakValues: [{

        breakValue: 1,

        breakingPercentage: {
            [GearsEnum["1"]]: 10.0,
            [GearsEnum["2"]]: 8.0,
            [GearsEnum["3"]]: 6.0,
            [GearsEnum["4"]]: 4.0,
            [GearsEnum["5"]]: 3.0,
            [GearsEnum["N"]]: 2.0,
            [GearsEnum["R"]]: 10.0
        }
    },
    {
        breakValue: 2,

        breakingPercentage: {
            [GearsEnum["1"]]: 14.0,
            [GearsEnum["2"]]: 13.0,
            [GearsEnum["3"]]: 10.0,
            [GearsEnum["4"]]: 8.0,
            [GearsEnum["5"]]: 6.0,
            [GearsEnum["N"]]: 5.0,
            [GearsEnum["R"]]: 16.0
        }
    },
    {
        breakValue: 3,

        breakingPercentage: {
            [GearsEnum["1"]]: 24.0,
            [GearsEnum["2"]]: 16.0,
            [GearsEnum["3"]]: 14.0,
            [GearsEnum["4"]]: 12.0,
            [GearsEnum["5"]]: 10.0,
            [GearsEnum["N"]]: 8.0,
            [GearsEnum["R"]]: 14.0
        }
    },
    {
        breakValue: 4,

        breakingPercentage: {
            [GearsEnum["1"]]: 30.0,
            [GearsEnum["2"]]: 20.0,
            [GearsEnum["3"]]: 18.0,
            [GearsEnum["4"]]: 16.0,
            [GearsEnum["5"]]: 14.0,
            [GearsEnum["N"]]: 10.0,
            [GearsEnum["R"]]: 22.0
        }
    }
    ]
};

export default BreakDecelerationCharacteristics;