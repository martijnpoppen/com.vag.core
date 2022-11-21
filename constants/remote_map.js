module.exports = [
    {
        capability: 'remote_battery_charge',
        default: "is_charging",
        operator: false
    },
    {
        capability: 'remote_climatisation',
        default: 'is_climating',
        operator: false
    },
    {
        capability: 'remote_climatisation_v2',
        default: 'is_climating',
        operator: false
    },
    {
        capability: 'remote_climatisation_v3',
        default: 'is_climating',
        operator: false
    }
    // {
    //     capability: 'remote_ventilation',
    //     default: 'measure_remaining_climate_time',
    //     operator: 0
    // },
    // {
    //     capability: 'remote_ventilation_v2',
    //     default: 'measure_remaining_climate_time',
    //     operator: 0
    // },
    // {
    //     capability: 'remote_ventilation_v3',
    //     default: 'measure_remaining_climate_time',
    //     operator: 0
    // },
    // {
    //     capability: 'remote_window_heating',
    //     default: 'measure_remaining_climate_time',
    //     operator: 0
    // }
];
