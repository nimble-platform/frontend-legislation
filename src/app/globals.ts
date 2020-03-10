import { Injectable } from "@angular/core";


@Injectable()
export class Globals {

    static nimbleIdentityServiceUrl: string = "https://fmp-nimble.salzburgresearch.at/api/identity/login";
    static urlServiceRoot: string = "http://77.230.101.223/nimsys";
    //static urlServiceRoot: string = "http://localhost:8080/nimsys";
    static authMode: string = "nimble"; /* [internal | nimble] */

    static datePlaceholder: string = "yyyy-mm-dd";
    static registrationLink: string = "https://fmp-nimble.salzburgresearch.at/#/user-mgmt/registration";

    static availableLanguages = ["en", "es"];
    static defaultLanguage = "en";
}
