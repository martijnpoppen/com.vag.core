const Homey = require('homey');
const flowActions = require('./lib/flows/actions');
const flowConditions = require('./lib/flows/conditions');
const VwWeconnect = require('./lib/@iobroker/iobroker.vw-connect');
const { sleep } = require('./lib/helpers');
const dottie = require('dottie');

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

            this.log('[apiHelperTool] - getting data...');
            await connect.onReady();
            await sleep(5000);
            await connect.onUnload(() => {});

            if (!connect) {
                return 'Nothing found, please check your credentials and try again';
            }

            this.log('[apiHelperTool] - got VIN...', connect.vinArray, connect.vinArray.length);

            if (connect.vinArray.length === 0) {
                return 'No VIN found, please check your credentials and try again';
            }

            await sleep(8000);
            await connect.onUnload(() => {});

            this.log('[apiHelperTool] - getting Status...');
            const weConnectData = connect.getState();

            if (!weConnectData) {
                return 'Could not get data, please check your credentials and try again';
            }

            const deviceInfoTransformed = dottie.transform(weConnectData);

            return deviceInfoTransformed;
        } catch (error) {
            return 'Something went wrong, this might be due to multiple reasons. You can send a report to the app developer to check the status of the API helper tool.';
        }
    }
}

module.exports = App;
