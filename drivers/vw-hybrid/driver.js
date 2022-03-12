const localDriver = require('../main-driver');

module.exports = class driver_vw_hybrid extends localDriver {
    deviceType() {
        return 'vw_hybrid';
    }
}