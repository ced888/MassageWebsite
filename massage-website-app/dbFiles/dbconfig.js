
const config = {
    server: "massagecapstone-server.database.windows.net",
    port: 1433,
    user: "massagecapstone-server-admin",
    password: "CedLyn321",
    database: "massagecapstone-database",

    options: {
        enableArithAbort: true,
        trustedconnection: true,
        instancename: "",
    },
    connectionTimeout: 150000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

module.exports = config;