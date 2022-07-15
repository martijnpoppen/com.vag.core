const Homey = require('homey');

class Adapter {
    config = {}
    registered = {}
    objectStore = {}
    state = {}
    log = {}
    // log = console
    constructor(options) {
        console.log('creating adapter - options', {...options, username: 'LOG', password: 'LOG', pin: 'LOG'});
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

        // this.log.log = function() {};
        // this.log.warn = function() {};
        // this.log.info = function() {};
        // this.log.debug = function() {}
        // this.log.error = function() {}

        this.log.log = options.debug;
        this.log.warn = options.debug;
        this.log.info = options.debug;
        this.log.debug = options.debug;
        this.log.error = options.error;
        
        
    }
    restart() {
        console.log('[adapter-core] The adapter should restart now')
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
    getStatesAsync(val) {
        val = val.replace("undefined.undefined.", "");
        val = val.replace("vw-connect.0.", "");
        val = val.replace(".*", "");
    
        let obj = {};
    
        for (let [k, v] of Object.entries(this.state)) {
          if (k.includes(val)) {
            obj[k] = { val: v };
          } else {
            delete obj[k];
          }
        }
    
        return obj;
    }
    getStateAsync(val) {
        val = val.replace('undefined.undefined.', '');
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
