exports.init = async function (homey) {
    const measure_connected = homey.flow.getConditionCard('measure_connected')
    measure_connected.registerRunListener( async (args, state) =>  {
       homey.app.log('[measure_connected]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`measure_connected`) === true;
    });

    const measure_is_home = homey.flow.getConditionCard('measure_is_home')
    measure_is_home.registerRunListener( async (args, state) =>  {
       homey.app.log('[measure_is_home]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`measure_is_home`) === true;
    });

    const measure_is_moving = homey.flow.getConditionCard('measure_is_moving')
    measure_is_moving.registerRunListener( async (args, state) =>  {
       homey.app.log('[measure_is_moving]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`measure_is_moving`) === true;
    });

    const measure_plug_connected = homey.flow.getConditionCard('measure_plug_connected')
    measure_plug_connected.registerRunListener( async (args, state) =>  {
       homey.app.log('[measure_plug_connected]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`measure_plug_connected`) === true;
    });
};
