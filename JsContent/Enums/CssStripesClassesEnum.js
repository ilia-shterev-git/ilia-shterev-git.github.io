
// Another approach with an IIFE closure
export default function CssStripesClasses() {

    let StripesClasses = {

        genericRoadStripe: "road-stripe",
        blockRoadStripe: "block-road-stripe",
        blankRoadStripe: "blank-road-stripe"
    };

    return { StripesClasses: StripesClasses };
};

