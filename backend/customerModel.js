const { pool } = require('./db.js');

const getCustomer  = async (custID) => {
    try{
        return await new Promise(function (resolve, reject) {
            pool.query("Select * from customer where custID = $1",
            [custID], (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.row);
                }
                else{
                    reject (new Error("No records found"));
                }
            });
        });
    } catch (error_1){
        console.error(error_1);
        throw new Error("Internal server error");
    }
};

const getCustomerById = async (custID) => {
    try{
        return await new Promise(function (resolve, reject) {
            pool.query("Select * from customer where custID = $1",
            [custID], (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.rows[0]);
                }
                else{
                    reject (new Error("No records found"));
                }
            });
        });
    } catch (error_1){
        console.error(error_1);
        throw new Error("Internal server error");
    }

}


// create a new customer
const createCustomer = (client, body) => {
    return new Promise(function (resolve, reject){
        const {custID, cfname, clname, passcode} = body;
        client.query(
            "INSERT INTO customer (custID, cfname, clname, passcode) VALUES ($1, $2, $3, $4) RETURNING *",
            [custID, cfname, clname, passcode],
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(
                        results.rows[0]
                    );
                }
                else{
                    reject(new Error("No results found"));
                }
            }
        );
    });
};

// delete a customer
const deleteCustomer = (custID) => {
    return new Promise(function (resolve, reject){
        pool.query(
            "DELETE FROM customer WHERE custID = $1",
            [custID],
            (error, results) => {
                if (error){
                    reject(error);
                }
                resolve(`Customer deleted with ID: ${custID}`);
            }
        );
    });
};



// Update a customer record
const updateCustomer = (custID, body) => {
    return new Promise(function (resolve, reject){
        const {custID, cfname, clname} = body;
        pool.query(
            "UPDATE customer SET cfname=$1, clname=$2 where id = $3 RETURNING *",
            [cfname, clname, custID],
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(`Customer updated: ${JSON.stringify(results.rows[0])}`);
                }
                else{
                    reject(new Error("No results found"));
                }
            }
        );
    });
};

// registerAddress
const registerAddress = (client, body) => {
    return new Promise(function (resolve, reject){
        const {street, unitno, city, state, zipcode} = body;
        client.query(
            "INSERT INTO Address (street, unitno, city, state, zipcode) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [street, unitno, city, state, zipcode],
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.rows[0])
                }
                else{
                    reject(new Error("No results found"));
                }
            }
        );
    });
};


const registerCustomerAddress = (client, custID, addressID, isBilling) => {
    return new Promise(function (resolve, reject){
        client.query(
            "INSERT INTO CustomerAddress (custID, addressID, isBilling) VALUES ($1, $2, $3) RETURNING *",
            [custID, addressID, isBilling],
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.rows[0])
                }
                else{
                    reject(new Error("No results found"));
                }
            }
        );
    });

}

// in the above function we can create an option to check which webpage is calling the function and execute accordingly.

const getServiceLocByCustomerId = async (custID) => {
    try{
        return await new Promise(function (resolve, reject){
            pool.query("Select * from Address a join ServiceLocation SLoc on SLoc.addressID = a.addressID where SLoc.addressID in (select CA.addressID from CustomerAddress CA join ServiceLocation SL on SL.addressID = CA.addressID where CA.custID = $1)",
            [custID],(error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.rows);
                }
                else{
                    reject (new Error("No records found"));
                }
            });
        });
    } catch (error_1){
        console.error(error_1);
        throw new Error("Internal server error");
    }
}

const getDevicesList = async () =>{
    try{
        return await new Promise(function (resolve, reject){
            pool.query("select * from Devices",
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    console.log(results.rows)
                    resolve(results.rows);
                }
                else{
                    reject(new Error("No records found"));
                }
            });
        });
    } catch (error_1){
        console.error(error_1);
        throw new Error("Internal server error");
    }
}

// const 

// service location registration
const registerServiceLoc = (client, addressID, body) => {
    const {moveInDate, squareFoot, numbed, numOccupants} = body;
    return new Promise(function (resolve, reject){
        pool.query(
            "INSERT INTO ServiceLocation (addressID, moveInDate, squareFoot, numbed, numOccupants) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [addressID, moveInDate, squareFoot, numbed, numOccupants],
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.rows[0]);
                }
                else{
                    reject(new Error("No results found"));
                }
            }
        );
    });
};

const getTotalEnergyPerLocation = (custID, body) => {
    const { month, year } = body;

    console.log(month, year, custID)
    return new Promise(function (resolve, reject){
        pool.query("select SL.serviceID, A.street,SUM(DE.value) AS total_energy from DeviceEvents DE join DeviceRegister DR on DE.deviceRegID =  DR.deviceRegID join ServiceLocation SL on SL.serviceID = DR.serviceID join CustomerAddress CA on CA.addressID = SL.addressID join Address A on A.addressid = SL.addressid where EXTRACT(MONTH FROM DE.timestamp) = $1 AND EXTRACT(YEAR FROM DE.timestamp) = $2 AND DE.eventLabel = 'Energy Consumed'and custID = $3 group by SL.serviceID, A.street",
        [Number(month), Number(year), custID],
        (error, results) => {
            if (error){
                reject(error);
            }
            if (results && results.rows){
                resolve(results.rows);
            }
            else{
                reject(new Error("No results found"));
            }
        });     
    });
}

