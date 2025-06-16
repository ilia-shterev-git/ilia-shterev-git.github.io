
First, this project nowhere uses global vars, window scope in my case. It also does not use magic numbers and strings. It havily uses classes, enums and respectively export and imports. On 2 occasions (currently) it uses IIFEs as closures.

It havliy uses global within a class vars. And I take full responsibility for using very INCONSISTENTLY private methods which change such global vars and sometimes I return them altough they are global, sometimes not return them. Knowing that this is not a good practice (at all) I would keep in mind that I will caruflly review my employer's policy about such things.

I also take full responsibility for comparing to thrue or false in the if statements. I know that this could be considered an unfogivable sin :) But I always and everywhere in my code use triple equals.

The app starts with loading CarAnimation.js in the web page as a type="module" . This file is an IIFE and first it imports CarClass and also about 20 other classes which will be injected through the CarClass' constructior and will become Car's controls. Like EngineClass, BreakPedalClass, etc. So they will be under HAS A, Composition OOP relationship. Like Car has an Engine, has a BreakPedal, has a GearBox, etc.

CarAnimation.js also imports ButtonStartStopAnimаtions.js which contains btnStartStopAnimation function containing the button's event handler. Also the instantated CarObj is sent in it as a parameter.

Inside the event handler is the main driving forse of this project - setInterval whose call back calls the Car's main function - CarObj.manageMainClockCycle(globalCounter). globalCounter in this case allows some functionality inside the manageMainClockCycle to be executed once per any number of cycles. The current time interval is MAIN_CLOCK_INTERVAL_DURATION_MS = 6.

I will list those Car's components and briefly explain what they do.                 
- LanguageDetectorObj inside LanguagesManager folder. Checks for navigator.language || navigator.userLanguage If this language is found within project's languages set  we are good to go - return. Else it checks for navigator.languages  and then loops through the array of those languages for each of the projects' language. If match is found it returns that object. If not, it falls back to English. Comes pre-instantiated and carries the current language. Current app's languages are English and Bulgarian. It exposes the following:
.. getCurrentLanguage getter
 
- GasPedalObj - handles the gasPedal range (slider) events - input and mouseup. It exposes the following:
.. setSetGasPedalForAutoRetract() publick method. It sets its own auto retraction when pressed and then released. Unlike break pedal it does not have conditions for auto retracting.                                                                                                                                                                                                   
.. getGasPedalPosition getter. Returns its current position (value) as integer, to the car's object which is then used for further processing either to the EngineObj or GearBoxManager.
.. getIsGasPedalPressed getter. Returns boolean value
.. getIsPointerEventsNoneApplied getter. When the break pedal is pressed it is impоsed the rule for gas pedal not be accessble to be pressed at the same time. It is achieved through pointer-events:none. So this geter gives the boolean value so a desision can be made to either apply the rule or reverse it. In any case it helps not to mess in DOM on each interval cycle.
.. setPointerEventsNone(booleanValue) setter. Marks if the rule is applied or revered.
.. addCssPointerEventsNone(), removeCssPointerEventsNone() methods, apply or reverse the above rule through pointer-events:none.                                                                                                                                                                                                     
.. setGasLabelValue setter. Sets its own label underneath which shows its current position. 

- BreakPedalObj - handles the breakPedal range (slider) events - input and mouseup. It exposes the following:
.. setSetBreakPedalForAutoRetract(boolIsIgnitionOnContact, boolIsEngineRunning) setter. It sets its own auto retraction when pressed and then released. It has some conditions for auto retracting. It will auto retract in all values if it the car is not on contact or engine not running. If car is on contact or engine running it will retract only from position 1 (currently). Otherwise it will stay in place. This is necessary for being able to set and keep the breal pedal pressed while clicking to start engine or shift gears.
TO DO - needs a bit more thinking to determine the exact condition about car contact and engine not running                                                                                                                                                                                                  
.. getBreakPedalPosition getter. Returns its current position (value) as integer, to the car's object which is then used for further processing to GearBoxManager.
.. getIsBreakPedalPressed getter. Returns boolean value.                                                                                                                                                                                                   
.. reportOnEngineStart(). When the Start Engine button is pressed and engine is about to be started it the car makes 2 sysrtem checks. One is whether the break pedal is firmly pressed, i.e. at specific value or above.
.. isBreakPedalFirmlyPressed geter. Retuns whether the break pedal is firmly pressed, i.e. at specific value or above. Used internaly from the above method.
.. addAlarmingColor(), removeAlarmingColor() public methods. If the break pedal is not firmly pressed during the engine's start, car's system will mark that. The start engine process will be stopped and a oval line around the break pedal will flash 2 (currently) in alarming colors to remaind the driver what the problem is.

