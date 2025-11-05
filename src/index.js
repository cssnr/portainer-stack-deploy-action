const core = require('@actions/core')
const fs = require('node:fs')
const dotenv = require('dotenv')
const yaml = require('js-yaml')

const Portainer = require('./portainer')

;(async () => {
    try {
        core.info('🏳️ Portainer Stack Deploy Action')

        // Parse Inputs
        const inputs = getInputs()
        core.startGroup('Parsed Inputs')
        console.log('inputs:', inputs)
        core.endGroup() // Inputs

        if (!['repo', 'file'].includes(inputs.type)) {
            core.setFailed(`Unknown type: ${inputs.type}. Values: [repo, file]`)
            return
        }

        // Check Portainer
        const headers = parseData(inputs.headers)
        // console.log('headers:', headers)
        const portainer = new Portainer(inputs.url, inputs.token, headers)
        const version = await portainer.getVersion()
        const versionString = `${version.ServerVersion} ${version.VersionSupport} ${version.ServerEdition}`
        core.startGroup(`Portainer Version: \u001b[34m${versionString}`)
        delete version.Runtime
        console.log(version)
        core.endGroup() // Portainer Version

        if (inputs.fs_path) {
            if (version.ServerEdition !== 'EE') {
                core.setFailed('Relative path only supported in Portainer EE!')
                return
            }
        }

        // Set Variables
        let endpointID = Number.parseInt(inputs.endpoint)
        if (!endpointID) {
            const endpoints = await portainer.getEndpoints()
            // console.log('endpoints:', endpoints)
            endpointID = endpoints[0]?.Id
            if (!endpointID) {
                return core.setFailed('No Endpoints Found!')
            }
        }
        core.info(`endpointID: \u001b[36m${endpointID}`)

        let swarmID = null
        if (!inputs.standalone) {
            const swarm = await portainer.getSwarm(endpointID)
            // console.log('swarm:', swarm)
            swarmID = swarm.ID
        }
        core.info(`swarmID: \u001b[36m${swarmID}`)

        // Get Stack
        const stacks = await portainer.getStacks()
        // console.log('stacks:', stacks)
        let stack = stacks.find(
            (item) => item.Name === inputs.name && item.EndpointId === endpointID
        )
        // console.log('stack:', stack)
        let stackID = stack?.Id
        core.info(`stackID: \u001b[36m${stackID}`)

        // Update Environment
        const env = getEnv(inputs, stack)

        // Perform Deploy
        if (inputs.type === 'repo') {
            core.info('🌐 Performing Repository Deployment')
            const repositoryAuthentication = !!(inputs.username || inputs.password)
            if (stackID) {
                core.info(`Stack Found - Updating Stack ID: ${stack.Id}`)
                const body = {
                    env,
                    prune: inputs.prune,
                    pullImage: inputs.pull,
                    repositoryReferenceName: inputs.ref,
                    repositoryAuthentication,
                    repositoryPassword: inputs.password,
                    repositoryUsername: inputs.username,
                }
                // console.log('body:', body)
                stack = await portainer.updateStackRepo(stackID, endpointID, body)
                // console.log('stack:', stack)
                core.info(`Updated Stack ${stack.Id}: ${stack.Name}`)
            } else {
                core.info('Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name: inputs.name,
                    swarmID,
                    repositoryURL: inputs.repo,
                    composeFile: inputs.file,
                    env,
                    tlsskipVerify: inputs.tlsskip,
                    repositoryReferenceName: inputs.ref,
                    repositoryAuthentication,
                    repositoryPassword: inputs.password,
                    repositoryUsername: inputs.username,
                    ...(inputs.fs_path && {
                        supportRelativePath: true,
                        fileSystemPath: inputs.fs_path,
                    }),
                }
                // console.log('body:', body)
                stack = await portainer.createStackRepo(endpointID, body)
                // console.log('stack:', stack)
                core.info(`Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        } else if (inputs.type === 'file') {
            core.info('📄 Performing Stack File Deployment')
            const stackFileContent = fs.readFileSync(inputs.file, 'utf-8')
            if (stackID) {
                core.info(`Stack Found - Updating Stack ID: ${stackID}`)
                const body = {
                    env,
                    prune: inputs.prune,
                    pullImage: inputs.pull,
                    stackFileContent,
                }
                // console.log('body:', body)
                stack = await portainer.updateStackString(stackID, endpointID, body)
                // console.log('stack:', stack)
                core.info(`Updated Stack ${stack.Id}: ${stack.Name}`)
            } else {
                core.info('Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name: inputs.name,
                    swarmID,
                    stackFileContent,
                    env,
                }
                // console.log('body:', body)
                stack = await portainer.createStackString(endpointID, body)
                // console.log('stack:', stack)
                core.info(`Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        }

        // Set Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('stackID', stack.Id)
        core.setOutput('swarmID', swarmID)
        core.setOutput('endpointID', endpointID)

        // Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(inputs, stack)
            } catch (e) {
                console.log(e)
                core.error(`Error writing Job Summary ${e.message}`)
            }
        }

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        console.log('response:', e.response?.data)
        core.setFailed(e.message)
    }
})()

/**
 * @function getEnv
 * @param {Inputs} inputs
 * @param {object} stack
 * @return {Env[]}
 */
