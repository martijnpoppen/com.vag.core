const mainDriver = require('../main-driver');

module.exports = class driver_seat_fuel extends mainDriver {
    deviceType() {
        return 'seat_fuel';
    }
    
    brand() {
        return 'Seat';
    }
}