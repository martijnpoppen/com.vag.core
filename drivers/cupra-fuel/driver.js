const mainDriver = require('../main-driver');

module.exports = class driver_cupra_fuel extends mainDriver {
    deviceType() {
        return 'cupra_fuel';
    }
    
    brand() {
        return 'Cupra';
    }
}