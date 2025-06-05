
const DigitalEngineSpeedMeterColors = {

    gasPedalPositionsEngineSpeedShifts: [
        {
            minSpeedValue: 0,
            maxSpeedValue: 900,

            colorCssVar: "--idleRangeColor"
        },
        {
            minSpeedValue: 901,
            maxSpeedValue: 2100,
            colorCssVar: "--bellowRangeColor"
        },
        {
            minSpeedValue: 2101,
            maxSpeedValue: 2900,
            colorCssVar: "--goodRangeColor"
        },
        {
            minSpeedValue: 2901,
            maxSpeedValue: 3900,
            colorCssVar: "--aboveRangeColor"
        },
        {
            minSpeedValue: 3901,
            maxSpeedValue: 4500,
            colorCssVar: "--lowDangerRangeColor"
        },
        {
            minSpeedValue: 4501,
            maxSpeedValue: 6000,
            colorCssVar: "--highDangerRangeColor"
        }],

    //  Yes, that should not be here. This object would not properly stringify having a method. 
    get getJsonRangesAndColors() {

        let jsonGasPedalPositionsEngineSpeedShifts = JSON.stringify(this.gasPedalPositionsEngineSpeedShifts);

        return jsonGasPedalPositionsEngineSpeedShifts;
    }
};

export default DigitalEngineSpeedMeterColors;