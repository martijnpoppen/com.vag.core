const Homey = require('homey');

class Adapter {
    config = {}
    registered = {}
    objectStore = {}
    state = {}
    log = {}
    // log = console
    constructor(options) {
        console.log('creating adapter - options', {...options, username: 'LOG', password: 'LOG', pin: 'LOG', homeyDevice: 'LOG'});
        this.config = {
            ...options,
            type: options.type || "id",
            user: options.username,
            password: options.password,
            pin: options.pin || "",
            historyLimit: -1,
            interval: 3,
            forceinterval: 0,
            reversePos: false,
            rights: false,
            tripType: "none",
            numberOfTrips: 1
        }

        this.homeyDevice = options.homeyDevice;

        this.log.error = options.error;
        this.log.log = function() {};
        this.log.debug = function() {}
        this.log.warn = function() {};
        this.log.info = function() {};
        // this.log.log = options.log;
        // this.log.debug = options.log
        // this.log.warn = options.log;
        // this.log.info = options.log;
    }
    restart() {
        console.log('[adapter-core] The adapter should restart now')
        this.homeyDevice.setRestart(true);
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
    getStateAsync(val) {
        val = val.replace('vw-connect.0.', '');
        return { val: this.state[val] };
    }
    getState() {
        return this.state;
    }
    getObjectStore() {
        return this.objectStore;
    }
}

module.exports = { Adapter }
