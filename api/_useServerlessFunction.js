const _useReqHandler = require("./_useReqHandler");

module.exports = _useServerlessFunction = async (req, res, serverlessFunction, values) => {
  try {
    const errors = await _useReqHandler(req, res, values);

    return errors || await serverlessFunction(req, res, values);
  } catch (error) {
    return await res.status(500).send({
      message: `[INTERNAL_SERVER_ERROR]: ${error}`
    })
  }
}