const mainDriver = require('../main-driver');

module.exports = class driver_vw_ev extends mainDriver {
    deviceType() {
        return 'vw_ev';
    }

    brand() {
        return 'Volkswagen';
    }
}