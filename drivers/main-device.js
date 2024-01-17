const Homey = require('homey');
const dottie = require('dottie');
const VwWeconnect = require('../lib/@iobroker/iobroker.vw-connect');
const { sleep, decrypt, encrypt, calcCrow, get, getCurrentTimeStamp } = require('../lib/helpers');
const capability_map = require('../constants/capability_map');
const remote_map = require('../constants/remote_map');

module.exports = class mainDevice extends Homey.Device {
    log() {
        console.log.bind(this, `[log]`).apply(this, arguments);
    }

    debug() {
        console.log.bind(this, `[debug]`).apply(this, arguments);
    }

    error() {
        console.log.bind(this, `[error]`).apply(this, arguments);
        if (arguments && arguments.length) {
            this.handleErrors(arguments);
        }
    }

    dummyLog() {}

    // -------------------- INIT ----------------------

    async onInit() {
        try {
            this.log('[Device] - init =>', this.getName());
            this.setUnavailable(`Connecting to... - ${this.getName()}`);

            await this.initStore();
            await this.checkCapabilities();
            await this.setVwWeConnectClient();

            await this.setAvailable();
        } catch (error) {
            this.log(`[Device] ${this.getName()} - OnInit Error`, error);
        }
    }

    // ------------- Settings -------------
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.log(`[Device] ${this.getName()} - oldSettings`, { ...oldSettings, username: 'LOG', password: 'LOG', pin: 'LOG', vin: 'LOG' });
        this.log(`[Device] ${this.getName()} - newSettings`, { ...newSettings, username: 'LOG', password: 'LOG', pin: 'LOG', vin: 'LOG' });

        if (changedKeys.length) {
            if (this.onPollInterval) {
                this.clearIntervals();
            }

            await this.checkCapabilities(newSettings);

            if (newSettings.password !== oldSettings.password) {
                this.setVwWeConnectClient({ ...newSettings, password: encrypt(newSettings.password) });
            } else {
                this.setVwWeConnectClient(newSettings);
            }

            if (newSettings.password !== oldSettings.password) {
                this.savePassword(newSettings, 2000);
            }
        }
    }

    async savePassword(settings, delay = 0) {
        this.log(`[Device] ${this.getName()} - savePassword - encrypted`);

        if (delay > 0) {
            await sleep(delay);
        }

        await this.setSettings({ ...settings, password: encrypt(settings.password) });
    }

    // ------------- API -------------
    async setVwWeConnectClient(overrideSettings = null) {
        const settings = overrideSettings ? overrideSettings : this.getSettings();

        try {
            this.config = { ...settings, password: decrypt(settings.password) };

            this.log(`[Device] - ${this.getName()} => setVwWeConnectClient - isNewType`, this.isNewType(settings.type));
            this.log(`[Device] - ${this.getName()} => setVwWeConnectClient - isSkodaE`, this.isSkodaE(settings.type));
            this.log(`[Device] - ${this.getName()} => setVwWeConnectClient - isVwID`, this.isVwID(settings.type));
            this.log(`[Device] - ${this.getName()} => setVwWeConnectClient - isAudi`, this.isVwID(settings.type));
            this.log(`[Device] - ${this.getName()} => setVwWeConnectClient - isVw`, this.isVw(settings.type));

            this.log(`[Device] - ${this.getName()} => setVwWeConnectClient Got config`, { ...this.config, username: 'LOG', password: 'LOG', pin: 'LOG', vin: 'LOG' });

            if (this._weConnectClient) {
                this.log(`[Device] - ${this.getName()} => setVwWeConnectClient - removing old instance`);
                this._weConnectClient = null;
                await sleep(1000);
            }

            this._weConnectClient = await VwWeconnect({
                username: this.config.username,
                password: this.config.password,
                type: this.config.type,
                pin: this.config.pin,
                interval: this.config.update_interval,
                log: this.log,
                error: this.error,
                debug: true ? this.debug : this.dummyLog
            });

            await this._weConnectClient.onReady();
            await sleep(6000);
            await this._weConnectClient.onUnload(() => {});
            await sleep(1000);

            await this.setRestart(false);
            await this.setCapabilityValues(true);
            await this.setAvailable();
            await this.setIntervalsAndFlows(settings);
        } catch (error) {
            this.log(`[Device] ${this.getName()} - setVwWeConnectClient - error =>`, error);
        }
    }

    isNewType(type) {
        return this.isVw(type) || this.isVwID(type) || this.isAudiEtron(type) || this.isSkodaE(type) || this.isSeatCupra(type);
    }

    isSkodaE(type) {
        return type === 'skodae';
    }

    isVwID(type) {
        return type === 'id';
    }

    isVw(type) {
        return type === 'vw' || type === 'vwv2';
    }

    isAudiEtron(type) {
        return type === 'audietron' || type === 'audi';
    }

    isSeatCupra(type) {
        return type === 'seatcupra' || type === 'seatcupra2';
    }

    // ------------- CapabilityListeners -------------
    async setCapabilityListeners(capabilities) {
        const filtered = capabilities.filter((f) => f.includes('remote_') || f.includes('locked') || f.includes('target_'));
        await this.registerMultipleCapabilityListener(filtered, this.onCapability_ACTION.bind(this));
    }

    // ----------------- Actions ------------------
    async onCapability_ACTION(value) {
        try {
            this.log(`[Device] ${this.getName()} - onCapability_ACTION`, value);

            const settings = this.getSettings();
            const { type, vin, pin } = settings;

            if ('remote_force_refresh' in value) {
                this.setCapabilityValues(true);

                this.setValue('remote_force_refresh', false, 3000);
            }

            if (this.isNewType(type) || pin.length) {
                if ('locked' in value) {
                    const val = value.locked;

                    if (this.isVwID(type)) {
                        throw new Error("VW ID doesn't support lock/unlock. Only displaying the status");
                    } else if (!settings.enable_lock) {
                        throw new Error('Lock/unlock disabled in device setting. Only displaying the status');
                    } else if (this.isNewType(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.access`, { ack: false, val: val });
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.lock`, { ack: false, val: val });
                    }
                }

                if ('remote_flash' in value) {
                    const val = value.remote_flash;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.flash`, { ack: false, val: val });
                    this.setValue('remote_flash', false, 3000);
                }

                if ('remote_flash_honk' in value) {
                    const val = value.remote_flash_honk;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.honk`, { ack: false, val: val });
                    this.setValue('remote_flash_honk', false, 3000);
                }

                if ('remote_charge_min_limit' in value) {
                    const val = value.remote_charge_min_limit;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.chargeMinLimit`, { ack: false, val: val });
                }

                if ('remote_max_charge_current' in value) {
                    const val = value.remote_max_charge_current;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.maxChargeCurrent`, { ack: false, val: val });
                }

                if ('remote_battery_charge' in value) {
                    const val = value.remote_battery_charge;

                    if (this.isSkodaE(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.charging.settings.autoUnlockPlugWhenCharged`, { ack: false, val: null });
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.charging`, { ack: false, val: val });
                    } else if (this.isNewType(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.charging`, { ack: false, val: val });
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.batterycharge`, { ack: false, val: val });
                    }
                }

                if ('remote_climatisation' in value) {
                    const val = value.remote_climatisation;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisation`, { ack: false, val: val });
                }

                if ('remote_climatisation_v2' in value) {
                    const val = value.remote_climatisation_v2;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisationv2`, { ack: false, val: val });
                }

                if ('remote_climatisation_v3' in value) {
                    const val = value.remote_climatisation_v3;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisationv3`, { ack: false, val: val });
                }

                if ('remote_ventilation' in value) {
                    const val = value.remote_ventilation;

                    if (this.isSkodaE(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.air-conditioning`, { ack: false, val: val });
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.ventilation`, { ack: false, val: val });
                    }
                }

                if ('remote_ventilation_v2' in value) {
                    const val = value.remote_ventilation_v2;

                    if (this.isSkodaE(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.air-conditioning`, { ack: false, val: val });
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.ventilationv2`, { ack: false, val: val });
                    }
                }

                if ('remote_ventilation_v3' in value) {
                    const val = value.remote_ventilation_v3;

                    if (this.isSkodaE(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.air-conditioning`, { ack: false, val: val });
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.ventilationv3`, { ack: false, val: val });
                    }
                }

                if ('remote_window_heating' in value) {
                    const val = value.remote_window_heating;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.windowheating`, { ack: false, val: val });
                }

                if ('target_temperature' in value) {
                    const val = value.target_temperature;

                    if (!this.isSkodaE(type) && this.isNewType(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.status.climatisationSettings.targetTemperature_C`, { ack: false, val: val });
                    } else if (!this.isSkodaE(type)) {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.targetTemperatureInCelsius`, { ack: false, val: val });
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisationTemperature`, { ack: false, val: val });
                    }
                }

                if ('remote_set_interval' in value) {
                    const val = value.remote_set_interval;
                    await this.setSettings({ update_interval: val });

                    this.log(`[Device] ${this.getName()} - remote_set_interval - shouldRestart!`);
                    this.clearIntervals();

                    await this.setVwWeConnectClient();
                }
            } else {
                throw new Error('S-PIN missing');
            }

            return Promise.resolve(true);
        } catch (e) {
            this.error(e);
            return Promise.reject(e);
        }
    }

    // ----------------- Values ------------------
    async setCapabilityValues(check = false) {
        this.log(`[Device] ${this.getName()} - setCapabilityValues`);

        try {
            const settings = this.getSettings();
            const vin = settings.vin;
            const type = settings.type;
            const forceUpdate = this.getStoreValue('forceUpdate');
            const shouldRestart = this.getStoreValue('shouldRestart');
            const forceUpdateInterval = settings.force_update_interval ? settings.force_update_interval : 360;

            if (!check && shouldRestart) {
                this.log(`[Device] ${this.getName()} - setCapabilityValues - shouldRestart!`);
                this.clearIntervals();

                await this.setVwWeConnectClient();
            }

            if (check || forceUpdate >= forceUpdateInterval) {
                this.log(`[Device] ${this.getName()} - setCapabilityValues - forceUpdate`);

                if (!this.isNewType(type)) {
                    await sleep(5000);
                    await this._weConnectClient.requestStatusUpdate(vin).catch(() => {
                        this.log('force status update Failed', `${this.driver.id}-${type}`);
                    });
                }

                await sleep(5000);
                await this._weConnectClient.updateStatus('setCapabilityValues force');
                await sleep(10000);

                this.setStoreValue('forceUpdate', 0).catch(this.error);
            } else {
                this.log(`[Device] ${this.getName()} - setCapabilityValues - updateStatus`);

                await this._weConnectClient.updateStatus('setCapabilityValues normal');
                await sleep(10000);

                this.setStoreValue('forceUpdate', forceUpdate + settings.update_interval).catch(this.error);
            }

            // always unload vwconnectclient to prevent double intervals
            await this._weConnectClient.onUnload(() => {});

            const deviceInfo = this._weConnectClient.getState();
            const deviceInfoTransformed = dottie.transform(deviceInfo);
            const vinData = deviceInfoTransformed[vin];
            const capabilityMapData = `${this.driver.id}-${type}` in capability_map ? capability_map[`${this.driver.id}-${type}`] : capability_map[`${this.driver.id}`];

            this.log(`[Device] ${this.getName()} - setCapabilityValues - capabilityMapData`, `${this.driver.id}-${type}`, capabilityMapData);

            if (true && vinData) {
                this.debug(`[Device] ${this.getName()} - setCapabilityValues - vinData`, `${this.driver.id}-${type}`, JSON.stringify(vinData, null, 4));
            } else {
                this.debug(`[Device] ${this.getName()} - setCapabilityValues - vinData`, `${this.driver.id}-${type}`, 'Undefined');
            }

            if (vinData && vinData.status) {
                for (const [key, value] of Object.entries(capabilityMapData)) {
                    const status = get(vinData, value, null);

                    this.log(`[Device] ${this.getName()} - getValue => ${key} => `, status);

                    this.setValue('is_connected', true);

                    if (key.includes('is_home')) {
                        const lat = get(vinData, value.latitude, 0);
                        const lng = get(vinData, value.longitude, 0);

                        this.log(`[Device] ${this.getName()} - getPos => ${key} => `, lat, lng);

                        await this.setLocation(lat, lng, this.isNewType(type));
                    } else if (key.includes('lng') || key.includes('lat') || key.includes('get_location')) {
                        this.log(`[Device] ${this.getName()} - Skip => ${key}`);
                    } else if ((status || status !== null) && typeof status == 'number') {
                        if (key.includes('_temperature') && status > 2000) {
                            await this.setValue(key, Math.round((status / 10 - 273.15) * 2) / 2);
                        } else if (key.includes('_temperature') && status > 200) {
                            await this.setValue(key, Math.round((status - 273.15) * 2) / 2);
                        } else if (key.includes('_range') && status > 2000) {
                            await this.setValue(key, status / 1000);
                        } else if (key.includes('_time') && this.isSkodaE(type)) {
                            await this.setValue(key, status / 60);
                        } else if (key.includes('_remaining_climate_time') && this.hasCapability('is_climating')) {
                            await this.setValue(key, this.getCapabilityValue('is_climating') ? Math.abs(status) : 0);
                        } else if (key.includes('_inspection') && settings.measure_inspection_negative) {
                            await this.setValue(key, -Math.abs(status));
                        } else {
                            await this.setValue(key, Math.abs(status));
                        }
                    } else if (status || status !== null) {
                        if (key.includes('_plug_connected') && ['Connected', 'connected', 'Disconnected', 'disconnected'].includes(status)) {
                            await this.setValue(key, ['Connected', 'connected'].includes(status));
                        } else if (key.includes('is_climating') && ['off', 'on'].includes(status)) {
                            await this.setValue(key, ['on'].includes(status));
                        } else if (!this.isNewType(type) && key.includes('is_charging') && ['Charging', 'charging', 'off', 'Off'].includes(status)) {
                            await this.setValue(key, ['Charging', 'charging'].includes(status));
                        } else if (this.isNewType(type) && key.includes('is_charging')) {
                            await this.setValue(key, status.toLowerCase() !== 'readyforcharging' && status.toLowerCase() !== 'notreadyforcharging');
                        } else if (key.includes('locked') && ['locked', 'unlocked'].includes(status)) {
                            await this.setValue(key, status === 'locked');
                        } else {
                            await this.setValue(key, status);
                        }
                    }
                }

                await this.setEstimatedRange();
                await this.setRemoteValues(vinData);

                await this.setValue('measure_updated_at', getCurrentTimeStamp());
            } else {
                this.setValue('is_connected', false);

                this.log(`[Device] ${this.getName()} - No status found in Vindata. Connected = false`);
            }
        } catch (error) {
            this.setValue('is_connected', false);
            this.error(error);
        }
    }

    async setEstimatedRange() {
        this.log(`[Device] ${this.getName()} - setEstimatedRange`);
        if (this.hasCapability('measure_estimated_range')) {
            this.log(`[Device] ${this.getName()} - setEstimatedRange`);

            const range = this.getCapabilityValue('measure_range');
            const soc = this.getCapabilityValue('measure_battery');
            this.setValue('measure_estimated_range', range / (soc / 100));
        }
    }

    async setRemoteValues() {
        remote_map.forEach((c) => {
            if (this.hasCapability(c.default)) {
                const value = this.getCapabilityValue(c.default);
                const status = value !== c.operator;

                this.log(`[Device] ${this.getName()} - getValue => ${c.capability} => `, value, status);

                this.setValue(c.capability, status);
            }
        });
    }

    async setLocation(lat, lng, isNewType = false) {
        try {
            const settings = this.getSettings();
            const HomeyLat = this.homey.geolocation.getLatitude();
            const HomeyLng = this.homey.geolocation.getLongitude();
            const carLat = isNewType ? lat : parseFloat(lat / 1000000);
            const carLng = isNewType ? lng : parseFloat(lng / 1000000);

            const setLocation = calcCrow(HomeyLat, HomeyLng, carLat, carLng);

            await this.setValue('is_home', setLocation <= settings.is_home_radius);

            await this.setValue('measure_lat', carLat);
            await this.setValue('measure_lng', carLng);
            await this.setValue('get_location_url', `https://maps.google.com/maps?q=${carLat},${carLng}&z=17&output=embed`);
        } catch (error) {
            this.log(error);
        }
    }

    async setValue(key, value, delay = 0) {
        if (key.includes('_FALLBACK_3')) {
            key = key.replace('_FALLBACK_3', '');
            this.log(`[Device] ${this.getName()} - setValue - _FALLBACK_3 => ${key} => `, value);
        } else if (key.includes('_FALLBACK_2')) {
            key = key.replace('_FALLBACK_2', '');
            this.log(`[Device] ${this.getName()} - setValue - _FALLBACK_2 => ${key} => `, value);
        } else if (key.includes('_FALLBACK')) {
            key = key.replace('_FALLBACK', '');
            this.log(`[Device] ${this.getName()} - setValue - _FALLBACK => ${key} => `, value);
        } else {
            this.log(`[Device] ${this.getName()} - setValue => ${key} => `, value);
        }

        if (this.hasCapability(key)) {
            const oldVal = await this.getCapabilityValue(key);

            this.log(`[Device] ${this.getName()} - setValue - oldValue => ${key} => `, oldVal, value);

            if (delay) {
                await sleep(delay);
            }

            await this.setCapabilityValue(key, value);

            if (((typeof value === 'boolean' && key.startsWith('is_')) || key.includes('updated_at')) && oldVal !== value) {
                await this.homey.flow
                    .getDeviceTriggerCard(`${key}_changed`)
                    .trigger(this, { [`${key}`]: value })
                    .catch(this.error)
                    .then(this.log(`[Device] ${this.getName()} - setValue ${key}_changed - Triggered: "${key} | ${value}"`));
            }
        }
    }

    // ----------------- Errors ------------------
    handleErrors(args) {
        if (this.getAvailable()) {
            const stringArgs = this._weConnectClient && args[0] && typeof args[0] === 'string';

            if (stringArgs && args[0].includes('Refresh Token in 10min')) {
                this.log(`[Device] ${this.getName()} - handleErrors - refreshing token`);
                this._weConnectClient.refreshToken(true).catch(() => {
                    this.log('Refresh Token was not successful');
                });
                this.setValue('is_connected', false);
            }

            if (stringArgs && args[0].includes('Failed to auto accept')) {
                this.setValue('is_connected', false);
                this.setUnavailable(
                    '[Cannot get new data]: New terms and conditions are available. Please logout in the app on your mobile phone and login again. This will give you the new terms and conditions.'
                );
            }

            const errors = [
                'Restart adapter in',
                'error while getting $homeregion',
                'Failed second skoda login',
                'get skodae status Failed',
                '304 No values updated',
                'get seat status Failed',
                'get id status Failed',
                'get audi data status Failed',
                'https://api.connect.skoda-auto.cz/api/'
            ];

            if (stringArgs && errors.some((e) => args[0].includes(e))) {
                this.log(`[Device] ${this.getName()} - handleErrors Try to Restart Adapter`);

                const shouldRestart = this.getStoreValue('shouldRestart');

                if (!shouldRestart) {
                    this.log(`[Device] ${this.getName()} - Try to Restart Adapter`);
                    this.setValue('is_connected', false);
                    this.setRestart(true);
                } else {
                    this.log(`[Device] ${this.getName()} - Restart Adapter already scheduled`);
                }
            }
        }
    }

    // ------------- Intervals -------------
    async setIntervalsAndFlows(settings) {
        try {
            if (this.getAvailable()) {
                await this.setCapabilityValuesInterval(settings.update_interval);
            }
        } catch (error) {
            this.log(`[Device] ${this.getName()} - OnInit Error`, error);
        }
    }

    async setCapabilityValuesInterval(update_interval) {
        try {
            const REFRESH_INTERVAL = 60000 * update_interval;

            this.log(`[Device] ${this.getName()} - onPollInterval =>`, REFRESH_INTERVAL, update_interval);
            this.onPollInterval = setInterval(this.setCapabilityValues.bind(this), REFRESH_INTERVAL);
        } catch (error) {
            this.setUnavailable(error);
            this.log(error);
        }
    }

    async clearIntervals() {
        this.log(`[Device] ${this.getName()} - clearIntervals`);
        await clearInterval(this.onPollInterval);
    }

    // ------------- Capabilities -------------
    async checkCapabilities(overrideSettings = null) {
        const settings = overrideSettings ? overrideSettings : this.getSettings();
        const driverCapabilities = this.driver.manifest.capabilities;
        const deviceCapabilities = this.getCapabilities();
        const capabilityMapData = `${this.driver.id}-${settings.type}` in capability_map ? capability_map[`${this.driver.id}-${settings.type}`] : capability_map[`${this.driver.id}`];
        let settingsCapabilities = Object.keys(settings).filter((s) => s.startsWith('remote_'));
        settingsCapabilities = settingsCapabilities.filter((c) => (settings[c] ? true : false));
        const combinedCapabilities = [...new Set([...driverCapabilities, ...Object.keys(capabilityMapData), ...settingsCapabilities])];

        this.log(`[Device] ${this.getName()} - Device capabilities =>`, deviceCapabilities);
        this.log(`[Device] ${this.getName()} - Combined capabilities =>`, combinedCapabilities);

        await this.updateCapabilities(combinedCapabilities, deviceCapabilities);

        await this.setCapabilityListeners(combinedCapabilities);

        return combinedCapabilities;
    }

    async updateCapabilities(combinedCapabilities, deviceCapabilities) {
        try {
            const newC = combinedCapabilities.filter((d) => !deviceCapabilities.includes(d) && !d.includes('_FALLBACK') && !d.includes('_FALLBACK_2') && !d.includes('_FALLBACK_3'));
            const oldC = deviceCapabilities.filter((d) => !combinedCapabilities.includes(d) && !d.includes('_FALLBACK') && !d.includes('_FALLBACK_2') && !d.includes('_FALLBACK_3'));

            this.log(`[Device] ${this.getName()} - Got old capabilities =>`, oldC);
            this.log(`[Device] ${this.getName()} - Got new capabilities =>`, newC);

            oldC.forEach((c) => {
                this.log(`[Device] ${this.getName()} - updateCapabilities => Remove `, c);
                this.removeCapability(c);
            });
            await sleep(2000);
            newC.forEach((c) => {
                this.log(`[Device] ${this.getName()} - updateCapabilities => Add `, c);
                this.addCapability(c);
            });
            await sleep(2000);
        } catch (error) {
            this.log(error);
        }
    }

    async initStore() {
        const forceUpdate = this.getStoreValue('forceUpdate');
        if (!forceUpdate) {
            this.setStoreValue('forceUpdate', 0).catch(this.error);
        }

        // Disable force interval - fallback to default
        await this.setSettings({ force_update_interval: 360 });

        this.setRestart(false);
    }

    async setRestart(val) {
        this.log(`[Device] ${this.getName()} - setRestart`, val);
        this.setStoreValue('shouldRestart', val).catch(this.error);
    }

    onDeleted() {
        this.clearIntervals();
    }
};
