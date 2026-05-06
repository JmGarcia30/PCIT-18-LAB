const logger = (req, res, nexdt) => {
    console.log(`${req.method} ${req.originalUrl}`);
    nexdt();
};

module.exports = logger;