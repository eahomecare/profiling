module.exports = function (doc) {
  // Remove keywords with the category 'unknown'
  if (doc.category === 'unknown') {
    return false;
  }

  // Only transfer keywords that do not have any questionIDs associated with them
  if (
    doc.questionIDs &&
    doc.questionIDs.length > 0
  ) {
    return false;
  }

  // Specify the destination index in Elasticsearch
  doc._meta_monstache = {
    index: 'keywords',
  };

  return doc;
};
