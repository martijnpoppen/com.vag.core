const mainDriver = require('../main-driver');

module.exports = class driver_audi_ev extends mainDriver {
    deviceType() {
        return 'audi_ev';
    }
    
    brand() {
        return 'Audi';
    }
}