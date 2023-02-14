const { conn } = require("../services/db");

exports.signIn = (req, res) => {
    const { email, password } = req.body;
    conn.query("SELECT * FROM `web`.`users` WHERE `email` = '" + email + "' AND `password` = '" + password + "' LIMIT 1",
    function (err, data, fields) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({
                data,
                status: "success",
                length: data?.length,
            });
        }
    });
};

exports.search = (req, res) => {
    const userType = req.query["user_type"];
    const experience = +req.query["experience"];
    const maxCost = +req.query["max_cost"];
    const dogSize = +req.query["dog_size"];

    const sql = `
            SELECT u.*, d.cost, d.experience FROM web.users u
            JOIN web.doggy_misters d ON u.id = d.user_id
            WHERE user_type = '${userType}' AND cost <= ${maxCost} AND dog_size <= ${dogSize} AND experience >= ${experience}
        `;

    conn.query(sql,
        function (err, data, fields) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({
                    data,
                    status: "success",
                    length: data?.length,
                });
            }
        }
    );
};

exports.select = (req, res, next) => {
    if (!req.params.id) {
        res.status(404).json({ error: "No id found" });
    }
    else {
        conn.query(
            "SELECT * FROM `web`.`users` WHERE `id` = '" + req.params.id + "'",
            function (err, data, fields) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({
                        data,
                        status: "success",
                        length: data?.length,
                    });
                }
            }
        );
    }
};

exports.create = (req, res) => {
    if (!req.body) {
        res.status(404).json({ error: "No form data found" });
    }
    else {
        conn.query(
            `INSERT INTO \`web\`.\`users\`(\`password\`, \`fullname\`, \`email\`, \`birthdate\`, \`gender\`, \`user_type\`, \`comments\`, \`address\`) 
            VALUES ('${req.body.password}', '${req.body.fullname}', '${req.body.email}', '${req.body.birthdate}', '${req.body.gender}', '${req.body.user_type}', '${req.body.comments}', '${req.body.address}')`,
            function (err, mysqlres) {
                if (err) {
                    res.status(500).json({ error: err.message });
                }
                else {
                    if (req.body.user_type === "doggy-sitter") {
                        conn.query(
                            `INSERT INTO \`web\`.\`doggy_misters\`(\`user_id\`, \`cost\`, \`experience\`) 
                            VALUES ('${mysqlres.insertId}', '${req.body.cost}', '${req.body.experience}')`,
                            function (err, data, fields) {
                                if (err) {
                                    res.status(500).json({
                                        error: err.message,
                                    });
                                } else {
                                    res.status(201).json({
                                        status: "success",
                                        message: "doggy sitter created!",
                                    });
                                }
                            }
                        );
                    }
                    else {
                        res.status(201).json({
                            status: "success",
                            message: "user created!",
                        });
                    }
                }
            }
        );
    }
};

exports.update = (req, res, next) => {
    if (!req.params.id) {
        res.status(404).json({ error: "No id found" });
    }
    else {
        conn.query(
            `UPDATE \`web\`.\`users\` SET \`password\`='${req.body.password}',\`fullname\`='${req.body.fullname}',\`email\`='${req.body.email}',\`birthdate\`='${req.body.birthdate}',\`gender\`='${req.body.gender}',\`user_type\`='${req.body.user_type}',\`comments\`='${req.body.comments}' WHERE \`id\`='${req.params.id}'`,
            function (err, data, fields) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json(req.body);
                }
            }
        );
    }
};

exports.delete = (req, res, next) => {
    if (!req.params.id) {
        res.status(404).json({ error: "No id found" });
    }
    else {
        conn.query(
            "DELETE FROM `web`.`users` WHERE `id`='" + req.params.id + "'",
            [req.params.id],
            function (err, fields) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({
                        status: "success",
                        message: "user deleted!",
                    });
                }
            }
        );
    }
};