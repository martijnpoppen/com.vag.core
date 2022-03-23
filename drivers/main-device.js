const Homey = require('homey');
const dottie = require('dottie');
const VwWeconnect = require('../lib/@iobroker/iobroker.vw-connect');
const { sleep, decrypt, encrypt, calcCrow, get } = require('../lib/helpers');
const capability_map = require('../constants/capability_map');

module.exports = class mainDevice extends Homey.Device {
    async onInit() {
        try {
            this.homey.app.log('[Device] - init =>', this.getName());
            this.setUnavailable(`Starting... - ${this.getName()}`);

            await this.initStore();
            await this.checkCapabilities();
            await this.setVwWeConnectClient();
            await this.setCapabilityListeners();

            await this.setAvailable();
        } catch (error) {
            this.homey.app.log(`[Device] ${this.getName()} - OnInit Error`, error);
        }
    }

    // ------------- Settings -------------
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.homey.app.log(`[Device] ${this.getName()} - oldSettings`, { ...oldSettings, username: 'LOG', password: 'LOG', pin: 'LOG', vin: 'LOG' });
        this.homey.app.log(`[Device] ${this.getName()} - newSettings`, { ...newSettings, username: 'LOG', password: 'LOG', pin: 'LOG', vin: 'LOG' });

        if (changedKeys.length) {
            if (this.onPollInterval) {
                this.clearIntervals();
            }

            if (newSettings.password !== oldSettings.password) {
                await this.setVwWeConnectClient({ ...newSettings, password: encrypt(newSettings.password) });
            } else {
                await this.setVwWeConnectClient(newSettings);
            }

            await this.checkCapabilities(newSettings);

            if (newSettings.password !== oldSettings.password) {
                this.savePassword(newSettings, 2000);
            }
        }
    }

    async savePassword(settings, delay = 0) {
        this.homey.app.log(`[Device] ${this.getName()} - savePassword - encrypted`);

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

            this.homey.app.log(`[Device] - ${this.getName()} => setVwWeConnectClient Got config`, { ...this.config, username: 'LOG', password: 'LOG', pin: 'LOG', vin: 'LOG' });

            this._weConnectClient = await VwWeconnect({
                username: this.config.username,
                password: this.config.password,
                type: this.config.type,
                pin: this.config.pin,
                interval: this.config.update_interval
            });

            await this._weConnectClient.onReady();
            await sleep(6000);
            await this._weConnectClient.onUnload(() => {});
            await sleep(1000);

            await this.setCapabilityValues(true);
            await this.setAvailable();
            await this.setIntervalsAndFlows(settings);
        } catch (error) {
            this.homey.app.log(`[Device] ${this.getName()} - setVwWeConnectClient - error =>`, error);
        }
    }

    // ------------- CapabilityListeners -------------
    async setCapabilityListeners() {
        await this.registerMultipleCapabilityListener(['locked', 'remote_flash', 'remote_flash_honk', "remote_battey_charge", "remote_climatisation", "remote_climatisation_v2", "remote_climatisation_v3", "remote_ventilation", "remote_ventilation_v2", "remote_ventilation_v3", "remote_window_heating",], this.onCapability_ACTION.bind(this));
    }

    async onCapability_ACTION(value) {
        try {
            this.homey.app.log(`[Device] ${this.getName()} - onCapability_ACTION`, value);

            const settings = this.getSettings();
            const vin = settings.vin;
            const pin = settings.pin;

            if (pin.length) {
                if ('locked' in value) {
                    const val = value.locked;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.lock`, { val });
                }

                if ('remote_flash' in value) {
                    const val = value.remote_flash;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.flash`, { val });
                }

                if ('remote_flash_honk' in value) {
                    const val = value.remote_flash_honk;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.honk`, { val });
                }

                if ('remote_battery_charge' in value) {
                    const val = value.remote_battery_charge;

                    if(type === 'id') {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.charging`, { val });    
                    } else {
                        await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.batteryCharge`, { val });
                    }
                }

                if ('remote_climatisation' in value) {
                    const val = value.remote_climatisation;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisation`, { val });
                }

                if ('remote_climatisation_v2' in value) {
                    const val = value.remote_climatisation_v2;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisationv2`, { val });
                }

                if ('remote_climatisation_v3' in value) {
                    const val = value.remote_climatisation_v3;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.climatisationv3`, { val });
                }

                if ('remote_ventilation' in value) {
                    const val = value.remote_ventilation;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.ventilation`, { val });
                }

                if ('remote_ventilation_v2' in value) {
                    const val = value.remote_ventilation_v2;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.ventilationv2`, { val });
                }

                if ('remote_ventilation_v3' in value) {
                    const val = value.remote_ventilation_v3;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.ventilationv3`, { val });
                }

                if ('remote_window_heating' in value) {
                    const val = value.remote_window_heating;
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.windowheating`, { val });
                }
            } else {
                throw new Error('S-PIN missing');
            }

            return Promise.resolve(true);
        } catch (e) {
            this.homey.app.error(e);
            return Promise.reject(e);
        }
    }

    async setCapabilityValues(check = false) {
        this.homey.app.log(`[Device] ${this.getName()} - setCapabilityValues`);

        try {
            const settings = this.getSettings();
            const vin = settings.vin;
            const type = settings.type;
            const forceUpdate = this.getStoreValue("forceUpdate")

            if (check || forceUpdate >= 360) {
                this.homey.app.log(`[Device] ${this.getName()} - setCapabilityValues - forceUpdate`);

                await this._weConnectClient.requestStatusUpdate(vin).catch(() => {
                    this.homey.app.log("force status update Failed", `${this.driver.id}-${type}`);
                });
                await sleep(5000);
                await this._weConnectClient.updateStatus();
                await sleep(10000);

                this.setStoreValue("forceUpdate", 0).catch(this.homey.app.error);
            } else { 
                this.homey.app.log(`[Device] ${this.getName()} - setCapabilityValues - updateStatus`);

                await this._weConnectClient.updateStatus();
                await sleep(10000);

                this.setStoreValue("forceUpdate", forceUpdate + settings.update_interval).catch(this.homey.app.error);
            }

            const deviceInfo = this._weConnectClient.getState();
            const deviceInfoTransformed = dottie.transform(deviceInfo);
            const vinData = deviceInfoTransformed[vin];
            const capabilityMapData = `${this.driver.id}-${type}` in capability_map ? capability_map[`${this.driver.id}-${type}`] : capability_map[`${this.driver.id}`];

            this.homey.app.log(`[Device] ${this.getName()} - setCapabilityValues - capabilityMapData`, `${this.driver.id}-${type}`, capabilityMapData);

            if (vinData && vinData.status) {
                for (const [key, value] of Object.entries(capabilityMapData)) {
                    const status = get(vinData, value, null);

                    this.homey.app.log(`[Device] ${this.getName()} - getValue => ${key} => `, status);

                    if(key.includes('measure_is_home')) {
                        const lat = get(vinData, value.latitude, 0);
                        const lng = get(vinData, value.longitude, 0);

                        this.homey.app.log(`[Device] ${this.getName()} - getPos => ${key} => `, lat, lng);

                        await this.setLocation(lat, lng);    
                    }else if((status || status !== null) && typeof status == 'number') {
                        if(key.includes('measure_temperature') && status > 2000) {
                            await this.setValue(key, Math.round(status - 2731.5) / 10.0);
                        } else {
                            await this.setValue(key, status);
                        }
                    } else if(status || status !== null) {
                        await this.setValue(key, status);
                    }
                }
            }
        } catch (error) {
            this.homey.app.error(error);
        }
    }

    async setLocation(lat, lng) {
        try {
            const HomeyLat = this.homey.geolocation.getLatitude();
            const HomeyLng = this.homey.geolocation.getLongitude();
            const setLocation = calcCrow(HomeyLat, HomeyLng, parseFloat(lat / 1000000), parseFloat(lng / 1000000));

            await this.setValue('measure_is_home', setLocation <= 1);
        } catch (error) {
            this.homey.app.log(error);
        }
    }

    async setValue(key, value) {
        this.homey.app.log(`[Device] ${this.getName()} - setValue => ${key} => `, value);
        await this.setCapabilityValue(key, value);
    }

    // ------------- Intervals -------------
    async setIntervalsAndFlows(settings) {
        try {
            if (this.getAvailable()) {
                await this.setCapabilityValuesInterval(settings.update_interval);
            }
        } catch (error) {
            this.homey.app.log(`[Device] ${this.getName()} - OnInit Error`, error);
        }
    }

    async setCapabilityValuesInterval(update_interval) {
        try {
            const REFRESH_INTERVAL = 60000 * update_interval;

            this.homey.app.log(`[Device] ${this.getName()} - onPollInterval =>`, REFRESH_INTERVAL, update_interval);
            this.onPollInterval = setInterval(this.setCapabilityValues.bind(this), REFRESH_INTERVAL);
        } catch (error) {
            this.setUnavailable(error);
            this.homey.app.log(error);
        }
    }

    async clearIntervals() {
        this.homey.app.log(`[Device] ${this.getName()} - clearIntervals`);
        await clearInterval(this.onPollInterval);
    }

    // ------------- Capabilities -------------
    async checkCapabilities(overrideSettings = null) {
        const settings = overrideSettings ? overrideSettings : this.getSettings();
        const driverCapabilities = this.driver.manifest.capabilities;
        const deviceCapabilities = this.getCapabilities();
        const capabilityMapData = `${this.driver.id}-${settings.type}` in capability_map ? capability_map[`${this.driver.id}-${settings.type}`] : capability_map[`${this.driver.id}`];
        let settingsCapabilities = Object.keys(settings).filter((s) => s.startsWith('remote_') || s.startsWith('measure_'));
        settingsCapabilities = settingsCapabilities.filter((c) => (settings[c] ? true : false));
        const combinedCapabilities = [...new Set([...driverCapabilities, ...Object.keys(capabilityMapData), ...settingsCapabilities])];

        this.homey.app.log(`[Device] ${this.getName()} - Device capabilities =>`, deviceCapabilities);
        this.homey.app.log(`[Device] ${this.getName()} - Combined capabilities =>`, combinedCapabilities);

        if (combinedCapabilities.length  !== deviceCapabilities.length) {
            await this.updateCapabilities(combinedCapabilities, deviceCapabilities);
        }


        if(this.getClass('other') || this.getClass('lock')) {
            await this.setClass('sensor');
        }

        return deviceCapabilities;
    }

    async updateCapabilities(combinedCapabilities, deviceCapabilities) {
        try {
            const newC = combinedCapabilities.filter(d => !deviceCapabilities.includes(d));
            const oldC = deviceCapabilities.filter(d => !combinedCapabilities.includes(d));

            this.homey.app.log(`[Device] ${this.getName()} - Remove old capabilities =>`, oldC);
            this.homey.app.log(`[Device] ${this.getName()} - Add new capabilities =>`, newC);

            oldC.forEach((c) => {
                this.removeCapability(c);
            });
            await sleep(2000);
            newC.forEach((c) => {
                this.addCapability(c);
            });
            await sleep(2000);
        } catch (error) {
            this.homey.app.log(error);
        }
    }

    async initStore() {
        const forceUpdate = this.getStoreValue("forceUpdate");
        if(!forceUpdate) {
            this.setStoreValue("forceUpdate", 0).catch(this.homey.app.error);
        }
    }

    onDeleted() {
        this.clearIntervals();
    }
};
