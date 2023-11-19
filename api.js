module.exports = {
    async apiHelperTool({ homey, body }) {
        return homey.app.apiHelperTool(body.username, body.password, body.type);
    }
};
