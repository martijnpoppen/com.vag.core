const mainDriver = require('../main-driver');

module.exports = class driver_cupra_hybrid extends mainDriver {
    deviceType() {
        return 'cupra_hybrid';
    }

    brand() {
        return 'Cupra';
    }
}