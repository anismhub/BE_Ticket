const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Hadnling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        error: true,
        status: errStatus,
        message: errMsg
    })
}

module.exports = ErrorHandler