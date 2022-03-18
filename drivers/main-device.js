const Homey = require('homey');
const VwWeconnect = require('../lib/@iobroker/iobroker.vw-connect');
const dottie = require('dottie');
const { sleep, decrypt, encrypt, calcCrow } = require('../lib/helpers');
const status_types = require('../constants/status_types');

module.exports = class mainDevice extends Homey.Device {
    async onInit() {
        try {
            this.homey.app.log('[Device] - init =>', this.getName());
            this.setUnavailable(`Initializing ${this.getName()}`);

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

            await this._weConnectClient.login();
            await sleep(1000);
            await this._weConnectClient.onUnload(() => {});
            await this._weConnectClient.getVehicles();
            await this._weConnectClient.getHomeRegion(this.config.vin);
            await this._weConnectClient.getVehicleData(this.config.vin);
            await this._weConnectClient.getVehicleRights(this.config.vin);
            await this._weConnectClient.setState("info.connection", true, true);

            await this.setCapabilityValues(true);
            await this.setAvailable();
            await this.setIntervalsAndFlows(settings);
        } catch (error) {
            this.homey.app.log(`[Device] ${this.getName()} - setVwWeConnectClient - error =>`, error);
        }
    }

    // ------------- CapabilityListeners -------------
    async setCapabilityListeners() {
        await this.registerMultipleCapabilityListener(['locked'], this.onCapability_ACTION.bind(this));
        await this.registerMultipleCapabilityListener(['remote_flash', 'remote_flash_honk'], this.onCapability_ACTION.bind(this));
        if (this.hasCapability('remote_battey_charge')) await this.registerCapabilityListener('remote_battey_charge', this.onCapability_ACTION.bind(this));
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
                    await this._weConnectClient.onStateChange(`vw-connect.0.${vin}.remote.batteryCharge`, { val });
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
            const forceUpdate = this.getStoreValue("forceUpdate")

            if (check || forceUpdate >= 360) {
                this.homey.app.log(`[Device] ${this.getName()} - setCapabilityValues - forceUpdate`);

                await this._weConnectClient.requestStatusUpdate(vin).catch(() => {
                    this.homey.app.log("force status update Failed");
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

            if (vinData && vinData.status) {
                const { status, general, position } = vinData;
                const { isCarLocked, outsideTemperature } = status;
                const { isConnect } = general;
                const { isMoving, carCoordinate } = position;
                const inspectionDays = status[`data_${status_types.MAINTENANCE}`][`field_${status_types.INTERVAL_TIME_TO_INSPECTION}`] || { value: 0 };
                const inspectionDistance = status[`data_${status_types.MAINTENANCE}`][`field_${status_types.INTERVAL_DISTANCE_TO_INSPECTION}`] || { value: 0 };
                const oilChangeDays = status[`data_${status_types.MAINTENANCE}`][`field_${status_types.INTERVAL_TIME_TO_OIL_CHANGE}`] || { value: 0 };
                const oilChangeDistance = status[`data_${status_types.MAINTENANCE}`][`field_${status_types.INTERVAL_DISTANCE_TO_OIL_CHANGE}`] || { value: 0 };
                const distanceDriven = status[`data_${status_types.KILOMETER_STATUS}`][`field_${status_types.KILOMETER_STATUS}`] || { value: 0 };
                const oilLevel = status[`data_${status_types.OIL_LEVEL_PERCENTAGE}`][`field_${status_types.OIL_LEVEL_PERCENTAGE}`] || { value: 0 };

                let fuelLevel = { value: 0 };
                let batteryLevel = { value: 0 };
                let rangeDistance = { value: 0 };

                if (status[`data_${status_types.LEVELS}`]) {
                    fuelLevel = status[`data_${status_types.LEVELS}`][`field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}`] || fuelLevel;
                    batteryLevel = status[`data_${status_types.LEVELS}`][`field_${status_types.STATE_OF_CHARGE}`] || batteryLevel;
                    rangeDistance = status[`data_${status_types.LEVELS}`][`field_${status_types.TOTAL_RANGE}`] || rangeDistance;
                } else if (status[`data_${status_types.LEVELS2}`]) {
                    fuelLevel = status[`data_${status_types.LEVELS2}`][`field_${status_types.FUEL_LEVEL_IN_PERCENTAGE}`] || fuelLevel;
                    batteryLevel = status[`data_${status_types.LEVELS2}`][`field_${status_types.STATE_OF_CHARGE}`] || batteryLevel;
                    rangeDistance = status[`data_${status_types.LEVELS2}`][`field_${status_types.TOTAL_RANGE}`] || rangeDistance;
                }

                // this.homey.app.log(`[Device] ${this.getName()} - values => status =>`, status);
                // this.homey.app.log(`[Device] ${this.getName()} - values => general =>`, general);

                // ------------ Get values --------------
                await this.setCapabilityValue('locked', isCarLocked);
                await this.setCapabilityValue('measure_connected', isConnect);
                await this.setCapabilityValue('measure_temperature', outsideTemperature);
                await this.setCapabilityValue('measure_is_moving', isMoving);
                await this.setLocation(carCoordinate);
                await this.setCapabilityValue('measure_distance_driven', distanceDriven && distanceDriven.value);
                await this.setCapabilityValue('measure_inspection_distance', Math.abs(inspectionDistance && inspectionDistance.value));
                await this.setCapabilityValue('measure_inspection_days', Math.abs(inspectionDays && inspectionDays.value));
                await this.setCapabilityValue('measure_range', Math.abs(rangeDistance && rangeDistance.value));

                if (this.hasCapability('measure_fuel_level')) {
                    await this.setCapabilityValue('measure_oil_level', Math.abs(oilLevel && oilLevel.value));
                    await this.setCapabilityValue('measure_fuel_level', Math.abs(fuelLevel && fuelLevel.value));
                    await this.setCapabilityValue('measure_oil_change_distance', Math.abs(oilChangeDistance && oilChangeDistance.value));
                    await this.setCapabilityValue('measure_oil_change_days', Math.abs(oilChangeDays && oilChangeDays.value));
                }

                if (this.hasCapability('measure_battery')) {
                    await this.setCapabilityValue('measure_battery', Math.abs(batteryLevel && batteryLevel.value));
                }
            }
        } catch (error) {
            this.homey.app.error(error);
        }
    }

    async setLocation(position) {
        try {
            const HomeyLat = this.homey.geolocation.getLatitude();
            const HomeyLng = this.homey.geolocation.getLongitude();
            const setLocation = calcCrow(HomeyLat, HomeyLng, parseFloat(position.latitude / 1000000), parseFloat(position.longitude / 1000000));

            await this.setCapabilityValue('measure_is_home', setLocation <= 1);
        } catch (error) {
            this.homey.app.log(error);
        }
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
        const driverManifest = this.driver.manifest;
        const driverCapabilities = driverManifest.capabilities;
        const deviceCapabilities = this.getCapabilities();
        const eligibleCapabilities = Object.keys(this.homey.manifest.capabilities);
        let settingsCapabilities = Object.keys(settings).filter((s) => s.startsWith('remote_') || s.startsWith('measure_'));

        settingsCapabilities = settingsCapabilities.filter((c) => (eligibleCapabilities.includes(c) && settings[c] ? true : false));

        this.homey.app.log(`[Device] ${this.getName()} - Device capabilities =>`, deviceCapabilities);
        this.homey.app.log(`[Device] ${this.getName()} - Settings capabilities =>`, settingsCapabilities);
        this.homey.app.log(`[Device] ${this.getName()} - Eligible capabilities =>`, eligibleCapabilities);
        this.homey.app.log(`[Device] ${this.getName()} - Driver capabilities =>`, driverCapabilities);

        if (deviceCapabilities.length - settingsCapabilities.length !== driverCapabilities.length) {
            await this.updateCapabilities(driverCapabilities, deviceCapabilities, settingsCapabilities);
        }

        return deviceCapabilities;
    }

    async updateCapabilities(driverCapabilities, deviceCapabilities, settingsCapabilities) {
        this.homey.app.log(`[Device] ${this.getName()} - Add new capabilities =>`, [...driverCapabilities, ...settingsCapabilities]);
        try {
            deviceCapabilities.forEach((c) => {
                this.removeCapability(c);
            });
            await sleep(2000);
            driverCapabilities.forEach((c) => {
                this.addCapability(c);
            });
            await sleep(2000);
            settingsCapabilities.forEach((c) => {
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
