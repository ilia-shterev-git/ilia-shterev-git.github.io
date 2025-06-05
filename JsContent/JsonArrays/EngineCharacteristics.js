
import GearsEnum from '../Enums/GearShiftsEnum.js';

const EngineCharacteristics = {

    // Here there are total of 5 gear shifts
    // and total of 25 gas pedal positions.

    maxEngineSpeed: 4950,

    minBreakingSpeed: 2,

    belowNormEngineSpeedMax: 200,

    maxMovingBreakPedalPositionValue: 1,

    engineSpeedFromGasPosition: {
        0: 900,
        1: 1062,
        2: 1224,
        3: 1386,
        4: 1548,
        5: 1710,
        6: 1872,
        7: 2034,
        8: 2196,
        9: 2358,
        10: 2520,
        11: 2682,
        12: 2844,
        13: 3006,
        14: 3168,
        15: 3330,
        16: 3492,
        17: 3654,
        18: 3816,
        19: 3978,
        20: 4140,
        21: 4302,
        22: 4464,
        23: 4626,
        24: 4788,
        25: 4950
    },

    gasPositionFromEngineSpeed: {
        900: 0,
        1062: 1,
        1224: 2,
        1386: 3,
        1548: 4,
        1710: 5,
        1872: 6,
        2034: 7,
        2196: 8,
        2358: 9,
        2520: 10,
        2682: 11,
        2844: 12,
        3006: 13,
        3168: 14,
        3330: 15,
        3492: 16,
        3654: 17,
        3816: 18,
        3978: 19,
        4140: 20,
        4302: 21,
        4464: 22,
        4626: 23,
        4788: 24,
        4950: 25
    },

    engineGearCharacteristics: [
        {
            gearNumber: GearsEnum["1"],

            cruisingSpeed: 7.0,

            cruisingSpeedBreak1: 5.0,

            carSpeedFromEngineSpeed: {
                198: 0.0,
                199: 3.0,     // Intermediate speed when break pedal value is greater than 1 but speed has not reached zero
                200: 5.0,    // Cruising speed when gas pedal is not pressed but break pedal is on position 1
                900: 7.0,   // This is the cruising speed when gas pedal is not pressed and break is not applied
                1062: 8.6,
                1224: 9.9,
                1386: 11.0,
                1548: 12.5,
                1710: 13.8,
                1872: 15.1,
                2034: 16.4,
                2196: 17.7,
                2358: 19.1,
                2520: 20.4,
                2682: 21.7,
                2844: 23,// gear switching engine speed to or from next second gear 2196: 26.6,
                3006: 24.3,
                3168: 25.6,
                3330: 26.9,
                3492: 28.2,
                3654: 29.5,
                3816: 30.8,
                3978: 32.1,
                4140: 33.5,
                4302: 34.8,
                4464: 36.1,
                4626: 37.4,
                4788: 38.7,
                4950: 40
            },

            engineSpeedFromCarSpeed: {
                0.0: 198,
                3.0: 199,   // Intermediate speeds when break pedal value is greater than 1 but speed has not reached zero
                5.0: 200,   // Cruising speed when gas pedal is not pressed but break pedal is on position 1
                7.0: 900,   // This is the cruising speed when gas pedal is not pressed and break is not applied
                8.6: 1062,
                9.9: 1224,
                11.0: 1386,
                12.5: 1548,
                13.8: 1710,
                15.1: 1872,
                16.4: 2034,
                17.7: 2196,
                19.1: 2358,
                20.4: 2520,
                21.7: 2682,
                23: 2844,
                24.3: 3006,
                25.6: 3168,
                26.9: 3330,
                28.2: 3492,
                29.5: 3654,
                30.8: 3816,
                32.1: 3978,
                33.5: 4140,
                34.8: 4302,
                36.1: 4464,
                37.4: 4626,
                38.7: 4788,
                40: 4950
            },

            maxCarSpeed: 40, // not needed so far
            // downShiftingEngineSpeed: 2196, not needed on 1st gear
            upShiftingEngineSpeed: 2844,
            downShiftingGasPosition: 8,
            upShiftingGasPosition: 12,
            downShiftingBreakEngineSpeed: 3330, // needs special discusion
            lastOfUpShifts: false,
        },
        {
            gearNumber: GearsEnum["2"],

            cruisingSpeed: 11.0,
            cruisingSpeedBreak1: 9.0,

            carSpeedFromEngineSpeed: {
                196: 0.0,
                197: 3.0,
                198: 5.0,  
                199: 7.0,   // All intermediate speeds when break pedal value is greater than 1 but speed has not reached zero
                200: 9.0,   // Cruising speed when gas pedal is not pressed but break pedal is on position 1
                900: 11.0,   // This is the cruising speed when gas pedal is not pressed and break is not applied
                1062: 12.9,
                1224: 14.8,
                1386: 16.8,
                1548: 18.8,
                1710: 20.7,
                1872: 22.7,
                2034: 24.7,
                2196: 26.6, // gear switching engine speed to or from previous first gear 2844: 23,
                2358: 28.6,
                2520: 30.5,
                2682: 32.5,
                2844: 34.5, // gear switching engine speed to or from next third gear 2196: 39.9,
                3006: 36.4,
                3168: 38.4,
                3330: 40.4,
                3492: 42.3,
                3654: 44.3,
                3816: 46.3,
                3978: 48.2,
                4140: 50.2,
                4302: 52.1,
                4464: 54.1,
                4626: 56.1,
                4788: 58,
                4950: 60
            },

            engineSpeedFromCarSpeed: {
                0.0: 196,  // Intermediate speed when break pedal value is greater than 1 but speed has not reached zero
                3.0: 197,
                5.0: 198,
                7.0: 199,
                9.0: 200,    // Cruising speed when gas pedal is not pressed but break pedal is on position 1
                11.0: 900,   // This is the cruising speed when gas pedal is not pressed and break is not applied
                12.9: 1062,
                14.8: 1224,
                16.8: 1386,
                18.8: 1548,
                20.7: 1710,
                22.7: 1872,
                24.7: 2034,
                26.6: 2196,
                28.6: 2358,
                30.5: 2520,
                32.5: 2682,
                34.5: 2844,
                36.4: 3006,
                38.4: 3168,
                40.4: 3330,
                42.3: 3492,
                44.3: 3654,
                46.3: 3816,
                48.2: 3978,
                50.2: 4140,
                52.1: 4302,
                54.1: 4464,
                56.1: 4626,
                58: 4788,
                60: 4950
            },

            maxCarSpeed: 60, // not needed so far
            downShiftingEngineSpeed: 2196,
            upShiftingEngineSpeed: 2844,
            downShiftingGasPosition: 8,
            upShiftingGasPosition: 12,
            downShiftingBreakEngineSpeed: 3330, // needs special discusion
            lastOfUpShifts: false
        },
        {
            gearNumber: GearsEnum["3"],

            carSpeedFromEngineSpeed: {
                900: 16.4,
                1062: 19.3,
                1224: 22.3,
                1386: 25.2,
                1548: 28.1,
                1710: 31.1,
                1872: 34,
                2034: 37,
                2196: 39.9, // gear switching engine speed to or from previous second gear 2844: 34.5,
                2358: 42.9,
                2520: 45.8,
                2682: 48.8,
                2844: 51.7, // gear switching engine speed to or from next fourth gear 2196: 53.2,
                3006: 54.7,
                3168: 57.6,
                3330: 60.5,
                3492: 63.5,
                3654: 66.4,
                3816: 69.4,
                3978: 72.3,
                4140: 75.3,
                4302: 78.2,
                4464: 81.2,
                4626: 84.1,
                4788: 87.1,
                4950: 90
            },

            engineSpeedFromCarSpeed: {
                16.4: 900,
                19.3: 1062,
                22.3: 1224,
                25.2: 1386,
                28.1: 1548,
                31.1: 1710,
                34: 1872,
                37: 2034,
                39.9: 2196,
                42.9: 2358,
                45.8: 2520,
                48.8: 2682,
                51.7: 2844,
                54.7: 3006,
                57.6: 3168,
                60.5: 3330,
                63.5: 3492,
                66.4: 3654,
                69.4: 3816,
                72.3: 3978,
                75.3: 4140,
                78.2: 4302,
                81.2: 4464,
                84.1: 4626,
                87.1: 4788,
                90: 4950
            },

            maxCarSpeed: 90,
            downShiftingEngineSpeed: 2196,
            upShiftingEngineSpeed: 2844,
            downShiftingGasPosition: 8,
            upShiftingGasPosition: 12,
            downShiftingBreakEngineSpeed: 3006, // needs special discusion
            lastOfUpShifts: false
        },
        {
            gearNumber: GearsEnum["4"],

            carSpeedFromEngineSpeed: {
                900: 21.8,
                1062: 25.7,
                1224: 29.7,
                1386: 33.6,
                1548: 37.5,
                1710: 41.5,
                1872: 45.4,
                2034: 49.3,
                2196: 53.2, // gear switching engine speed to or from previous third gear 2844: 51.7,
                2358: 57.2,
                2520: 61.1,
                2682: 65,
                2844: 68.9, // gear switching engine speed to or from next fifth gear 2196: 71,
                3006: 72.9,
                3168: 76.8,
                3330: 80.7,
                3492: 84.7,
                3654: 88.6,
                3816: 92.5,
                3978: 96.4,
                4140: 100.4,
                4302: 104.3,
                4464: 108.2,
                4626: 112.1,
                4788: 116.1,
                4950: 120
            },

            engineSpeedFromCarSpeed: {
                21.8: 900,
                25.7: 1062,
                29.7: 1224,
                33.6: 1386,
                37.5: 1548,
                41.5: 1710,
                45.4: 1872,
                49.3: 2034,
                53.2: 2196,
                57.2: 2358,
                61.1: 2520,
                65: 2682,
                68.9: 2844,
                72.9: 3006,
                76.8: 3168,
                80.7: 3330,
                84.7: 3492,
                88.6: 3654,
                92.5: 3816,
                96.4: 3978,
                100.4: 4140,
                104.3: 4302,
                108.2: 4464,
                112.1: 4626,
                116.1: 4788,
                120: 4950
            },

            maxCarSpeed: 120, // no needed so far
            downShiftingEngineSpeed: 2196,
            upShiftingEngineSpeed: 2844,
            downShiftingGasPosition: 8,
            upShiftingGasPosition: 12,
            downShiftingBreakEngineSpeed: 3006, // needs special discusion
            lastOfUpShifts: false
        },
        {
            gearNumber: GearsEnum["5"],

            carSpeedFromEngineSpeed: {
                900: 29.1,
                1062: 34.3,
                1224: 39.6,
                1386: 44.8,
                1548: 50,
                1710: 55.3,
                1872: 60.5,
                2034: 65.7,
                2196: 71, // gear switching engine speed to or from previous fourth gear 2844: 68.9,
                2358: 76.2,
                2520: 81.5,
                2682: 86.7,
                2844: 91.9,
                3006: 97.2,
                3168: 102.4,
                3330: 107.6,
                3492: 112.9,
                3654: 118.1,
                3816: 123.3,
                3978: 128.6,
                4140: 133.8,
                4302: 139.1,
                4464: 144.3,
                4626: 149.5,
                4788: 154.8,
                4950: 160
            },

            engineSpeedFromCarSpeed: {
                29.1: 900,
                34.3: 1062,
                39.6: 1224,
                44.8: 1386,
                50: 1548,
                55.3: 1710,
                60.5: 1872,
                65.7: 2034,
                71: 2196,
                76.2: 2358,
                81.5: 2520,
                86.7: 2682,
                91.9: 2844,
                97.2: 3006,
                102.4: 3168,
                107.6: 3330,
                112.9: 3492,
                118.1: 3654,
                123.3: 3816,
                128.6: 3978,
                133.8: 4140,
                139.1: 4302,
                144.3: 4464,
                149.5: 4626,
                154.8: 4788,
                160: 4950
            },

            maxCarSpeed: 160, // no needed so far
            downShiftingEngineSpeed: 2196,
            // upShiftingEngineSpeed: 2844, not needed on 5th gear
            downShiftingGasPosition: 8,
            upShiftingGasPosition: 12,
            // downShiftingBreakEngineSpeed: 2844, not needed on 5th gear, needs special discusion
            lastOfUpShifts: true
        },
        {
            gearNumber: GearsEnum["R"],

            cruisingSpeed: 7.0,

            cruisingSpeedBreak1: 5.0,

            carSpeedFromEngineSpeed: {
                198: 0.0,
                199: 3.0,     // Intermediate speeds when break pedal value is greater than 1 but speed has not reached zero
                200: 5.0,    // Cruising speed when gas pedal is not pressed but break pedal is on position 1
                900: 7.0,   // This is the cruising speed when gas pedal is not pressed and break is not applied
                1062: 8.6,
                1224: 9.9,
                1386: 11.0,
                1548: 12.5,
                1710: 13.8,
                1872: 15.1,
                2034: 16.4,
                2196: 17.7,
                2358: 19.1,
                2520: 20.4,
                2682: 21.7,
                2844: 23,
                3006: 24.3,
                3168: 25.6,
                3330: 26.9,
                3492: 28.2,
                3654: 29.5,
                3816: 30.8,
                3978: 32.1,
                4140: 33.5,
                4302: 34.8,
                4464: 36.1,
                4626: 37.4,
                4788: 38.7,
                4950: 40
            },

            engineSpeedFromCarSpeed: {
                0.0: 198,
                3.0: 199,   // Intermediate speeds when break pedal value is greater than 1 but speed has not reached zero
                5.0: 200,   // Cruising speed when gas pedal is not pressed but break pedal is on position 1
                7.0: 900,   // This is the cruising speed when gas pedal is not pressed and break is not applied
                8.6: 1062,
                9.9: 1224,
                11.0: 1386,
                12.5: 1548,
                13.8: 1710,
                15.1: 1872,
                16.4: 2034,
                17.7: 2196,
                19.1: 2358,
                20.4: 2520,
                21.7: 2682,
                23: 2844,
                24.3: 3006,
                25.6: 3168,
                26.9: 3330,
                28.2: 3492,
                29.5: 3654,
                30.8: 3816,
                32.1: 3978,
                33.5: 4140,
                34.8: 4302,
                36.1: 4464,
                37.4: 4626,
                38.7: 4788,
                40: 4950
            }
        }
    ]

};

export default EngineCharacteristics;