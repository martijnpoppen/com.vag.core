const localDriver = require('../main-driver');

module.exports = class driver_vw_fuel extends localDriver {
    deviceType() {
        return 'vw_fuel';
    }
}