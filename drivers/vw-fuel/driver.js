const mainDriver = require('../main-driver');

module.exports = class driver_vw_fuel extends mainDriver {
    deviceType() {
        return 'vw_fuel';
    }

    brand() {
        return 'Volkswagen';
    }
}