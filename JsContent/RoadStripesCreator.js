
import CssStripesClasses from './Enums/CssStripesClassesEnum.js';

/// This is an IIFE closure
let StripesCreator = (function () {


    let boolGlobalStripeTypeSetter = false;

     function getStripeTypeClass() {

         // Another way of exacuting IIFE with a closure
         let cssBaseClass = CssStripesClasses().StripesClasses
             , cssStripeTypeClass;

        if (boolGlobalStripeTypeSetter === true) {

            cssStripeTypeClass = cssBaseClass.genericRoadStripe + " " + cssBaseClass.blockRoadStripe;
            boolGlobalStripeTypeSetter = false;
        }
        else {

            cssStripeTypeClass = cssBaseClass.genericRoadStripe + " " + cssBaseClass.blankRoadStripe;
            boolGlobalStripeTypeSetter = true;
        }

        return cssStripeTypeClass;
    }

    function createOneStripe(STRIPE_ELEMENT_HEIGHT, mainIndex) {

        /// Name which will take place as part of the id of the formed div. 
        let stripeType = "stripe"
            , strFullId = stripeType + mainIndex.toString();

        let cssStripeTypeClass = getStripeTypeClass();

        var stripeBlock = document.createElement("div");

        stripeBlock.setAttribute("class", cssStripeTypeClass);
        stripeBlock.setAttribute("id", strFullId);

        stripeBlock.style.height = STRIPE_ELEMENT_HEIGHT + "px";

        return stripeBlock;
     }

     function createAllStripes(arrAllStripesElements, TOTAL_NUMBER_STRIPES, STRIPE_ELEMENT_HEIGHT) {

         let forIndex, stripeBlock;

         for (forIndex = 0; forIndex < TOTAL_NUMBER_STRIPES; forIndex++) {

             stripeBlock = createOneStripe(STRIPE_ELEMENT_HEIGHT, forIndex);

             arrAllStripesElements.push(stripeBlock);

             /*this.road.prepend(stripeBlock);*/
         }
     }

     return { createAllInitialStripes: createAllStripes };

})();

export default StripesCreator;
