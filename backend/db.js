const Pool = require('pg').Pool
const os = require('os');

const  {username } = os.userInfo();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SHEMS-database',
    password: 'anish1017',
    port: 5432,
});

const getConnection = () => {
    return new Promise(function (resolve, reject){
        pool.connect((error, client, release) => {
            if (error){
                reject(error);
            }
            resolve(client);
        });
    });
};


module.exports = { getConnection, pool }; 