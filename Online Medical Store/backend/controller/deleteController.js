const Delete = require("../models/deleteModel");

// All method are accessible to admin only.

module.exports.createDocument = async (doc, collection_name) => {
    try {
        await Delete.create(new Delete({
            collection_name: collection_name,
            document: doc
        }));
    } catch (err) {
        throw err;
    }
}
