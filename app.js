const Homey = require('homey');
const flowActions = require('./lib/flows/actions');
const flowConditions = require('./lib/flows/conditions');
const VwWeconnect = require('./lib/@iobroker/iobroker.vw-connect');
const { sleep } = require('./lib/helpers');
const dottie = require('dottie');

const _settingsKey = `${Homey.manifest.id}.settings`;

class App extends Homey.App {
    log() {
        console.log.bind(this, '[log]').apply(this, arguments);
    }

    error() {
        console.error.bind(this, '[error]').apply(this, arguments);
    }

    // -------------------- INIT ----------------------

    async onInit() {
        this.log(`${this.homey.manifest.id} - ${this.homey.manifest.version} started...`);

        await flowActions.init(this.homey);
        await flowConditions.init(this.homey);

        this.homey.settings.getKeys().forEach((key) => {
            if (key == _settingsKey) {
                this.settingsInitialized = true;
            }
        });

        await this.initSettings();
        await this.sendNotifications();
    }

    async initSettings() {
        try {
            if (this.settingsInitialized) {
                this.log('initSettings - Found settings key', _settingsKey);
                this.appSettings = this.homey.settings.get(_settingsKey);

                if (!('NOTIFICATIONS' in this.appSettings)) {
                    await this.updateSettings({
                        ...this.appSettings,
                        NOTIFICATIONS: []
                    });
                }

                return true;
            }

            this.log(`initSettings - Initializing ${_settingsKey} with defaults`);

            await this.updateSettings({
                NOTIFICATIONS: []
            });

            return true;
        } catch (err) {
            this.error(err);
        }
    }

    updateSettings(settings) {
        this.log('updateSettings - New settings:', { ...settings });

        this.appSettings = settings;

        this.log('Saved settings.');
        this.homey.settings.set(_settingsKey, this.appSettings);
    }

    async sendNotifications() {
        try {
            const ntfy20250303 = `[${this.homey.manifest.name.en}] Message from Developer:\n\nThis app is removed from the Homey App Store. It will remain available for existing users but will no longer receive updates / support.  \n\nFor more info see: https://tinyurl.com/homey-vag  \n\nThank you for your understanding`;

            if (!this.appSettings.NOTIFICATIONS.includes('ntfy20250303')) {
                await this.homey.notifications.createNotification({
                    excerpt: ntfy20250303
                });

              
                await this.updateSettings({
                    ...this.appSettings,
                    NOTIFICATIONS: [...this.appSettings.NOTIFICATIONS, 'ntfy20250303']
                });
            }
        } catch (error) {
            this.log('sendNotifications - error', console.error());
        }
    }

    dummyLog() {}

    async apiHelperTool(username, password, type) {
        try {
            const connect = await VwWeconnect({
                username,
                password,
                type,
                log: this.dummyLog,
                error: this.error,
                debug: this.dummyLog
            });

            await connect.onReady();
            await sleep(6000);

            if (!connect) {
                return 'Nothing found, please check your credentials and try again';
            }

            this.log('[apiHelperTool] - getting Status...');
            this.log('[apiHelperTool] - got VIN...', connect.vinArray, connect.vinArray.length);

            if (connect.vinArray.length === 0) {
                return 'No VIN found, please check your credentials and try again';
            }

            const weConnectData = connect.getState();

            if (!weConnectData) {
                return 'Could not get data, please check your credentials and try again';
            }

            this.getWeConnectData(connect, weConnectData)
            return true;
            
        } catch (error) {
            return 'Something went wrong, this might be due to multiple reasons. You can send a report to the app developer to check the status of the API helper tool.';
        }
    }

    async getWeConnectData(connect, weConnectData) {
        try {
            this.log('[getWeConnectData] - getting Data...');
            await sleep(4000);
            const deviceInfoTransformed = dottie.transform(weConnectData);
            console.log(deviceInfoTransformed);
    
            await this.homey.api.realtime("apiHelpertool", deviceInfoTransformed);
            
            await sleep(5000);
            connect.onUnload(() => {});
        } catch (error) {
            await this.homey.api.realtime("apiHelpertool", 'Something went wrong, this might be due to multiple reasons. You can send a report to the app developer to check the status of the API helper tool.');
        }
       
    }
}

module.exports = App;
