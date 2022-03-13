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
            interval: options.interval || 3,
            forceinterval: options.forceInterval || 360,
            reversePos: false,
            rights: false,
            tripType: "none",
            numberOfTrips: 1
        }

        console.log('creating adapter - config', {...this.config, username: 'LOG', user: 'LOG', password: 'LOG', pin: 'LOG'});
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
    getVin() {
        return this.vinArray;
    }
    getObjectStore() {
        return this.objectStore;
    }
    restart() {}
}

module.exports = { Adapter }
