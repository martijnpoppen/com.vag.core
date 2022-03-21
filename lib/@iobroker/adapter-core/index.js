class Adapter {
    config = {}
    registered = {}
    objectStore = {}
    state = {}
    log = {error: function() {}, log: function() {}, debug: function() {}}
    // log = console
    constructor(options) {
        console.log('creating adapter - options', {...options, username: 'LOG', password: 'LOG', pin: 'LOG'});
        this.config = {
            ...options,
            type: options.type || "id",
            user: options.username,
            password: options.password,
            pin: options.pin || null,
            historyLimit: -1,
            interval: 3,
            forceinterval: 0,
            reversePos: false,
            rights: false,
            tripType: "none",
            numberOfTrips: 1
        }

        // Reset the connection indicator during startup
        this.type = "VW";
        this.country = "DE";
        this.clientId = "9496332b-ea03-4091-a224-8c746b885068%40apps_vw-dilab_com";
        this.xclientId = "38761134-34d0-41f3-9a73-c4be88d7d337";
        this.scope = "openid%20profile%20mbb%20email%20cars%20birthdate%20badge%20address%20vin";
        this.redirect = "carnet%3A%2F%2Fidentity-kit%2Flogin";
        this.xrequest = "de.volkswagen.carnet.eu.eremote";
        this.responseType = "id_token%20token%20code";
        this.xappversion = "5.1.2";
        this.xappname = "eRemote";
        if (this.config.type === "id") {
            this.type = "Id";
            this.country = "DE";
            this.clientId = "a24fba63-34b3-4d43-b181-942111e6bda8@apps_vw-dilab_com";
            this.xclientId = "";
            this.scope = "openid profile badge cars dealers birthdate vin";
            this.redirect = "weconnect://authenticated";
            this.xrequest = "com.volkswagen.weconnect";
            this.responseType = "code id_token token";
            this.xappversion = "";
            this.xappname = "";
        }
        if (this.config.type === "skoda") {
            this.type = "Skoda";
            this.country = "CZ";
            this.clientId = "f9a2359a-b776-46d9-bd0c-db1904343117@apps_vw-dilab_com";
            this.xclientId = "afb0473b-6d82-42b8-bfea-cead338c46ef";
            this.scope = "openid mbb profile";
            this.redirect = "skodaconnect://oidc.login/";
            this.xrequest = "cz.skodaauto.connect";
            this.responseType = "code%20id_token";
            this.xappversion = "3.2.6";
            this.xappname = "cz.skodaauto.connect";
        }
        if (this.config.type === "skodae") {
            this.type = "Skoda";
            this.country = "CZ";
            this.clientId = "f9a2359a-b776-46d9-bd0c-db1904343117@apps_vw-dilab_com";
            this.xclientId = "afb0473b-6d82-42b8-bfea-cead338c46ef";
            this.scope = "openid mbb profile";
            this.redirect = "skodaconnect://oidc.login/";
            this.xrequest = "cz.skodaauto.connect";
            this.responseType = "code%20id_token";
            this.xappversion = "3.2.6";
            this.xappname = "cz.skodaauto.connect";
        }
        if (this.config.type === "seat") {
            this.type = "Seat";
            this.country = "ES";
            this.clientId = "50f215ac-4444-4230-9fb1-fe15cd1a9bcc@apps_vw-dilab_com";
            this.xclientId = "9dcc70f0-8e79-423a-a3fa-4065d99088b4";
            this.scope = "openid profile mbb cars birthdate nickname address phone";
            this.redirect = "seatconnect://identity-kit/login";
            this.xrequest = "cz.skodaauto.connect";
            this.responseType = "code%20id_token";
            this.xappversion = "1.1.29";
            this.xappname = "SEATConnect";
        }
        if (this.config.type === "vwv2") {
            this.type = "VW";
            this.country = "DE";
            this.clientId = "9496332b-ea03-4091-a224-8c746b885068@apps_vw-dilab_com";
            this.xclientId = "89312f5d-b853-4965-a471-b0859ee468af";
            this.scope = "openid profile mbb cars birthdate nickname address phone";
            this.redirect = "carnet://identity-kit/login";
            this.xrequest = "de.volkswagen.car-net.eu.e-remote";
            this.responseType = "id_token%20token%20code";
            this.xappversion = "5.6.7";
            this.xappname = "We Connect";
        }
        if (this.config.type === "audi") {
            this.type = "Audi";
            this.country = "DE";
            this.clientId = "09b6cbec-cd19-4589-82fd-363dfa8c24da@apps_vw-dilab_com";
            this.xclientId = "77869e21-e30a-4a92-b016-48ab7d3db1d8";
            this.scope = "address profile badge birthdate birthplace nationalIdentifier nationality profession email vin phone nickname name picture mbb gallery openid";
            this.redirect = "myaudi:///";
            this.xrequest = "de.myaudi.mobile.assistant";
            this.responseType = "token%20id_token";
            // this.responseType = "code";
            this.xappversion = "3.22.0";
            this.xappname = "myAudi";
        }
        if (this.config.type === "audidata") {
            this.type = "Audi";
            this.country = "DE";
            this.clientId = "ec6198b1-b31e-41ec-9a69-95d42d6497ed@apps_vw-dilab_com";
            this.scope = "openid profile address email phone";
            this.redirect = "acpp://de.audi.connectplugandplay/oauth2redirect/identitykit";
            this.responseType = "code";
        }
        if (this.config.type === "go") {
            this.type = "";
            this.country = "";
            this.clientId = "ac42b0fa-3b11-48a0-a941-43a399e7ef84@apps_vw-dilab_com";
            this.xclientId = "";
            this.scope = "openid%20profile%20address%20email%20phone";
            this.redirect = "vwconnect%3A%2F%2Fde.volkswagen.vwconnect%2Foauth2redirect%2Fidentitykit";
            this.xrequest = "";
            this.responseType = "code";
            this.xappversion = "";
            this.xappname = "";
        }
        if (this.config.type === "seatelli") {
            this.type = "";
            this.country = "";
            this.clientId = "d940d794-5945-48a3-84b1-44222c387800@apps_vw-dilab_com";
            this.xclientId = "";
            this.scope = "openid profile";
            this.redirect = "Seat-elli-hub://opid";
            this.xrequest = "";
            this.responseType = "code";
            this.xappversion = "";
            this.xappname = "";
        }
        if (this.config.type === "skodapower") {
            this.type = "";
            this.country = "";
            this.clientId = "b84ba8a1-7925-43c9-9963-022587faaac5@apps_vw-dilab_com";
            this.xclientId = "";
            this.scope = "openid profile";
            this.redirect = "skoda-hub://opid";
            this.xrequest = "";
            this.responseType = "code";
            this.xappversion = "";
            this.xappname = "";
        }
        if (this.config.interval === 0) {
            this.log.info("Interval of 0 is not allowed reset to 1");
            this.config.interval = 1;
        }
        this.tripTypes = [];
        if (this.config.tripShortTerm == true) {
            this.tripTypes.push("shortTerm");
        }
        if (this.config.tripLongTerm == true) {
            this.tripTypes.push("longTerm");
        }
        if (this.config.tripCyclic == true) {
            this.tripTypes.push("cyclic");
        }
    }
    on(name, func) {
        this.registered[name] = func;
    }
    sendEvent(dippa) {
        this.registered[dippa]();
    }
    setState(name, value) {
        this.state[name] = value
    }
    subscribeStates(param) {
    }
    setObjectNotExists(name, value) {
        this.objectStore[name] = value;
    }
    setObjectNotExistsAsync(name, value) {
        this.objectStore[name] = value;
        return Promise.resolve(this.objectStore);
    }
    getObject() {
    }
    getState() {
        return this.state;
    }
    getObjectStore() {
        return this.objectStore;
    }
}

module.exports = { Adapter }
