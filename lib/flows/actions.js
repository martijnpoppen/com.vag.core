exports.init = async function (homey) {
    const remote_charge_min_limit = homey.flow.getActionCard('remote_charge_min_limit');
    remote_charge_min_limit.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_charge_min_limit': parseInt(args.limit)});
    });

    const remote_max_charge_current = homey.flow.getActionCard('remote_max_charge_current');
    remote_max_charge_current.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_max_charge_current': parseInt(args.limit)});
    });

    const remote_battery_charge = homey.flow.getActionCard('remote_battery_charge');
    remote_battery_charge.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_battery_charge': !!parseInt(args.action_start_stop)});
    });
    
    const remote_climatisation = homey.flow.getActionCard('remote_climatisation');
    remote_climatisation.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_climatisation': !!parseInt(args.action_start_stop)});
    });

    const remote_climatisation_v2 = homey.flow.getActionCard('remote_climatisation_v2');
    remote_climatisation_v2.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_climatisation_v2': !!parseInt(args.action_start_stop)});
    });

    const remote_climatisation_v3 = homey.flow.getActionCard('remote_climatisation_v3');
    remote_climatisation_v3.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_climatisation_v3': !!parseInt(args.action_start_stop)});
    });

    const remote_flash = homey.flow.getActionCard('remote_flash');
    remote_flash.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_flash': !!parseInt(args.action_start_stop)});
    });

    const remote_flash_honk = homey.flow.getActionCard('remote_flash_honk');
    remote_flash_honk.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_flash_honk': !!parseInt(args.action_start_stop)});
    });

    const remote_force_refresh = homey.flow.getActionCard('remote_force_refresh');
    remote_force_refresh.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_force_refresh': true});
    });

    const remote_ventilation = homey.flow.getActionCard('remote_ventilation');
    remote_ventilation.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_ventilation': !!parseInt(args.action_start_stop)});
    });

    const remote_ventilation_v2 = homey.flow.getActionCard('remote_ventilation_v2');
    remote_ventilation_v2.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_ventilation_v2': !!parseInt(args.action_start_stop)});
    });

    const remote_ventilation_v3 = homey.flow.getActionCard('remote_ventilation_v3');
    remote_ventilation_v3.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_ventilation_v3': !!parseInt(args.action_start_stop)});
    });

    const remote_window_heating = homey.flow.getActionCard('remote_window_heating');
    remote_window_heating.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_window_heating': !!parseInt(args.action_start_stop)});
    });

    const remote_set_interval = homey.flow.getActionCard('remote_set_interval');
    remote_set_interval.registerRunListener(async (args, state) => {
        await args.device.onCapability_ACTION({'remote_set_interval': parseInt(args.update_interval)});
    });
};