const coreDevice = require('../lib/homey/core-device');
const dottie = require('dottie');
const { sleep, get } = require('../lib/helpers');
const capability_map = require('../constants/capability_map');

module.exports = class mainDevice extends coreDevice {
    async setCapabilityValues(check = false) {
        this.homey.app.log(`[Device] ${this.getName()} - setCapabilityValues`);

        try {
            const settings = this.getSettings();
            const vin = settings.vin;
            const type = settings.type;
            const forceUpdate = this.getStoreValue("forceUpdate")

            if (forceUpdate >= 360) {
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

                    if(key === 'measure_is_home') {
                        const lng = get(vinData, value.latitude, 0);
                        const lat = get(vinData, value.longitude, 0);

                        await this.setLocation(lat, lng);    
                    } else if((status || status !== null) && typeof status == 'number') {
                        if(key.includes('measure_temperature') && status > 2000) {
                            await this.setValue(key, Math.round(status - 2731.5) / 10.0);
                        } else {
                            await this.setValue(key, Math.abs(status));
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
};
