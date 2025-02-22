const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const dotenv = require('dotenv')

const Portainer = require('./portainer')

;(async () => {
    try {
        core.info('🏳️ Portainer Stack Deploy Action')

        // Parse Inputs
        const { owner, repo } = github.context.repo
        const inputs = parseInputs(owner, repo)
        core.startGroup('Parsed Inputs')
        console.log('inputs:', inputs)
        core.endGroup() // Inputs

        if (!['repo', 'file'].includes(inputs.type)) {
            core.setFailed(`Unknown type: ${inputs.type}. Values: [repo, file]`)
            return
        }

        // Set Variables
        const newEnv = getEnv(inputs.env_json, inputs.env_file)
        const repoAuth = !!(inputs.username || inputs.password)
        const portainer = new Portainer(inputs.url, inputs.token)

        if (inputs.fs_path) {
            // get system info and check if portainer is BE edition
            const version = await portainer.getVersion()
            // console.log('version:', version)
            const is_portainer_be = version.ServerEdition === 'EE'
            if (!is_portainer_be) {
                return core.setFailed(
                    'Relative path is only supported on Portainer Business Edition'
                )
            }
        }

        if (!inputs.endpointID) {
            const endpoints = await portainer.getEndpoints()
            // console.log('endpoints:', endpoints)
            inputs.endpointID = endpoints[0]?.Id
            core.info(`endpointID: \u001b[36m${inputs.endpointID}`)
            if (!inputs.endpointID) {
                return core.setFailed('No Endpoints Found!')
            }
        }

        let swarmID = null
        if (!inputs.standalone) {
            const swarm = await portainer.getSwarm(inputs.endpointID)
            // console.log('swarm:', swarm)
            swarmID = swarm.ID
            core.info(`swarmID: \u001b[36m${swarmID}`)
        }

        // Get Stack
        const stacks = await portainer.getStacks()
        // console.log('stacks:', stacks)
        let stack = stacks.find((item) => item.Name === inputs.name)
        // console.log('stack:', stack)
        let stackID = stack?.Id
        core.info(`stackID: \u001b[36m${stackID}`)

        // Perform Deploy
        if (inputs.type === 'repo') {
            core.info('Performing Repository Deployment.')
            if (stackID) {
                core.info(`Stack Found - Updating Stack ID: ${stack.Id}`)
                const body = {
                    env: newEnv,
                    prune: inputs.prune,
                    pullImage: inputs.pull,
                    repositoryReferenceName: inputs.ref,
                    repositoryAuthentication: repoAuth,
                    repositoryPassword: inputs.password,
                    repositoryUsername: inputs.username,
                }
                // console.log('body:', body)
                stack = await portainer.updateStackRepo(
                    stackID,
                    inputs.endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`Updated Stack ${stack.Id}: ${stack.Name}`)
            } else {
                core.info('Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name: inputs.name,
                    swarmID,
                    repositoryURL: inputs.repo,
                    composeFile: inputs.file,
                    env: newEnv,
                    tlsskipVerify: inputs.tlsskip,
                    repositoryReferenceName: inputs.ref,
                    repositoryAuthentication: repoAuth,
                    repositoryPassword: inputs.password,
                    repositoryUsername: inputs.username,
                    ...(inputs.fs_path && {
                        supportRelativePath: true,
                        fileSystemPath: inputs.fs_path,
                    }),
                }
                // console.log('body:', body)
                stack = await portainer.createStackRepo(inputs.endpointID, body)
                // console.log('stack:', stack)
                core.info(`Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        } else if (inputs.type === 'file') {
            core.info('Performing Stack File Deployment.')
            const stackFileContent = fs.readFileSync(inputs.file, 'utf-8')
            if (stackID) {
                core.info(`Stack Found - Updating Stack ID: ${stackID}`)
                const body = {
                    env: newEnv,
                    prune: inputs.prune,
                    pullImage: inputs.pull,
                    stackFileContent,
                }
                // console.log('body:', body)
                stack = await portainer.updateStackString(
                    stackID,
                    inputs.endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`Updated Stack ${stack.Id}: ${stack.Name}`)
            } else {
                core.info('Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name: inputs.name,
                    swarmID,
                    stackFileContent,
                    env: newEnv,
                }
                // console.log('body:', body)
                stack = await portainer.createStackString(
                    inputs.endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        }

        // Set Outputs
        core.setOutput('stackID', stack.Id)
        core.setOutput('swarmID', swarmID)
        core.setOutput('endpointID', inputs.endpointID)

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        console.log('response:', e.response?.data)
        core.setFailed(e.message)
    }
})()

/**
 * @function getEnv
 * @param {String} env_json
 * @param {String} env_file
 * @return {Object[]}
 */
function getEnv(env_json, env_file) {
    const env = []
    if (env_json) {
        let data = JSON.parse(env_json)
        for (const [name, value] of Object.entries(data)) {
            env.push({ name, value })
        }
    }
    if (env_file) {
        let data = dotenv.config({ path: env_file })
        for (const [name, value] of Object.entries(data.parsed)) {
            env.push({ name, value })
        }
    }
    return env
}

/**
 * @function parseInputs
 * @param {String} owner
 * @param {String} repo
 * @return {{
 *   token: string,
 *   url: string,
 *   name: string,
 *   file: string,
 *   endpoint: string | undefined,
 *   ref: string,
 *   repo: string,
 *   tlsskip: boolean,
 *   prune: boolean,
 *   pull: boolean,
 *   type: string,
 *   standalone: boolean,
 *   env_json: string | undefined,
 *   env_file: string | undefined,
 *   username: string | undefined,
 *   password: string | undefined,
 *   fs_path: string | undefined
 * }}
 */
function parseInputs(owner, repo) {
    return {
        token: core.getInput('token', { required: true }),
        url: core.getInput('url', { required: true }),
        name: core.getInput('name', { required: true }),
        file: core.getInput('file', { required: true }),
        endpoint: core.getInput('endpoint'),
        ref: core.getInput('ref') || github.context.ref,
        repo: core.getInput('repo') || `https://github.com/${owner}/${repo}`,
        tlsskip: core.getBooleanInput('tlsskip'),
        prune: core.getBooleanInput('prune'),
        pull: core.getBooleanInput('pull'),
        type: core.getInput('type'),
        standalone: core.getBooleanInput('standalone'),
        env_json: core.getInput('env_json'),
        env_file: core.getInput('env_file'),
        username: core.getInput('username'),
        password: core.getInput('password'),
        fs_path: core.getInput('fs_path'),
    }
}
