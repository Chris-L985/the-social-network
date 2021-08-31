const router = require('express').Router();
const apiRoutes = require('./api');

router.use("/api", apiRoutes);

router.use((req, res) => {
    res.status(404).send("<h2>404 Error! No page exists.</h2>");
});

module.exports = router;