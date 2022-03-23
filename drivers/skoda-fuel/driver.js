const mainDriver = require('../main-driver');

module.exports = class driver_skoda_fuel extends mainDriver {
    deviceType() {
        return 'skoda_fuel';
    }
    
    brand() {
        return 'Skoda';
    }
}