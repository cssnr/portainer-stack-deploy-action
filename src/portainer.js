import axios from 'axios'
import https from 'node:https'

class Portainer {
  /**
   * Portainer API - https://app.swaggerhub.com/apis/portainer/portainer-ce/
   * @param {string} url
   * @param {string} token
   * @param {object} [headers]
   */
  constructor(url, token, headers = {}) {
    url = url.replace(/\/$/, '')
    if (!url.endsWith('api')) url += '/api'

    const agent = new https.Agent({
      rejectUnauthorized: false,
    })
    // noinspection JSCheckFunctionSignatures
    this.client = axios.create({
      baseURL: url,
      headers: { 'X-API-Key': token, ...headers },
      httpsAgent: agent,
    })
  }

  static status = { 1: 'Active', 2: 'Inactive' }
  static type = { 1: 'Swarm', 2: 'Compose' }

  /**
   * Get Version
   * @typedef {object} Version - https://app.swaggerhub.com/apis/portainer/portainer-ce/#/system.versionResponse
   * @property {boolean} UpdateAvailable
   * @property {string} LatestVersion
   * @property {string} ServerVersion
   * @property {string} VersionSupport
   * @property {string} ServerEdition
   * @property {string} DatabaseVersion
   * @property {object} Build
   * @property {object} Dependencies
   * @property {object} Runtime
   * @return {Promise<Version>}
   */
  async getVersion() {
    const response = await this.client.get('/system/version')
    return response.data
  }

  /**
   * Get Endpoints
   * @return {Promise<object[]>}
   */
  async getEndpoints() {
    const response = await this.client.get('/endpoints')
    return response.data
  }

  /**
   * Get Swarm
   * @param {string|number} endpointId
   * @typedef {object} Swarm
   * @property {string} CreatedAt
   * @property {number} DataPathPort
   * @property {string[]} DefaultAddrPool
   * @property {string} ID
   * @property {object} JoinTokens
   * @property {boolean} RootRotationInProgress
   * @property {object} Spec
   * @property {number} SubnetSize
   * @property {object} TLSInfo
   * @property {string} UpdatedAt
   * @property {object} Version
   * @return {Promise<Swarm>}
   */
  async getSwarm(endpointId) {
    const response = await this.client.get(`/endpoints/${endpointId}/docker/swarm`)
    return response.data
  }

  /**
   * Get Stacks
   * @typedef {object} Stack - https://app.swaggerhub.com/apis/portainer/portainer-ce/#/portainer.Stack
   * @property {number} Id
   * @property {string} Name
   * @property {number} Type
   * @property {number} EndpointId
   * @property {string} SwarmId
   * @property {string} EntryPoint
   * @property {Env[]} Env
   * @property {object} ResourceControl
   * @property {number} Status
   * @property {string} ProjectPath
   * @property {number} CreationDate
   * @property {string} CreatedBy
   * @property {number} UpdateDate
   * @property {string} UpdatedBy
   * @property {object} AdditionalFiles
   * @property {object} AutoUpdate
   * @property {object} Option
   * @property {object} GitConfig
   * @property {boolean} FromAppTemplate
   * @property {string} Namespace
   *
   * @typedef {object} Env
   * @property {string} name
   * @property {string} value
   *
   * @return {Promise<Stack[]>}
   */
  async getStacks() {
    const response = await this.client.get('/stacks')
    return response.data
  }

  /**
   * Update Stack Repository
   * @param {string|number} stackID
   * @param {string|number} endpointId
   * @param {object} body
   * @return {Promise<Stack>}
   */
  async updateStackRepo(stackID, endpointId, body) {
    const response = await this.client.put(`/stacks/${stackID}/git/redeploy`, body, {
      params: { endpointId },
    })
    return response.data
  }

  /**
   * Create Stack Repository
   * @param {string|number} endpointId
   * @param {object} body
   * @param {string} [url]
   * @return {Promise<Stack>}
   */
  async createStackRepo(endpointId, body, url) {
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

  /**
   * Update Stack String
   * @param {string|number} stackID
   * @param {string|number} endpointId
   * @param {object} body
   * @return {Promise<Stack>}
   */
  async updateStackString(stackID, endpointId, body) {
    const response = await this.client.put(`/stacks/${stackID}`, body, {
      params: { endpointId },
    })
    return response.data
  }

  /**
   * Create Stack String
   * @param {string|number} endpointId
   * @param {object} body
   * @param {string} [url]
   * @return {Promise<Stack>}
   */
  async createStackString(endpointId, body, url) {
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

export default Portainer
