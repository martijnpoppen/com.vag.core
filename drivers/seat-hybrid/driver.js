const mainDriver = require('../main-driver');

module.exports = class driver_seat_hybrid extends mainDriver {
    deviceType() {
        return 'seat_hybrid';
    }

    brand() {
        return 'Seat';
    }
}