const mainDriver = require('../main-driver');

module.exports = class driver_audi_fuel extends mainDriver {
    deviceType() {
        return 'audi_fuel';
    }
    
    brand() {
        return 'Audi';
    }
}