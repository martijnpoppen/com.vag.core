const status_types = require('./status_types');

module.exports = {
    'vw-fuel': {
        locked: `status.isCarLocked`,
        measure_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        measure_is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        measure_range: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_temperature: `status.outsideTemperature`
    },
    'vw-hybrid': {
        locked: `status.isCarLocked`,
        measure_battery: `status.data_${status_types.LEVELS}.field_${status_types.STATE_OF_CHARGE}.value`,
        measure_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        measure_is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_temperature: `climater.settings.targetTemperature.content`,
        'measure_temperature.outdoor': `status.data_0x030102FFFF.field_${status_types.TEMPERATURE_OUTSIDE}.value`
    },
    'vw-ev': {
        locked: `status.isCarLocked`,
        measure_battery: `status.data_${status_types.LEVELS}.field_${status_types.STATE_OF_CHARGE}.value`,
        measure_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        measure_is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_is_moving: `position.isMoving`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_temperature: `climater.settings.targetTemperature.content`,
        'measure_temperature.outdoor': `status.data_0x030102FFFF.field_${status_types.TEMPERATURE_OUTSIDE}.value`
    },
    'vw-ev-id': {
        measure_battery: `status.batteryStatus.currentSOC_pct`,
        measure_charge_target: `status.chargingSettings.targetSOC_pct`,
        measure_connected: `status.readinessStatus.connectionState.isOnline`,
        measure_is_home: { latitude: 'wecharge.chargeandpay.records.latestItem.location_coordinates_latitude', longitude: 'wecharge.chargeandpay.records.latestItem.location_coordinates_longitude' },
        measure_range: `status.rangeStatus.totalRange_km`,
        measure_remaining_charge_time: `status.chargingStatus.remainingChargingTimeToComplete_min`,
        measure_remaining_climate_time: `status.climatisationStatus.remainingClimatisationTime_min`,
        measure_temperature: `status.climatisationSettings.targetTemperature_C`
    }
};
