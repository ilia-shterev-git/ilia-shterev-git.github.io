
import GearsEnum from '../Enums/GearShiftsEnum.js';

const BreakDecelerationCharacteristics = {

    breakValues: [{

        breakValue: 1,

        gearStatus: {
            auto: {
                [GearsEnum["1"]]: 2.0,
                [GearsEnum["2"]]: 2.0,
                [GearsEnum["3"]]: 2.0,
                [GearsEnum["4"]]: 2.0,
                [GearsEnum["5"]]: 2.0
            },
            [GearsEnum["N"]]: 2.0,
            direct: { [GearsEnum["1"]]: 2.0,[GearsEnum["2"]]: 2.0, [GearsEnum["R"]]: 2.0 }
        }
    },
    {
        breakValue: 2,

        gearStatus: {
            auto: {
                [GearsEnum["1"]]: 4.0,
                [GearsEnum["2"]]: 24.2,
                [GearsEnum["3"]]: 4.0,
                [GearsEnum["4"]]: 44.0,
                [GearsEnum["5"]]: 4.0
            },
            [GearsEnum["N"]]: 40.2,
            direct: { [GearsEnum["1"]]: 4.0, [GearsEnum["2"]]: 24.2, [GearsEnum["R"]]: -4.8 }
        }
        },     
        {
            breakValue: 3,

            gearStatus: {
                auto: {
                    [GearsEnum["1"]]: 6.0,
                    [GearsEnum["2"]]: 6.0,
                    [GearsEnum["3"]]: 6.0,
                    [GearsEnum["4"]]: 6.0,
                    [GearsEnum["5"]]: 6.0
                },
                [GearsEnum["N"]]: 6.0,
                direct: { [GearsEnum["1"]]: 6.0,[GearsEnum["2"]]: 6.0, [GearsEnum["R"]]: 6.0 }
            }
        },      
        {
            breakValue: 4,

            gearStatus: {
                auto: {
                    [GearsEnum["1"]]: 8.0,
                    [GearsEnum["2"]]: 8.0,
                    [GearsEnum["3"]]: 8.0,
                    [GearsEnum["4"]]: 8.0,
                    [GearsEnum["5"]]: 8.0
                },
                [GearsEnum["N"]]: 8.0,
                direct: { [GearsEnum["1"]]: 8.0,[GearsEnum["2"]]: 8.0, [GearsEnum["R"]]: 8.0 }
            }
        }
    ]
};

export default BreakDecelerationCharacteristics;