function getEnv(inputs, stack) {
    if (!inputs.env_data && !inputs.env_file) {
        return stack?.Env ? stack.Env : []
    }
    const env = {}
    if (inputs.merge_env && stack?.Env?.length) {
        console.log('🔁 Merging Environment with Current')
        const current = Object.fromEntries(
            stack.Env.map(({ name, value }) => [name, value])
        )
        Object.assign(env, current)
    }
    if (inputs.env_data) {
        const data = parseData(inputs.env_data)
        // console.log('data:', data)
        for (const [name, value] of Object.entries(data)) {
            env[name] = value
        }
    }
    if (inputs.env_file) {
        const data = dotenv.config({ path: inputs.env_file })
        for (const [name, value] of Object.entries(data.parsed)) {
            env[name] = value
        }
    }
    const results = []
    for (const [name, value] of Object.entries(env)) {
        results.push({ name, value })
    }
    return results
}

/**
 * Add Job Summary
 * @param {Inputs} inputs
 * @param {object} stack
 * @return {Promise<void>}
 */
async function addSummary(inputs, stack) {
    core.summary.addRaw(`## Portainer Stack Deploy Action\n`)
    const action = stack.UpdateDate ? '**Updated** Existing' : '**Created** New'
    core.summary.addRaw(`🎉 ${action} Stack ${stack.Id}: \`${stack.Name}\`\n\n`)

    core.summary.addRaw('<details><summary>Stack Details</summary>')
    core.summary.addTable([
        [
            { data: 'Item', header: true },
            { data: 'Value', header: true },
        ],
        [{ data: 'ID' }, { data: stack.Id }],
        [{ data: 'Name' }, { data: stack.Name }],
        [{ data: 'File' }, { data: stack.EntryPoint }],
        [{ data: 'Type' }, { data: Portainer.type[stack.Type] }],
        [{ data: 'Status' }, { data: Portainer.status[stack.Status] }],
        [
            { data: 'Created' },
            { data: new Date(stack.CreationDate * 1000).toLocaleString() },
        ],
        [
            { data: 'Updated' },
            {
                data: stack.UpdateDate
                    ? new Date(stack.UpdateDate * 1000).toLocaleString()
                    : '-',
            },
        ],
        [{ data: 'Path' }, { data: stack.ProjectPath }],
        [{ data: 'EndpointID' }, { data: stack.EndpointId }],
        [{ data: 'SwarmID' }, { data: stack.SwarmId ? stack.SwarmId : '-' }],
    ])
    core.summary.addRaw('</details>\n')

    delete inputs.token
    delete inputs.env_data
    delete inputs.headers
    // const yaml = Object.entries(inputs)
    //     .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    //     .join('\n')
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(yaml.dump(inputs), 'yaml')
    core.summary.addRaw('</details>\n')

    const docs = 'https://portainer-deploy.cssnr.com/'
    const repo = 'https://github.com/cssnr/portainer-stack-deploy-action'
    core.summary.addRaw(
        `\n\nView the [Documentation](${docs}), report [Issues](${repo}/issues) or [Request Features](${repo}/discussions/categories/feature-requests).\n\n---`
    )
    await core.summary.write()
}

/**
 * Parse Data from Input
 * @param {string} data
 * @return {object}
 */
function parseData(data) {
    core.debug(`parseData: ${typeof data}: ${data}`)
    // console.log(`parseData: ${typeof data}: ${data}`)
    if (!data) return {}
    try {
        return JSON.parse(data)
    } catch (e) {
        core.debug(`JSON.parse failed: ${e.message}`)
        // console.log(`JSON.parse failed: ${e.message}`)
    }
    try {
        return yaml.load(data)
    } catch (e) {
        core.debug(`yaml.load failed: ${e.message}`)
        // console.log(`yaml.load failed: ${e.message}`)
    }
    throw new Error(`Unable to parse data: ${data}`)
}

/**
 * Get Inputs
 * @typedef {object} Inputs
 * @property {string} token
 * @property {string} url
 * @property {string} name
 * @property {string} file
 * @property {string} endpoint
 * @property {string} ref
 * @property {string} repo
 * @property {boolean} tlsskip
 * @property {boolean} prune
 * @property {boolean} pull
 * @property {string} type
 * @property {boolean} standalone
 * @property {string} env_data
 * @property {string} env_file
 * @property {boolean} merge_env
 * @property {string} username
 * @property {string} password
 * @property {string} fs_path
 * @property {object} headers
 * @property {boolean} summary
 * @return {Inputs}
 */
function getInputs() {
    return {
        token: core.getInput('token', { required: true }),
        url: core.getInput('url', { required: true }),
        name: core.getInput('name', { required: true }),
        file: core.getInput('file', { required: true }),
        endpoint: core.getInput('endpoint'),
        ref: core.getInput('ref'),
        repo: core.getInput('repo'),
        tlsskip: core.getBooleanInput('tlsskip'),
        prune: core.getBooleanInput('prune'),
        pull: core.getBooleanInput('pull'),
        type: core.getInput('type', { required: true }),
        standalone: core.getBooleanInput('standalone'),
        env_data: core.getInput('env_data') || core.getInput('env_json'),
        env_file: core.getInput('env_file'),
        merge_env: core.getBooleanInput('merge_env'),
        username: core.getInput('username'),
        password: core.getInput('password'),
        fs_path: core.getInput('fs_path'),
        headers: core.getInput('headers'),
        summary: core.getBooleanInput('summary'),
    }
}
