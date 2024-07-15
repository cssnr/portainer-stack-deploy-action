const core = require('@actions/core')
const github = require('@actions/github')
const Portainer = require('./portainer')

;(async () => {
    try {
        // console.log('github.context:', github.context)
        console.log('github.context.ref:', github.context.ref)
        const { owner, repo } = github.context.repo
        const repositoryURL = `https://github.com/${owner}/${repo}`
        console.log('repositoryURL:', repositoryURL)

        const url = core.getInput('url', { required: true })
        // console.log('url:', url)
        const token = core.getInput('token', { required: true })
        // console.log('token:', token)
        let endpointID = core.getInput('endpoint')
        console.log('endpointID:', endpointID)
        const name = core.getInput('name', { required: true })
        console.log('name:', name)
        const composeFile = core.getInput('file', { required: true })
        console.log('composeFile:', composeFile)

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

        if (stackID) {
            console.log(`Stack Found - Updating Stack ID: ${stackID}`)

            const stack = await portainer.updateStack(stackID, endpointID, {
                prune: true,
                pullImage: true,
                repositoryReferenceName: github.context.ref,
                repositoryAuthentication: false,
                // repositoryPassword: 'string',
                // repositoryUsername: 'string',
            })
            // console.log('stack:', stack)
            console.log(`Updated Stack ${stack.Name}`)
        } else {
            console.log('Stack NOT Found - Deploying NEW Stack')

            const stack = await portainer.createStack(endpointID, {
                name,
                swarmID,
                repositoryURL,
                composeFile,
                tlsskipVerify: false,
                repositoryReferenceName: github.context.ref,
                repositoryAuthentication: false,
                // repositoryUsername: 'myGitUsername',
                // repositoryPassword: 'myGitPassword',
            })
            // console.log('stack:', stack)
            console.log(`Deployed Stack ${stack.Name}`)
        }

        core.info('Success.')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()
