module.exports = reqHandler = async (req, res, values) => {
  let errors = [];

  const errorMessage = (value, type) => ({ message: `[REQUIRED_IN_${type}]: Property '${value}' cannot be null.` });

  if (values) {

    if (values.body) {
      errors = [
        ...errors,
        ...values.body.map(
          (value) => !req.body || (req.body && !req.body[value])
            ? errorMessage(value, "BODY")
            : false)
      ];
    }

    if (values.query) {
      errors = [
        ...errors,
        ...values.query.map(
          (value) => !req.query || (req.query && !req.query[value])
            ? errorMessage(value, "QUERY")
            : false)
      ];
    }

  }

  errors = errors.filter((value) => value !== false);

  if (errors.length) {
    return res.status(400).send(errors);
  } else return false;
}