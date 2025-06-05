

export default function genericButtonFn(domElement, eventToListenTo, callBackFn) {
    "use strict";

    domElement.addEventListener(eventToListenTo, function () {

        callBackFn();
    });
}