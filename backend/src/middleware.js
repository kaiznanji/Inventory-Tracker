
const { isArray, findDuplicates, isNumeric } = require('./helper');
const { TAGS } = require('./constants');

module.exports = {
    validateParams(req, res, next) {
        let { name, tags, purchaseCost, quantity }  = req.body;

        // check name and validate it 
        if (name && typeof name != "string") {
            return res.status(400).send("Please enter a valid inventory item name!");
        }

        // validate purchase cost
        if (!isNumeric(purchaseCost)) {
            return res.status(400).send("Please enter a valid purchase cost!");
        }

        // validate quantity
        if (!isNumeric(quantity)) {
            return res.status(400).send("Please enter a valid quantity!");
        }

        // validate tags
        // change tags object
        let newtags = [];
        for (const tag in tags) {
            if (tags[tag]) {
                newtags.push(tag);
            }
        }
        if (newtags) {
            if (!isArray(newtags)) {
                return res.status(400).send("Please enter valid tag param!");
            }
            
            for (const tag in newtags) {
                if (!TAGS.includes(newtags[tag])) {
                    return res.status(400).end("Please enter a valid tag param!");
                }
            }

            // check if duplicate tags are passed
            if (findDuplicates(newtags).length != 0) {
                return res.status(400).send("Please enter unique tag values!");
            }
        }
        // set objects to locals for access in api function
        res.locals.name = name;
        res.locals.tags = newtags;
        res.locals.purchaseCost = purchaseCost;
        res.locals.quantity = quantity;

        return next();
    }
}