const Homey = require('homey');
const VwWeconnect = require('../lib/@iobroker/iobroker.vw-connect');
const dottie = require('dottie');
const { sleep, encrypt } = require('../lib/helpers');

module.exports = class mainDriver extends Homey.Driver {
    error() {
        console.log.bind(this, `[error]`).apply(this, arguments);
        if (arguments && arguments.length) {
            this.handleErrors(arguments);
        }
    }

    onInit() {
        this.deviceError = false;

        this.homey.app.log('[Driver] - init', this.id);
        this.homey.app.log(`[Driver] - version`, Homey.manifest.version);
    }

    brand() {
        'Unknown';
    }

    dummyLog() {}

    async onPair(session) {
        session.setHandler('showView', async (view) => {
            this.homey.app.log(`[Driver] ${this.id} - currentView:`, { view, deviceError: this.deviceError });

            if(this.deviceError && (view === 'loading' || view === 'get_data')) {
                session.showView('error');
                return true;
            }

            if(this.deviceError && view === 'login_credentials') {
                this.deviceError = false;

                this.homey.app.log(`[Driver] ${this.id} - currentView:`, { view, deviceError: this.deviceError });
            }

            if (view === 'loading') {
                await sleep(3000);

                session.nextView();
                return true;
            }

            if (view === 'pincode') {
                const skip_array = ['id', 'seatcupra', 'audietron', 'skodae'];
                if (skip_array.includes(this.config.type)) {
                    session.nextView();
                }

                return true;
            }

            if (view === 'get_data') {
                this.weConnectData = await waitForResults(this);

                if (!this.weConnectData) {
                    session.showView('error');
                    return true;
                }

                this.weConnectDataTransformed = dottie.transform(this.weConnectData);
                this.homey.app.log(`[Driver] ${this.id} - weConnectData: `, this.weConnectDataTransformed);

                session.nextView();
                return true;
            }

            if (view === 'error' && this.deviceError) {
                await session.emit('deviceError', this.deviceError);
            }
        });

        session.setHandler('setType', async (data) => {
            this.config = {
                type: data.type
            };

            this.homey.app.log(`[Driver] ${this.id} - got config`, { ...this.config, username: 'LOG', password: 'LOG' });

            return true;
        });

        session.setHandler('login', async (data) => {
            try {
                this.config.username = data.username.toLowerCase();
                this.config.password = data.password;

                this.homey.app.log(`[Driver] ${this.id} - got config`, { ...this.config, username: 'LOG', password: 'LOG' });

                this._weConnectClient = await VwWeconnect({
                    username: this.config.username,
                    password: this.config.password,
                    type: this.config.type,
                    log: this.dummyLog,
                    error: this.error,
                    debug: this.dummyLog
                });

                await this._weConnectClient.onReady();
                await sleep(6000);

                return true;
            } catch (error) {
                console.log(error);
            }
        });

        session.setHandler('list_devices', async () => {
            try {
                const results = [];
                const vinArray = Object.keys(this.weConnectData).filter((k) => k.includes('.general.vin'));

                this.homey.app.log(`[Driver] ${this.id} - vinArray: `, vinArray.length);

                for (const vinStr of vinArray) {
                    const vin = vinStr ? vinStr.split('.')[0] : null;

                    this.homey.app.log(`[Driver] ${this.id} - vin: `, vin.substring(0, 5));

                    const generalData = this.weConnectDataTransformed[vin].general;
                    let model = this.deviceType();

                    if ('model' in generalData) {
                        model = generalData.model;
                    } else if ('specification' in generalData) {
                        model = generalData.specification.model;
                    } else if (generalData && generalData.carportData && generalData.carportData.modelName) {
                        model = generalData.carportData.modelName;
                    } else if (generalData && generalData.nickname) {
                        model = generalData.nickname;
                    }

                    const brand = this.brand();

                    results.push({
                        name: `${brand} - ${model}`,
                        data: {
                            id: vin
                        },
                        settings: {
                            ...this.config,
                            password: encrypt(this.config.password),
                            vin: vin
                        }
                    });
                }

                this.homey.app.log(`[Driver] ${this.id} - Found devices - `, results);

                return results;
            } catch (error) {
                console.log(error);
            }
        });

        session.setHandler('list_devices_selection', async (data) => {
            this.homey.app.log(`[Driver] ${this.id} - list_devices_selection - `, data);
            this.selectedDevice = data[0];
            return this.selectedDevice;
        });

        session.setHandler('pincode', async (pincode) => {
            this.homey.app.log(`[Driver] ${this.id} - this.selectedDevice`, this.selectedDevice);

            if (!this.selectedDevice) {
                return false;
            }

            this.homey.app.log(`[Driver] ${this.id} - pincode`);
            this.selectedDevice.settings.pin = pincode.join('');

            return true;
        });

        session.setHandler('add_device', async (data) => {
            try {
                return this.selectedDevice;
            } catch (error) {
                return Promise.reject(error);
            }
        });

        async function waitForResults(ctx, retry = 10) {
            for (let i = 0; i < retry; i++) {
                await sleep(500);
                const weConnectData = ctx._weConnectClient.getState();

                ctx.homey.app.log(`[Driver] ${ctx.id} - ctx._weConnectClient.getState() - try: ${i}`);
                ctx.homey.app.log(`[Driver] ${ctx.id} - info.connection - `, weConnectData['info.connection']);

                if (i > 5 && weConnectData['info.connection']) {
                    await ctx._weConnectClient.onUnload(() => {});
                    return Promise.resolve(weConnectData);
                } else if (retry === 9) {
                    return Promise.resolve(false);
                }
            }

            return Promise.resolve(false);
        }
    }

    handleErrors(args) {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('Login Failed') || args[0].includes('Please enter password'))) {
            if (!this.deviceError) {
                this.deviceError = this.homey.__('pair.login_failed');
            } else {
                this.log(`[Device] ${this.getName()} - Device error already exists`);
            }
        }
    }
};
