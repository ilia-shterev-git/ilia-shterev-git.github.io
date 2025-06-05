
const AnalogEngineSpeedNumbers = {

    allNumbers: [{
        numberValue: "0",
        numberPosition: -135,
        numberOrientation: 135
    },
    {
        numberValue: "1",
        numberPosition: -78,
        numberOrientation: 78
    },
    {
        numberValue: "2",
        numberPosition: -28,
        numberOrientation: 28
    },
    {
        numberValue: "3",
        numberPosition: 28,
        numberOrientation: -28
    },
    {
        numberValue: "4",
        numberPosition: 82,
        numberOrientation: -82
    },
    {
        numberValue: "5",
        numberPosition: 137,
        numberOrientation: -137
    }],

    get getJsonNumbers() {

        let allJsonNumbers = JSON.stringify(this.allNumbers);

        return allJsonNumbers;
    }
};

export default AnalogEngineSpeedNumbers;