Unlike gas pedeal, break pedal is never blocked from using.  For safety reasons.                                                                                                                                                                                                  

- EngineObj manages (calculates) engine speed when car is on "P" or "N" auto gear positions. When car is on any other auto gear position with engaged transmisssion the engine speed is managed (calculated) through GearShiftsProcessor.
.. manageEngineSpeed(intIncomingGasPositionValue) the main method which manages (calculates) the engine speed. Manages to imitate pulsating idle speed and engine speed inertial delay. pulsating idle speed can be swithed on or off by one variable IS_IDLE_SPEED_PULSING .
One of my previous versions used an array of engine speed values put in an array. Then for the engine speed I would use not this current value but one from X cycles before. The arry had some fixed lenght and in each cycle I would put one value at the beginnig this.arrEngineSpeed.unshift(engineSpeed) and take one from the end this.arrEngineSpeed.pop(). So it is kept constantly with same lenght
 .. Most of the getters and setters are self explaining

- EngineStarterObj Manages the imitation of starting engine process. The number of starting pulses is semi random. Means they are selected randomly but in between 2 values. The amplitude of each pulse is sami random in the same way. After all pulses are played the starter sets the EngineObj as running.

- PulsesCreatorObj During the engine start process the car makes a system check and if some of the controls are set or not to their must be values. For each control not set to its must be value, PulsesCreatorObj creates pulsing alarm colors. For this project two controls are break pedal and auto gear box. Break pedal must be pressed to position of 2 or higher and te auto gear box must on P position.

- EngineSpeedMeterWithBarsObj,EngineSpeedDigitalMetersObj, EngineSpeedAnalogMeterObj self exlaining names.They are in the CarMetersClasses folder, together with the Car speed meters. All speed meters are equipped with displaySpeed(intIncoming...) publid methods. Again self explainig name.  Same for the other method shutDown(). shutDown is designed to imitate meters switched off.

- CarSpeedMeterWithBarsObj / CarSpeedMeterWithBarsDomWorkerObj, new CarSpeedMeterWithBars(CarSpeedMeterWithBarsDomWorkerObj)
- CarSpeedAnalogMeterObj / CarSpeedAnalogMeterDomWorkerObj, new CarSpeedAnalogMeter(CarSpeedAnalogMeterDomWorkerObj) 

   This was an attempt to further devide two of the speed meters into purely calculating and purely DOM setting units.

..  CarSpeedMeterWithBarsObj gets CarSpeedMeterWithBarsDomWorkerObj injected and in has a relationship. CarSpeedMeterWithBarsObj delas with the outside world the sam way  displaySpeed(intIncoming...) and shutDown() and uses the DOM worker internaly.
.. CarSpeedAnalogMeterObj / CarSpeedAnalogMeterDomWorkerObj exactly the same as above.

- RoadObj. This object is what creates and moves the road's stripes. The stripes are divs stuck on the top of each other. White and transparrent (currently). Those divs are placed in an array and on the DOM. The movement's imitation is achieved by adding / removing pixels to the top of top div and same for the bottom div. When the decreasing div reaches it limits it is removed from the DOM and the array and placed back on the end of the DOM and the array.

TO DO
Movement's design is very clumsy I admit. But for the moment I have limited options. I can either call the moving method in changing periods or by changing the pixels added / removed from the divs. I currently use both methods to achieve somewhat good result. But that leaves the road's changing speed at huge steps - every 10 kilometers. Which is well noticable.  

