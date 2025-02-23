const axios = require('axios')
const https = require('https')

class Portainer {
    constructor(url, token) {
        url = url.replace(/\/$/, '')
        if (!url.endsWith('api')) {
            url += '/api'
        }
        const agent = new https.Agent({
            rejectUnauthorized: false,
        })
        this.client = axios.create({
            baseURL: url,
            headers: { 'X-API-Key': token },
            httpsAgent: agent,
        })
    }

    static status = { 1: 'Active', 2: 'Inactive' }
    static type = { 1: 'Swarm', 2: 'Compose' }

    async getVersion() {
        const response = await this.client.get('/system/version')
        return response.data
    }

    async getEndpoints() {
        const response = await this.client.get('/endpoints')
        return response.data
    }

    async getSwarm(endpointId) {
        const response = await this.client.get(
            `/endpoints/${endpointId}/docker/swarm`
        )
        return response.data
    }

    async getStacks() {
        const response = await this.client.get('/stacks')
        return response.data
    }

    async updateStackRepo(stackID, endpointId, body) {
        const response = await this.client.put(
            `/stacks/${stackID}/git/redeploy`,
            body,
            { params: { endpointId } }
        )
        return response.data
    }

    async createStackRepo(endpointId, body, url = '') {
        if (body.swarmID) {
            url = '/stacks/create/swarm/repository'
        } else {
            url = '/stacks/create/standalone/repository'
        }
        const response = await this.client.post(url, body, {
            params: { endpointId },
        })
        return response.data
    }

    async updateStackString(stackID, endpointId, body) {
        const response = await this.client.put(`/stacks/${stackID}`, body, {
            params: { endpointId },
        })
        return response.data
    }

    async createStackString(endpointId, body, url = '') {
        if (body.swarmID) {
            url = '/stacks/create/swarm/string'
        } else {
            url = '/stacks/create/standalone/string'
        }
        const response = await this.client.post(url, body, {
            params: { endpointId },
        })
        return response.data
    }

    // async createStackFile(endpointId, swarmID, name, file) {
    //     const form = new FormData()
    //     form.append('swarmID', swarmID)
    //     form.append('name', name)
    //     form.append('file', fs.createReadStream(file))
    //     const response = await this.client.post(
    //         '/stacks/create/swarm/file',
    //         form,
    //         {
    //             headers: {
    //                 ...form.getHeaders(),
    //                 ...this.client.defaults.headers.common,
    //             },
    //             params: { endpointId },
    //         }
    //     )
    //     return response.data
    // }
}

module.exports = Portainer
