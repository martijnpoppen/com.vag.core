const status_types = require('./status_types');

module.exports = {
    'vw-fuel': {
        locked: `status.isCarLocked`,
        is_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`
    },
    'vw-hybrid': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'vw-ev': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'vw-ev-id': {
        measure_battery: `status.batteryStatus.currentSOC_pct`,
        measure_percent_battery: `status.batteryStatus.currentSOC_pct`,
        measure_charge_target: `status.chargingSettings.targetSOC_pct`,
        is_connected: `status.readinessStatus.connectionState.isOnline`,
        is_plug_connected: `status.plugStatus.plugConnectionState`,
        measure_range: `status.rangeStatus.totalRange_km`,
        measure_distance_driven: `status.odometerMeasurement.odometer`,
        measure_remaining_charge_time: `status.chargingStatus.remainingChargingTimeToComplete_min`,
        measure_remaining_climate_time: `status.climatisationStatus.remainingClimatisationTime_min`,
        target_temperature: `status.climatisationSettings.targetTemperature_C`
    },
    'seat-fuel': {
        locked: `status.isCarLocked`,
        is_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_temperature_outdoor: `status.outsideTemperature`
    },
    'seat-hybrid': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'cupra-fuel': {
        locked: `status.isCarLocked`,
        is_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_temperature_outdoor: `status.outsideTemperature`
    },
    'cupra-hybrid': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'cupra-ev-seatcupra': {
        measure_battery: `charging.battery.currentSOC_pct`,
        measure_percent_battery: `charging.battery.currentSOC_pct`,
        measure_charge_target: `status.services.charging.targetPct`,
        is_plug_connected: `charging.plug.plugConnectionState`,
        measure_range: `charging.battery.cruisingRangeElectric_km`,
        measure_remaining_charge_time: `charging.charging.remainingChargingTimeToComplete_min`,
        measure_remaining_climate_time: `climatisation.climatisationStatus.remainingClimatisationTime_min`,
        target_temperature: `status.services.climatisation.targetTemperatureKelvin`
    },
    'skoda-fuel': {
        locked: `status.isCarLocked`,
        is_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_temperature_outdoor: `status.outsideTemperature`
    },
    'skoda-hybrid': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'skoda-ev': {
        locked: `status.isCarLocked`,
        measure_battery: `status.data_${status_types.LEVELS}.field_${status_types.STATE_OF_CHARGE}.value`,
        measure_percent_battery: `status.data_${status_types.LEVELS}.field_${status_types.STATE_OF_CHARGE}.value`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        target_temperature: `climater.settings.targetTemperature.content`
    },
    'skoda-ev-skodae': {
        measure_battery: `status.charging.status.battery.stateOfChargeInPercent`,
        measure_percent_battery: `status.charging.status.battery.stateOfChargeInPercent`,
        measure_charge_target: `status.charging.settings.targetStateOfChargeInPercent`,
        is_plug_connected: `status.charging.status.plug.connectionState`,
        is_charging: `status.charging.status.charging.state`,
        measure_range: `status.charging.status.battery.cruisingRangeElectricInMeters`,
        measure_remaining_charge_time: `status.charging.status.charging.remainingToCompleteInSeconds`,
        measure_remaining_climate_time: `status.air-conditioning.status.remainingTimeToReachTargetTemperatureInSeconds`,
        measure_temperature_outdoor: `status.air-conditioning.settings.targetTemperatureInKelvin`,
        target_temperature: `status.air-conditioning.settings.targetTemperatureInKelvin`
    },
    'audi-fuel': {
        locked: `status.isCarLocked`,
        is_connected: `general.isConnect`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        measure_oil_level: `status.data_${status_types.OIL_LEVEL_PERCENTAGE}.field_${status_types.OIL_LEVEL_PERCENTAGE}.value`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`
    },
    'audi-hybrid': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_fuel_level: `status.data_${status_types.LEVELS}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_fuel_level_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        measure_oil_change_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}.value`,
        measure_oil_change_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}.value`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        measure_range: `status.data_${status_types.LEVELS}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK: `status.data_${status_types.LEVELS2}.field_${status_types.TOTAL_RANGE}.value`,
        measure_range_FALLBACK_2: `status.data_${status_types.LEVELS}.field_${status_types.PRIMARY_RANGE}.value`,
        measure_range_FALLBACK_3: `status.data_${status_types.LEVELS2}.field_${status_types.PRIMARY_RANGE}.value`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'audi-ev': {
        locked: `status.isCarLocked`,
        measure_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        measure_percent_battery: `charger.status.batteryStatusData.stateOfCharge.content`,
        is_connected: `general.isConnect`,
        is_charging: `charger.status.chargingStatusData.chargingState.content`,
        measure_distance_driven: `status.data_${status_types.KILOMETER_STATUS}.field_${status_types.KILOMETER_STATUS}.value`,
        measure_inspection_days: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_TIME_TO_INSPECTION}.value`,
        measure_inspection_distance: `status.data_${status_types.MAINTENANCE}.field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}.value`,
        is_home: { latitude: `position.carCoordinate.latitude`, longitude: `position.carCoordinate.longitude` },
        measure_lat: `position.carCoordinate.latitude`,
        measure_lng: `position.carCoordinate.longitude`,
        get_location_url: `position.carCoordinate.longitude`,
        is_moving: `position.isMoving`,
        is_plug_connected: `charger.status.plugStatusData.plugState.content`,
        measure_remaining_charge_time: `charger.status.batteryStatusData.remainingChargingTime.content`,
        measure_remaining_climate_time: `climater.status.climatisationStatusData.remainingClimatisationTime.content`,
        is_climating: `climater.status.climatisationStatusData.climatisationState.content`,
        measure_range: `charger.status.cruisingRangeStatusData.primaryEngineRange.content`,
        target_temperature: `climater.settings.targetTemperature.content`,
        remote_charge_min_limit: `timer.timersAndProfiles.timerBasicSetting.chargeMinLimit`,
        remote_max_charge_current: `charger.settings.maxChargeCurrent.content`
    },
    'audi-ev-audietron': {
        measure_battery: `status.batteryStatus.currentSOC_pct`,
        measure_percent_battery: `status.batteryStatus.currentSOC_pct`,
        measure_charge_target: `status.chargingSettings.targetSOC_pct`,
        is_plug_connected: `status.plugStatus.plugConnectionState`,
        measure_range: `status.rangeStatus.totalRange_km`,
        measure_remaining_charge_time: `status.chargingStatus.remainingChargingTimeToComplete_min`,
        measure_remaining_climate_time: `status.climatisationStatus.remainingClimatisationTime_min`,
        target_temperature: `status.climatisationSettings.targetTemperature_C`
    }
};
