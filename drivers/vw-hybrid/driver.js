const mainDriver = require('../main-driver');

module.exports = class driver_vw_hybrid extends mainDriver {
    deviceType() {
        return 'vw_hybrid';
    }

    brand() {
        return 'Volkswagen';
    }
}