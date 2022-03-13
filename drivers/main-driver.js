const Homey = require('homey');
const VwWeconnect = require('../lib/@iobroker/iobroker.vw-connect');
const dottie = require('dottie');
const { sleep, encrypt } = require('../lib/helpers');

module.exports = class mainDriver extends Homey.Driver {
    onInit() {
        this.homey.app.log('[Driver] - init', this.id);
        this.homey.app.log(`[Driver] - version`, Homey.manifest.version);
    }

    async onPair(session) {
        session.setHandler('setType', async (data) => {
            this.config = {
                type: data.type
            };

            this.homey.app.log(`[Driver] ${this.id} - got config`, {...this.config, username: 'LOG', password: 'LOG'});

            return session.nextView();
        });

        session.setHandler("login", async (data) => {
            try {
                this.config.username = data.username,
                this.config.password = data.password,
 
                this.homey.app.log(`[Driver] ${this.id} - got config`, this.config);

                this._weConnectClient = await VwWeconnect({username: this.config.username, password: this.config.password, type: this.config.type});
    
                this._weConnectClient.sendEvent('ready');

                return session.nextView();
            } catch (error) {
                console.log('err', error);
                throw new Error(this.homey.__('pair.error'));
            }
        });

        session.setHandler('showView', async (view) => {
            if (view === 'loading') {
                await sleep(3000);
    
                return session.nextView();
            }

            if (view === 'get_data') {
                this.weConnectData = await waitForResults(this);

                if(!this.weConnectData) {
                    return session.showView("login_credentials");
                }

                this.weConnectDataTransformed = dottie.transform(this.weConnectData);
                this.homey.app.log(`[Driver] ${this.id} - weConnectData: `, this.weConnectDataTransformed);
    
                return session.nextView();
            }
        });

        session.setHandler("list_devices", async () => {
            try {
                const results = [];
                const vinArray = Object.keys(this.weConnectData).filter(k => k.includes('.general.vin'));

                this.homey.app.log(`[Driver] ${this.id} - vinArray: `, vinArray);

                for (const vinStr of vinArray) {
                    const vin = vinStr ? vinStr.split('.')[0] : null;

                    this.homey.app.log(`[Driver] ${this.id} - vin: `, vin);

                    results.push({
                        name: `${this.weConnectDataTransformed[vin].general.brand} - ${this.weConnectDataTransformed[vin].general.carportData.modelName}`,
                        data: {
                            id: vin,
                        },
                        settings: {
                            ...this.config,
                            username: this.config.username,
                            password: encrypt(this.config.password),
                            vin: vin
                        }
                    });
                };


                this.homey.app.log(`[Driver] ${this.id} - Found devices - `, results);

                return results;
            } catch (error) {
                console.log(error);
                throw new Error(this.homey.__('pair.error'));
            }
        });

        session.setHandler("pincode", async (pincode) => {
            this.homey.app.log(`[Driver] ${this.id} - pincode - `, pincode);
            this.config.pin = pincode.join('');

            return true
        });

        async function waitForResults(ctx, retry = 10) {
            for (let i = 0; i < retry; i++) {    
                await sleep(500);
                const weConnectData = ctx._weConnectClient.getState();

                ctx.homey.app.log(`[Driver] ${ctx.id} - ctx._weConnectClient.getState() - try: ${i}`);
                ctx.homey.app.log(`[Driver] ${ctx.id} - info.connection - `, weConnectData['info.connection']);

                if(i > 5 && weConnectData['info.connection']) {
                    return Promise.resolve(weConnectData);
                } else if(retry === 9) {
                    return Promise.resolve(false)
                }
            }

            return Promise.resolve(false)
        }
    }
}