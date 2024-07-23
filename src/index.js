const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const dotenv = require('dotenv')

const Portainer = require('./portainer')

;(async () => {
    try {
        // console.log('github.context:', github.context)
        const { owner, repo } = github.context.repo

        const token = core.getInput('token', { required: true })
        // console.log('token:', token)
        const url = core.getInput('url', { required: true })
        console.log('url:', url)
        const name = core.getInput('name', { required: true })
        console.log('name:', name)
        const composeFile = core.getInput('file', { required: true })
        console.log('composeFile:', composeFile)
        let endpointID = core.getInput('endpoint')
        console.log('endpointID:', endpointID)
        const repositoryReferenceName =
            core.getInput('ref') || github.context.ref
        console.log('repositoryReferenceName:', repositoryReferenceName)
        const repositoryURL =
            core.getInput('repo') || `https://github.com/${owner}/${repo}`
        console.log('repositoryURL:', repositoryURL)
        const tlsskipVerify = core.getBooleanInput('tlsskip')
        console.log('tlsskipVerify:', tlsskipVerify)
        const prune = core.getBooleanInput('prune')
        console.log('prune:', prune)
        const pullImage = core.getBooleanInput('pull')
        console.log('pullImage:', pullImage)
        const type = core.getInput('type')
        console.log('type:', type)
        if (!['repo', 'file'].includes(type)) {
            core.setFailed(`Unknown type: ${type}. Must be repo or file.`)
        }
        const env_json = core.getInput('env_json')
        // console.log('env_json:', env_json)
        const env_file = core.getInput('env_file')
        // console.log('env_file:', env_file)
        const env = getEnv(env_json, env_file)
        // console.log('env:', env)
        let repositoryUsername = core.getInput('username')
        // console.log('repositoryUsername:', repositoryUsername)
        let repositoryPassword = core.getInput('password')
        // console.log('repositoryPassword:', repositoryPassword)
        const repositoryAuthentication = !!(
            repositoryUsername || repositoryPassword
        )
        console.log('repositoryAuthentication:', repositoryAuthentication)

        const portainer = new Portainer(url, token)

        if (!endpointID) {
            const endpoints = await portainer.getEndpoints()
            // console.log('endpoints:', endpoints)
            endpointID = endpoints[0]?.Id
            console.log('endpointID:', endpointID)
            if (!endpointID) {
                return core.setFailed('No Endpoints Found!')
            }
        }

        const swarm = await portainer.getSwarm(endpointID)
        // console.log('swarm:', swarm)
        const swarmID = swarm.ID
        console.log('swarmID:', swarmID)

        const stacks = await portainer.getStacks()
        // console.log('stacks:', stacks)
        let stack = stacks.find((item) => item.Name === name)
        // console.log('stack:', stack)
        const stackID = stack?.Id
        console.log('stackID:', stackID)

        if (type === 'repo') {
            core.info('Performing Repository Deployment.')
            if (stackID) {
                core.info(`Stack Found - Updating Stack ID: ${stackID}`)
                const body = {
                    env,
                    prune,
                    pullImage,
                    repositoryReferenceName,
                    repositoryAuthentication,
                    repositoryPassword,
                    repositoryUsername,
                }
                // console.log('body:', body)
                const stack = await portainer.updateStackRepo(
                    stackID,
                    endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`Updated Stack: ${stack.Name}`)
            } else {
                core.info('Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name,
                    swarmID,
                    repositoryURL,
                    composeFile,
                    env,
                    tlsskipVerify,
                    repositoryReferenceName,
                    repositoryAuthentication,
                    repositoryPassword,
                    repositoryUsername,
                }
                // console.log('body:', body)
                const stack = await portainer.createStackRepo(endpointID, body)
                // console.log('stack:', stack)
                core.info(`Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        } else if (type === 'file') {
            core.info('Performing Stack File Deployment.')
            const stackFileContent = fs.readFileSync(composeFile, 'utf-8')
            if (stackID) {
                core.info(`Stack Found - Updating Stack ID: ${stackID}`)
                const body = {
                    env,
                    prune,
                    pullImage,
                    stackFileContent,
                }
                // console.log('body:', body)
                const stack = await portainer.updateStackString(
                    stackID,
                    endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`Updated Stack: ${stack.Name}`)
            } else {
                core.info('Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name,
                    swarmID,
                    stackFileContent,
                    env,
                }
                // console.log('body:', body)
                const stack = await portainer.createStackString(
                    endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        }

        core.info(`\u001b[32;1mFinished Success`)
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
