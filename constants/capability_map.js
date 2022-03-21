const status_types = require('./status_types');

module.exports = {
    'vw-fuel': {
        locked: `status.isCarLocked`,
        measure_temperature: `status.outsideTemperature`,
        measure_is_moving: `position.isMoving`,
        measure_is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_connected: `general.isConnect`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}`,
        measure_fuel_level: [`status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}`],
        measure_range: [`status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}`]
    },
    'vw-hybrid': {
        locked: `status.isCarLocked`,
        measure_temperature: `status.temperature`,
        measure_is_moving: `position.isMoving`,
        measure_is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_connected: `general.isConnect`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}`,
        measure_fuel_level: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}`,
        measure_battery: `status.data_${status_types.LEVELS2}.field_${status_types.STATE_OF_CHARGE}`,
        measure_range: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}`
    },
    'vw-ev': {
        locked: `status.isCarLocked`,
        measure_temperature: `climater.settings.targetTemperature`,
        'measure_temperature.outdoor': `status.outSideTemperature`,
        measure_is_moving: `position.isMoving`,
        measure_is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_connected: `general.isConnect`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}`,
        measure_battery: `status.data_${status_types.LEVELS2}.field_${status_types.STATE_OF_CHARGE}`,
        measure_range: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}`
    },
    'vw-ev-id': {
        measure_temperature: `status.climatisationSettings.targetTemperature_C`,
        measure_is_home: {
            latitude: 'wecharge.chargeandpay.records.latestItem.location_coordinates_latitude',
            longitude: 'wecharge.chargeandpay.records.latestItem.location_coordinates_longitude'
        },
        measure_connected: `readinessStatus.connectionState.isOnline`,
        measure_battery: `status.batteryStatus.currentSOC_pct`,
        measure_charge_target: `status.chargingSettings.targetSOC_pct`,
        measure_remaining_charge_time: `status.chargingStatus.remainingChargingTimeToComplete_min`,
        measure_remaining_climate_time: `status.climatisationStatus.remainingClimatisationTime_min`,
        measure_range: `status.rangeStatus.totalRange_km`
    }
};