First, to initially create the strips an old fashioned IIFE is used as a closure which brings createAllStripes as main function. It has an argument which tells it how many stripes to create and their hight.
After all strips are created the road places them on the DOM and then positions them with some height numbers
.. StripesCreator.createAllInitialStripes(this.arrAllStripeElements, this.TOTAL_NUMBER_STRIPES, this.STRIP_ELEMENT_HEIGHT); called from the RoadObj's constructor.
Internally it calls createOneStripe which in tern calls getStripeTypeClass(). 
.. move(carSpeed,currentAutoGearNumber, clockCounter) main method called from car's manageMainClockCycle. clockCounter comes from the CarObj so that both are in sync. currentAutoGearNumber is to determine whether the road (stripes) should move forward or backward.

- GearBoxManager encloses and manages the 3 subcomponents (has a)
-- AutoGearBoxProcessorObj deals with managing the auto gear shift or those on the left panel. Like "P", "N", etc.
-- GearShiftsProcessorObj deals with the whole driving process calculating:
.. calculatedGasPosition, internal gas position used to help the calculations (different from the pedal position)
.. engineSpeed
.. currentGearObj, currentManualGearObj, currentGearNumber, currentDomGearObj managing switching gears 1 to 5 accordingly
.. carSpeed
-- GearBoxDomWorkerObj deals with working with the DOM.

Huge, vast topics. Especially GearBoxManager and AutoGearBoxProcessorObj. So if someone is really interested just please, check it.

The MAJOR action happens inside this block. I have removed some of the code for simplicity.
........................
        else if (this.boolIsEngineRunning === true) {

            this.currentAutoGearNumber = this.GearBoxManagerObj.getCurrentAutoGearNumber;

            if (this.currentAutoGearNumber === GearsEnum["D"]) {

                    this.GearBoxManagerObj
                            .manageOnDirectGear(this.intGasPositionValue, this.intBreakPedalPositionValue);

                    this.engineSpeed = this.GearBoxManagerObj.getEngineSpeed;
                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;
                
						  // There is a specific reason that code to repeat in each else if
                    //  Display Engine Speed on all 3 readers
                    this.#displayEngineSpeed(this.engineSpeed);
                    //  Display Car Speed on all 3 readers
                    this.#displayCarSpeed(this.carSpeed);         
            }
            else if (this.currentAutoGearNumber === GearsEnum["P"]) {

                    this.GearBoxManagerObj.manageOnPark();
                    this.EngineObj.manageEngineSpeed(this.intGasPositionValue);
						  ....
            }
            else if (this.currentAutoGearNumber === GearsEnum["N"]) {

                    this.GearBoxManagerObj
                        .manageOnNeutral(this.intBreakPedalPositionValue);
               
                    this.EngineObj.manageEngineSpeed(this.intGasPositionValue, globalCounter);;
						  ......
            }
            else if (this.currentAutoGearNumber === GearsEnum["R"]) {

                    this.GearBoxManagerObj
                        .manageOnReverse(this.intGasPositionValue, this.intBreakPedalPositionValue);
						  .......         
            }
            else if (this.currentAutoGearNumber === GearsEnum["1"]) {

                    this.GearBoxManagerObj
                        .manageOnFirst(this.intGasPositionValue, this.intBreakPedalPositionValue);
                    .....
            }
            else if (this.currentAutoGearNumber === GearsEnum["2"]) {

                    this.GearBoxManagerObj
                        .manageOnSecond(this.intGasPositionValue, this.intBreakPedalPositionValue);
                
                    this.engineSpeed = this.GearBoxManagerObj.getEngineSpeed;
                    this.carSpeed = this.GearBoxManagerObj.getCarSpeed;
                    ......
            }
        } // END this.boolIsEngineRunning === true

We can see here that engine speed is calculated by the EngineObj when the auto gear is on "P" or "N" position.

On all other positions engine speed is calculated by the GearBoxManagerObj which internally calls to GearShiftsProcessorObj. The calculation is based on the car's current speed, current gas postion, calaculated gas position (used internally inside  GearShiftsProcessorObj) and break pedal position. 

Major part of those calculations are based on
- EngineCharacteristicsObj
and when the break pedal is pressed on
- BreakDecelerationCharacteristicsObj
Both inside JsonArrays folder

Here again I take full reponsibility for having lots of code repetitions inside GearShiftsProcessorObj when it comes to handling all the different gear shift. For ex. manageOnFrst..., is almost the same as manageOnReverse...
