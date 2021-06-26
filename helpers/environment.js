// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging'
}

// production environment
environments.production = {
    port: 5000,
    envName: 'production'
}

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment
const environmentTOExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.production;


// export module
module.exports = environmentTOExport;