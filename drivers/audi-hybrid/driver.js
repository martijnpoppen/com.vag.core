const mainDriver = require('../main-driver');

module.exports = class driver_audi_hybrid extends mainDriver {
    deviceType() {
        return 'audi_hybrid';
    }
    
    brand() {
        return 'Audi';
    }
}