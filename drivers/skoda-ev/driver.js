const mainDriver = require('../main-driver');

module.exports = class driver_skoda_ev extends mainDriver {
    deviceType() {
        return 'skoda_ev';
    }
    
    brand() {
        return 'Skoda';
    }
}