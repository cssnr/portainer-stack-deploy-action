const core = require('@actions/core')
const fs = require('fs')
const dotenv = require('dotenv')

const Portainer = require('./portainer')

;(async () => {
    try {
        core.info('🏳️ Portainer Stack Deploy Action')

        // Parse Inputs
        const inputs = parseInputs()
        core.startGroup('Parsed Inputs')
        console.log('inputs:', inputs)
        core.endGroup() // Inputs

        if (!['repo', 'file'].includes(inputs.type)) {
            core.setFailed(`Unknown type: ${inputs.type}. Values: [repo, file]`)
            return
        }

        // Check Portainer
        const portainer = new Portainer(inputs.url, inputs.token)
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
        let endpointID = parseInt(inputs.endpoint)
        if (!endpointID) {
            const endpoints = await portainer.getEndpoints()
            // console.log('endpoints:', endpoints)
            endpointID = endpoints[0]?.Id
            if (!endpointID) {
                return core.setFailed('No Endpoints Found!')
            }
        }
        core.info(`  endpointID: \u001b[36m${endpointID}`)

        let swarmID = null
        if (!inputs.standalone) {
            const swarm = await portainer.getSwarm(endpointID)
            // console.log('swarm:', swarm)
            swarmID = swarm.ID
        }
        core.info(`  swarmID: \u001b[36m${swarmID}`)

        // Get Stack
        const stacks = await portainer.getStacks()
        // console.log('stacks:', stacks)
        let stack = stacks.find((item) => item.Name === inputs.name)
        // console.log('stack:', stack)
        let stackID = stack?.Id
        core.info(`  stackID: \u001b[36m${stackID}`)

        // Update Environment
        const env = getEnv(inputs, stack)

        // Perform Deploy
        if (inputs.type === 'repo') {
            core.info('🌐 Performing Repository Deployment')
            const repositoryAuthentication = !!(
                inputs.username || inputs.password
            )
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
                stack = await portainer.updateStackRepo(
                    stackID,
                    endpointID,
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
                core.info(`   Stack Found - Updating Stack ID: ${stackID}`)
                const body = {
                    env,
                    prune: inputs.prune,
                    pullImage: inputs.pull,
                    stackFileContent,
                }
                // console.log('body:', body)
                stack = await portainer.updateStackString(
                    stackID,
                    endpointID,
                    body
                )
                // console.log('stack:', stack)
                core.info(`   Updated Stack ${stack.Id}: ${stack.Name}`)
            } else {
                core.info('   Stack NOT Found - Deploying NEW Stack')
                const body = {
                    name: inputs.name,
                    swarmID,
                    stackFileContent,
                    env,
                }
                // console.log('body:', body)
                stack = await portainer.createStackString(endpointID, body)
                // console.log('stack:', stack)
                core.info(`   Deployed Stack: ${stack.Id}: ${stack.Name}`)
            }
        }

        // Set Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('stackID', stack.Id)
        core.setOutput('swarmID', swarmID)
        core.setOutput('endpointID', endpointID)

        // Job Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            await writeSummary(inputs, stack)
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
 * @param {Object} inputs
 * @param {Object} stack
 * @return {Object[]} Portainer formatted environment
 */
function getEnv(inputs, stack) {
    if (!inputs.env_json && !inputs.env_file) {
        return stack?.env ? stack.env : []
    }
    const env = {}
    if (inputs.merge_env && stack?.Env?.length) {
        console.log('🔁 Merging Environment with Current')
        const current = Object.fromEntries(
            stack.Env.map(({ name, value }) => [name, value])
        )
        Object.assign(env, current)
    }
    if (inputs.env_json) {
        let data = JSON.parse(inputs.env_json)
        for (const [name, value] of Object.entries(data)) {
            env[name] = value
        }
    }
    if (inputs.env_file) {
        let data = dotenv.config({ path: inputs.env_file })
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
 * @function writeSummary
 * @param {Object} inputs
 * @param {Object} stack
 * @return {Promise<void>}
 */
async function writeSummary(inputs, stack) {
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

    const text = 'View Documentation, Report Issues or Request Features'
    const link = `https://github.com/cssnr/portainer-stack-deploy-action`
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * @function parseInputs
 * @return {{ token: string, url: string, name: string, file: string, endpoint: string | undefined, ref: string, repo: string, tlsskip: boolean, prune: boolean, pull: boolean, type: string, standalone: boolean, env_json: string | undefined, env_file: string | undefined, merge_env: boolean, username: string | undefined, password: string | undefined, fs_path: string | undefined, summary: boolean }}
 */
function parseInputs() {
    return {
        token: core.getInput('token', { required: true }),
        url: core.getInput('url', { required: true }),
        name: core.getInput('name', { required: true }),
        file: core.getInput('file', { required: true }),
        endpoint: core.getInput('endpoint'),
        ref: core.getInput('ref', { required: true }),
        repo: core.getInput('repo', { required: true }),
        tlsskip: core.getBooleanInput('tlsskip'),
        prune: core.getBooleanInput('prune'),
        pull: core.getBooleanInput('pull'),
        type: core.getInput('type', { required: true }),
        standalone: core.getBooleanInput('standalone'),
        env_json: core.getInput('env_json'),
        env_file: core.getInput('env_file'),
        merge_env: core.getBooleanInput('merge_env'),
        username: core.getInput('username'),
        password: core.getInput('password'),
        fs_path: core.getInput('fs_path'),
        summary: core.getBooleanInput('summary'),
    }
}
