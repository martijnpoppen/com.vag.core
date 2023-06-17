module.exports = {
    async apiHelperTool({ homey, body }){
        const result = await homey.app.apiHelperTool( body.username, body.password, body.type );

        return result;
    }
};