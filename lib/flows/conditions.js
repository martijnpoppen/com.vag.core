exports.init = async function (homey) {
    const is_connected = homey.flow.getConditionCard('is_connected')
    is_connected.registerRunListener( async (args, state) =>  {
       homey.app.log('[is_connected]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`is_connected`) === true;
    });

    const is_home = homey.flow.getConditionCard('is_home')
    is_home.registerRunListener( async (args, state) =>  {
       homey.app.log('[is_home]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`is_home`) === true;
    });

    const is_moving = homey.flow.getConditionCard('is_moving')
    is_moving.registerRunListener( async (args, state) =>  {
       homey.app.log('[is_moving]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`is_moving`) === true;
    });

    const is_plug_connected = homey.flow.getConditionCard('is_plug_connected')
    is_plug_connected.registerRunListener( async (args, state) =>  {
       homey.app.log('[is_plug_connected]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`is_plug_connected`) === true;
    });

    const is_charging = homey.flow.getConditionCard('is_charging')
    is_charging.registerRunListener( async (args, state) =>  {
       homey.app.log('[is_charging]', state, {...args, device: 'LOG'});
       return await args.device.getCapabilityValue(`is_charging`) === true;
    });
};
