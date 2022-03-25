class Adapter {
    config = {}
    registered = {}
    objectStore = {}
    state = {}
    log = {error: function() {}, log: function() {}, debug: function() {}, warn: function() {}}
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
    getState() {
        return this.state;
    }
    getObjectStore() {
        return this.objectStore;
    }
}

module.exports = { Adapter }
