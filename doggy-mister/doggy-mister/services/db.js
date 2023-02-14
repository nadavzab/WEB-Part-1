const config = require('./db.config');
const mysql = require("mysql");

const conn = mysql.createConnection(config);

conn.connect();

initDb = () => {
    conn.query(
        `CREATE DATABASE IF NOT EXISTS web;`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log({
                    status: "success",
                    message: "database web created!",
                });
            }
        }
    );

    conn.query(
        `CREATE TABLE IF NOT EXISTS web.users (
            id INT NOT NULL AUTO_INCREMENT,
            password VARCHAR(25) NOT NULL ,
            fullname VARCHAR(25) NOT NULL ,
            email VARCHAR(25) NOT NULL ,
            birthdate VARCHAR(25) NOT NULL ,
            gender VARCHAR(10) NOT NULL ,
            address VARCHAR(50) NOT NULL ,
            user_type VARCHAR(25) NOT NULL ,
            comments VARCHAR(1000) NULL ,
            PRIMARY KEY (id)
        );`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log({
                    status: "success",
                    message: "users table created!",
                });
            }
        }
    );

    conn.query(
        `CREATE TABLE IF NOT EXISTS web.doggy_misters (
            user_id INT NOT NULL AUTO_INCREMENT,
            cost INT NOT NULL ,
            experience INT NOT NULL ,
            dog_size INT NOT NULL ,
            PRIMARY KEY (user_id)
        );`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log({
                    status: "success",
                    message: "doggy_misters table created!",
                });
            }
        }
    );

    conn.query(`SELECT COUNT(*) as count FROM web.users`, function (err, data, fields) {
        if (err) {
            throw new Error(err.message);
        } else {
            // create user for not exsits already
            results = JSON.parse(JSON.stringify(data));
            if (results[0].count === 0) {
                const sample_addresses = [
                    "Yehuda HaMaccabi Street 12, Tel Aviv-Yafo",
                    "Petachia Marghenshburg Street 15, Tel Aviv-Yafo",
                    "Arlozorov Street 23, Tel Aviv-Yafo",
                    "Sokolov Street 32, Petah Tikva",
                    "Herzl Street 13, Petah Tikva",
                    "Rokach Street 3, Ramat Gan",
                    "Rothschild Street 6, Bat Yam",
                    "Weizman Street 71, Givatayim",
                    "Rosh Pina Street 1, Herzliya",
                    "HaShalom Street 32, Ramat HaSharon",

                ];
                for (let i = 1; i <= 5; i++) {
                    // create 5 starter users
                    conn.query(
                        `INSERT INTO web.users (id, password, fullname, email, birthdate, gender, address, user_type, comments)
                        VALUES (${i}, '123456', 'user ${i}', 'user${i}@gmail.com', '1948-05-14', 'male', '${sample_addresses[i-1]}', 'Consumer', 'I like dogs!!')`,
                        function (err, data, fields) {
                            if (err) {
                                throw new Error(err.message);
                            } else {
                                console.log({
                                    status: "success",
                                    message: `user ${i} created!`,
                                });
                            }
                        }
                    );
                }
                for (let i = 6; i <= 10; i++) {
                    // create 5 starter doggy misters
                    conn.query(
                        `INSERT INTO web.users (id, password, fullname, email, birthdate, gender, address, user_type, comments)
                        VALUES (${i}, '123456', 'doggy mister ${i-5}', 'user${i}@gmail.com', '1948-05-14', 'male', '${sample_addresses[i-1]}', 'doggy-sitter', 'I like dogs!!')`,
                        function (err, data, fields) {
                            if (err) {
                                throw new Error(err.message);
                            }
                        }
                    );
                    conn.query(
                        `INSERT INTO web.doggy_misters (user_id, cost, experience, dog_size) VALUES (${i}, ${i*10}, ${i}, ${(i-5) * 5})`,
                        function (err, data, fields) {
                            if (err) {
                                throw new Error(err.message);
                            } else {
                                console.log({
                                    status: "success",
                                    message: `doggy mister ${i-5} created!`,
                                });
                            }
                        }
                    );
                }
            }
        }
    });
}

module.exports = { conn, initDb };