const getTotalPricePerLocation = (custID, body) => {
    const {month, year} = body;
    return new Promise(function(resolve, reject){
        pool.query("select SL.serviceID, A.street, SUM(DE.value * PT.price) AS total_energy_cost from DeviceEvents DE join DeviceRegister DR on DE.deviceRegID = DR.deviceRegID join ServiceLocation SL on SL.serviceID = DR.serviceID join CustomerAddress CA on CA.addressID = SL.addressID join Address A on A.addressID = CA.addressID join PriceTable PT on PT.zipcode = A.zipcode and PT.time = (select max(time) from PriceTable where zipcode = A.zipcode and time < DE.timestamp::TIME) where EXTRACT(MONTH FROM DE.timestamp) = $1 AND EXTRACT(YEAR FROM DE.timestamp) = $2 AND DE.eventLabel = 'Energy Consumed' and custID = $3 group by SL.serviceID, A.street",
        [month, year, custID],
        (error, results) => {
            if (error){
                reject(error);
            }
            if (results && results.rows){
                resolve(results.rows);
            }
            else{
                reject(new Error("No results found."));
            }
        });

    });
}


const getTotalEnergyPerDevice = (custID, body) => {
    const {month, year } = body;
    return new Promise(function (resolve, reject){
        pool.query("SELECT DR.deviceRegID, EXTRACT(HOUR FROM DE.timestamp) as time , SUM(DE.value) AS total_energy FROM DeviceEvents DE join DeviceRegister DR on DE.deviceRegID =  DR.deviceRegID join ServiceLocation SL on SL.serviceID = DR.serviceID join CustomerAddress CA on CA.addressID = SL.addressID WHERE EXTRACT(MONTH FROM DE.timestamp) = $1 AND EXTRACT(YEAR FROM DE.timestamp) = $2 and CA.custID = $3 GROUP BY DR.deviceRegID, EXTRACT(HOUR FROM DE.timestamp)",
        [month, year, custID],
        (error, results) => {
            if (error){
                reject(error);
            }
            if (results && results.rows){
                resolve(results.rows);
            }
            else{
                reject(new Error("No results found"));
            }
        });     
    });
}

const getTotalPricePerDevice = (custID, body) => {
    const {month, year} = body;
    return new Promise(function(resolve, reject){
        pool.query("select DR.deviceRegID, EXTRACT(HOUR FROM DE.timestamp) as time , SUM(DE.value*PT.price) AS total_price FROM DeviceEvents DE join DeviceRegister DR on DE.deviceRegID = DR.deviceRegID join ServiceLocation SL on SL.serviceID = DR.serviceID join CustomerAddress CA on CA.addressID = SL.addressID join Address A on A.addressID = CA.addressID join PriceTable PT on PT.zipcode = A.zipcode and PT.time = (select max(time) from PriceTable where zipcode = A.zipcode and time < DE.timestamp::TIME) where EXTRACT(MONTH FROM DE.timestamp) = $1 AND EXTRACT(YEAR FROM DE.timestamp) = $2 AND DE.eventLabel = 'Energy Consumed' AND custID = $3 group by DR.deviceRegID, EXTRACT(HOUR FROM DE.timestamp)",
        [month, year, custID],
        (error, results) => {
            if (error){
                reject(error);
            }
            if (results && results.rows){
                resolve(results.rows);
            }
            else{
                reject(new Error("No results found."));
            }
        });

    });
}

const createDeviceRegister = (deviceID, serviceID) => {
    return new Promise(function (resolve, reject){
        pool.query(
            "INSERT INTO DeviceRegister (deviceID, serviceID) VALUES ($1, $2) RETURNING *",
            [deviceID, serviceID],
            (error, results) => {
                if (error){
                    reject(error);
                }
                if (results && results.rows){
                    resolve(results.rows[0])
                }
                else{
                    reject(new Error("No results found"));
                }
            }
        );
    });
}

const deleteServiceLocation = (serviceID) => {
    return new Promise(function (resolve, reject){
        pool.query(
            "DELETE FROM ServiceLocation WHERE serviceID = $1",
            [serviceID],
            (error, results) => {
                if (error){
                    reject(error);
                }
                resolve(serviceID);
            }
        );
    });
}





module.exports = {
    getCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    getCustomerById,
    registerAddress,
    registerCustomerAddress,
    registerServiceLoc,
    getServiceLocByCustomerId,
    getDevicesList,
    getTotalEnergyPerLocation,
    getTotalPricePerLocation,
    getTotalEnergyPerDevice,
    getTotalPricePerDevice,
    createDeviceRegister,
    deleteServiceLocation
};