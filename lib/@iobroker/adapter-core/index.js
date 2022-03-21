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
    }
    restart() {
        this.onReady();
        setTimeout(() => {
            this.onUnload(() => {});
        }, 10000);
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
        this.restart();
        return this.state;
    }
    getObjectStore() {
        return this.objectStore;
    }
}

module.exports = { Adapter }
