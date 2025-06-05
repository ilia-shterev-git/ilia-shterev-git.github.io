

/// This basically a closure
import StripesCreator from './RoadStripesCreator.js';

import GearsEnum from './Enums/GearShiftsEnum.js';

const Road = class RoadObj {

    "use strict";

    roadObj = document.getElementById("road");

    /// arrAllStripeElements will be assigned an array with all stripes DOM elements
    arrAllStripeElements=[];

    /// Coeff. which defines how #topStripeBlock will be defined, i.e.
    /// this.topStripeBlock = this.arrAllStripeElements[this.UPPER_INDEX];
    /// Calculated inside the constructor as one of calculated members comes
    /// through the constructor
    UPPER_INDEX;

    /// Defines the total number of stripes which will be rolled forward or
    /// backward during this moving road animation
    TOTAL_NUMBER_STRIPES = 22;

    /// Defines the stripes' height. Should be an even number as it is devided by 2 later.
    STRIP_ELEMENT_HEIGHT = 84;

    /// Defines the number by which stripes will increase and decrease during the animation.
    /// Depending on the moving direction one of top or bottom stripes will
    /// increase and the other will decrease.
    /// This var SHOULD DIVIDE STRIP_ELEMENT_HEIGHT WITH ZERO REMINDER
    /// I.E. #STRIP_ELEMENT_HEIGHT / #SUBTRACT_COEFF should return integer without reminder
    SUBTRACT_COEFF = 1;


    /// This var is used to define the way stripes move, i.e. upward or downward
    /// Which in terns makes the road moving animation
    boolIsRoadMovingForward;

    /// Defines if car should move or stay without stopping the main setInterval step generator.
    /*#boolIsRoadMoving = true;*/

    topStripeBlock;
    topStripeBlockHeight = 0;

    intCarSpeed = 0;

    #accumulatedHeigh = 0; calculatedHeigh = 0; #boolIsToRemoveStripe = false;

    bottomStripeBlock;
    bottomStripeBlockHeight = 0;

    constructor() {

        this.UPPER_INDEX = this.TOTAL_NUMBER_STRIPES - 1;

        this.accumulatedHeigh = 0; this.calculatedHeigh = 0;

        this.boolIsRoadMovingForward = true;

        this.carSpeedIntPart = 1; this.devider = 4;

        this.initRoad();
    }

    //#region GetSetRoadMovingStatus

    changeRoadMovingStatus() {

            this.boolIsRoadMoving = !this.boolIsRoadMoving;
    }

    //#endregion GetSetRoadMovingStatus

    placeStripesOnDom() {

        let forIndex, arrLenght = this.arrAllStripeElements.length, stripeBlock;

        for (forIndex = 0; forIndex < arrLenght; forIndex++) {

            stripeBlock = this.arrAllStripeElements[forIndex];

            this.roadObj.append(stripeBlock);
        }
    }

    // Here I am using imported methods - import StripesCreator from './UtilStripesCreator.js';
    // just to show viriety of approaches
    createAllStripes() {

        // Adding N number of DIV elements (stripes) in an array #arrAllStripeElements
        // Current colors' styles are black and white and height is #STRIP_ELEMENT_HEIGHT
        // Done in external (imported) function for the sake of variety
        StripesCreator
            .createAllInitialStripes(this.arrAllStripeElements
                , this.TOTAL_NUMBER_STRIPES
                , this.STRIP_ELEMENT_HEIGHT);

        // After baing added to the array those DIV elements are prepend to the roadObj DIV
        this.placeStripesOnDom();
    }

    initializeHeights() {

        this.topStripeBlock = this.arrAllStripeElements[0];

        this.bottomStripeBlock = this.arrAllStripeElements[this.UPPER_INDEX];

        this.topStripeBlockHeight = this.STRIP_ELEMENT_HEIGHT / 2;
        this.topStripeBlockHeight = Math.round(this.topStripeBlockHeight);

        this.bottomStripeBlockHeight = this.STRIP_ELEMENT_HEIGHT - this.topStripeBlockHeight;

        this.topStripeBlock.style.height = this.topStripeBlockHeight.toString() + "px";
        this.bottomStripeBlock.style.height = this.bottomStripeBlockHeight.toString() + "px";

    }

    initRoad() {

        this.createAllStripes();
        this.placeStripesOnDom();
        this.initializeHeights()
    }
    //===============   End of initializations    ====================================

    moveStripes(intCarSpeed) {

        this.boolIsToRemoveStripe = false;

        // this.boolIsRoadMovingForward = true;

        if (this.boolIsRoadMovingForward === true) {

            /// If boolIsCarMovingForward  === true then road stripes are moving DOWN-ward. Which means
            /// the top stripes inreasing in height by #SUBTRACT_COEFF. The bottom ones
            /// are decreasing in height again by #SUBTRACT_COEFF, so to be in synch.
            /// When top stripes reach their max height (currently #STRIP_ELEMENT_HEIGHT) AND
            /// bottom stripes reach 0 height then bottom stripes are taken from their line
            /// and put on top for keeping continous motion.

            // Newest note - stripes are not increasing or decreasing by SUBTRACT_COEFF
            // but by incommins speed intCarSpeed. My newest experiment to animate the car's speed
            // by varying the chuncks cut or added on top and bottom

            this.topStripeBlockHeight = this.topStripeBlockHeight + intCarSpeed;
            this.bottomStripeBlockHeight = this.bottomStripeBlockHeight - intCarSpeed;

            if ((this.topStripeBlockHeight >= this.STRIP_ELEMENT_HEIGHT)
                && (this.bottomStripeBlockHeight <= 0)) {

                this.bottomStripeBlock.remove();

                // removes element from the index 0 end of array
                this.arrAllStripeElements.pop();

                // resets its height
                this.topStripeBlock.style.height = this.STRIP_ELEMENT_HEIGHT.toString() + "px";
                this.bottomStripeBlock.style.height = this.STRIP_ELEMENT_HEIGHT.toString() + "px";

                // adds element at the upper index end of array
                this.arrAllStripeElements.unshift(this.bottomStripeBlock);

                this.topStripeBlock = this.arrAllStripeElements[0];

                this.bottomStripeBlock = this.arrAllStripeElements[this.UPPER_INDEX];

                this.roadObj.prepend(this.topStripeBlock);

                if (this.topStripeBlockHeight > this.STRIP_ELEMENT_HEIGHT){

                    this.calculatedHeigh = this.topStripeBlockHeight - this.STRIP_ELEMENT_HEIGHT;

                    this.topStripeBlockHeight = this.calculatedHeigh;
                    this.bottomStripeBlockHeight = this.STRIP_ELEMENT_HEIGHT - this.calculatedHeigh;
                }
                else if (this.topStripeBlockHeight === this.STRIP_ELEMENT_HEIGHT) {

                    this.topStripeBlockHeight = 0;
                    this.bottomStripeBlockHeight = this.STRIP_ELEMENT_HEIGHT;
                }
            }

            this.topStripeBlock.style.height = this.topStripeBlockHeight.toString() + "px";
            this.bottomStripeBlock.style.height = this.bottomStripeBlockHeight.toString() + "px";
        }
        else {    ////   boolIsCarMovingForward === false

            /// If boolIsCarMovingForward === false then road stripes are moving UP-ward. Which means
            /// the bottom stripes inreasing in height by #SUBTRACT_COEFF. The top ones
            /// are decreasing in height again by #SUBTRACT_COEFF, so to be in synch.
            /// When bottom stripes reach their max height (currently #STRIP_ELEMENT_HEIGHT) AND
            /// top stripes reach 0 height, then top trips are taken from their line
            /// and put on bottom for keeping continous motion.

            this.topStripeBlockHeight = this.topStripeBlockHeight - intCarSpeed;
            this.bottomStripeBlockHeight = this.bottomStripeBlockHeight + intCarSpeed;

            if ((this.topStripeBlockHeight <= 0)
                && (this.bottomStripeBlockHeight >= this.STRIP_ELEMENT_HEIGHT)) {

                this.topStripeBlock.remove();

                // 
                this.arrAllStripeElements.shift();

                // resets its height
                this.topStripeBlock.style.height = this.STRIP_ELEMENT_HEIGHT.toString() + "px";
                this.bottomStripeBlock.style.height = this.STRIP_ELEMENT_HEIGHT.toString() + "px";

                this.arrAllStripeElements.push(this.topStripeBlock);

                this.topStripeBlock = this.arrAllStripeElements[0];
                this.bottomStripeBlock = this.arrAllStripeElements[this.UPPER_INDEX];

                this.roadObj.append(this.bottomStripeBlock);

                if (this.bottomStripeBlockHeight > this.STRIP_ELEMENT_HEIGHT) {

                    this.calculatedHeigh = this.bottomStripeBlockHeight - this.STRIP_ELEMENT_HEIGHT;

                    this.topStripeBlockHeight = this.STRIP_ELEMENT_HEIGHT - this.calculatedHeigh;
                    this.bottomStripeBlockHeight = this.calculatedHeigh;
                }
                else if (this.bottomStripeBlockHeight === this.STRIP_ELEMENT_HEIGHT) {

                    //console.log("Should be equal ", this.STRIP_ELEMENT_HEIGHT, this.bottomStripeBlockHeight);

                    this.topStripeBlockHeight = this.STRIP_ELEMENT_HEIGHT;
                    this.bottomStripeBlockHeight = 0;

                    //console.log("bottomStripeBlockHeight value ", this.bottomStripeBlockHeight);
                }
            }
            
            this.topStripeBlock.style.height = this.topStripeBlockHeight + "px";
            this.bottomStripeBlock.style.height = this.bottomStripeBlockHeight + "px";
        }

    } /// End moveStripes()

    move(carSpeed,currentAutoGearNumber, clockCounter) {

        if (currentAutoGearNumber === GearsEnum["R"])
            this.boolIsRoadMovingForward = false;

        else
            this.boolIsRoadMovingForward = true;
        
       
        this.calculatedCarSpeed = carSpeed / 10;

        this.carSpeedIntPart = 1;

        this.carSpeedIntPart = this.carSpeedIntPart + Math.floor(this.calculatedCarSpeed);

        if (this.carSpeedIntPart === 1) {

            this.devider = 4;
            this.intCarSpeed = 1;

        }
        else if (this.carSpeedIntPart === 2) {

            this.devider = 4;
            this.intCarSpeed = 3;
        }
        else if (this.carSpeedIntPart === 3) {

            this.devider = 4;
            this.intCarSpeed = 4;
        }
        else if (this.carSpeedIntPart === 4) {

            this.devider = 4;
            this.intCarSpeed = 6;
        }
        else if (this.carSpeedIntPart === 5) {

            this.devider = 3;
            this.intCarSpeed = 4;
        }
        else if (this.carSpeedIntPart === 6) {

            this.devider = 3;
            this.intCarSpeed = 5;
        }
        else if (this.carSpeedIntPart === 7) {

            this.devider = 3;
            this.intCarSpeed = 6;
        }
        else if (this.carSpeedIntPart === 8) {

            this.devider = 2;
            this.intCarSpeed = 4;
        }
        else if (this.carSpeedIntPart === 9) {

            this.devider = 2;
            this.intCarSpeed = 5;
        }
        else if (this.carSpeedIntPart === 10) {

            this.devider = 2;
            this.intCarSpeed = 6;
        }
        else if (this.carSpeedIntPart === 11) {

            this.devider = 2;
            this.intCarSpeed = 7;
        }
        else if (this.carSpeedIntPart === 12) {

            this.devider = 1;
            this.intCarSpeed = 4;
        }
        else if (this.carSpeedIntPart === 13) {

            this.devider = 1;
            this.intCarSpeed = 5;
        }
        else if (this.carSpeedIntPart === 14) {

            this.devider = 1;
            this.intCarSpeed = 6;
        }
        else if (this.carSpeedIntPart === 15) {

            this.devider = 1;
            this.intCarSpeed = 7;
        }

        //carSpeed = 1; // 5 -> 1 ~ 5 / 4 -> 1 ~ 7 / 3 -> 3 ~ 12 
        //this.intCarSpeed = Math.round(carSpeed);

        if (clockCounter % this.devider === 0) {

            this.moveStripes(this.intCarSpeed);
        }

    }
}

export default Road;