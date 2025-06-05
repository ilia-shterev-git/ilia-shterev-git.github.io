

import LANGUAGES_ENUM from "./LanguagesEnum.js";

class LanguageDetector {

    "use strict";

    #currentLanguage;

    #DEFAULT_LANGUAGE;

    constructor(LANGUAGES_ENUM) {

        this.#DEFAULT_LANGUAGE = LANGUAGES_ENUM.English;
        this.#currentLanguage = this.#getSetCurrentLanguage(LANGUAGES_ENUM);
    }

    get getCurrentLanguage() { return this.#currentLanguage };

    #getSetCurrentLanguage(LANGUAGES_ENUM) {

        let boolIsThereLanguage;

        // we continue checking user's (browser's) language
        let userLang = navigator.language || navigator.userLanguage;

        userLang = this.#checkAndCutLangString(userLang);

        // if current user's (browser's) language is a match in our 
        // LANGUAGES_ENUM we are good to go - return that language
        boolIsThereLanguage = Object.values(LANGUAGES_ENUM).includes(userLang);

        if (boolIsThereLanguage === true)
            return userLang;

        // if current user's (browser's) language was NOT  a match in our 
        // LANGUAGES_ENUM we will make yet another check in the list of the rest
        // of the user's (browser's) languages
        let boolIsThereALangMatch = false,
            allNavigatorLanguagesArr,
            allUserLanguagesArr,
            tempNavLanguage;

        allNavigatorLanguagesArr = navigator.languages;

        allUserLanguagesArr = Object.values(LANGUAGES_ENUM);

        // Currently there 2 loops. One is for the browser's langs
        // Second is for each lang from in my lang pack.
        for (const navigatorLanguage of allNavigatorLanguagesArr) {

            // Curently I do not use localized versions of languages
            // for ex. en-us. There are not extended lang text etc.
            // So if the browser returns such string I take only the first 2 chars.
            tempNavLanguage = this.#checkAndCutLangString(navigatorLanguage);

            for (const userLanguage of allUserLanguagesArr) {

                if (tempNavLanguage === userLanguage) {

                    userLang = userLanguage;
                    boolIsThereALangMatch = true;
                    break;
                }
            };

            if (boolIsThereALangMatch === true)
                break;
        };

        // if after the last check in browser's list of languages
        // NO match was found  - fall back to English
        if (boolIsThereALangMatch === false)
            userLang = this.#DEFAULT_LANGUAGE;

        return userLang;
    }

    // Curently I do not use localized versions of languages
    // for ex. en-us since there are not extended lang text etc.
    // So if the browser returns such string I take only the first 2 chars.
    #checkAndCutLangString(userLang) {

        if (userLang.length > 2)

            userLang = userLang.substring(0, 2)
        
        return userLang;
    }
}

const LanguageDetectorObj = new LanguageDetector(LANGUAGES_ENUM);

export default LanguageDetectorObj;