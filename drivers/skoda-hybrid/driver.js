const mainDriver = require('../main-driver');

module.exports = class driver_skoda_hybrid extends mainDriver {
    deviceType() {
        return 'skoda_hybrid';
    }

    brand() {
        return 'Skoda';
    }
}