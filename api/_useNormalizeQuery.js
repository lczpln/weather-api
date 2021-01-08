module.exports = _useNormalizeQuery = (query) => {
  let normalized = "";

  normalized = decodeURIComponent(query);
  normalized = normalized.toLowerCase();
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  return normalized;
}