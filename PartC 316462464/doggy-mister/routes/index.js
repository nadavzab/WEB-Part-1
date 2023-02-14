const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router
    .route("/api/auth")
    .post(controllers.signIn);

router
    .route("/api/users")
    .get(controllers.search)
    .post(controllers.create);

router
    .route("/api/users/:id")
    .get(controllers.select)
    .put(controllers.update)
    .delete(controllers.delete);

module.exports = router;