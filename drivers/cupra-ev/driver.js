const mainDriver = require('../main-driver');

module.exports = class driver_cupra_ev extends mainDriver {
    deviceType() {
        return 'cupra_ev';
    }

    brand() {
        return 'Cupra';
    }
}