const localDriver = require('../main-driver');

module.exports = class driver_vw_ev extends localDriver {
    deviceType() {
        return 'vw_ev';
    }
}