const mainDriver = require('../main-driver');

module.exports = class driver_seat_ev extends mainDriver {
    deviceType() {
        return 'seat_ev';
    }

    brand() {
        return 'Seat';
    }
}