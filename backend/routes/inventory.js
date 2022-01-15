const express = require('express');
const router = express.Router();

const { find, exists, update, deleteItem, InventoryItem } = require('../src/db');
const { validateParams } = require('../src/middleware');
const { isNumeric } = require('../src/helper');
const { VALID_KEYS, VALID_SORT_KEYS, TAGS } = require('../src/constants');


// TODO: delete(just for testing)
router.delete('/deleteDatabase', async (req, res) => {
    await InventoryItem.deleteMany({},  () => {
      console.log('collection removed')
    })
    return res.status(200).send()
})


// API Route Task: View a list of all current inventory items and sort or filter by query
router.get('/', async (req, res) => {
    // initialize variables
    let { sort, desc, tags, regexName, minPrice, maxPrice, minQuantity, maxQuantity } = req.query;
    let query = {};
    let items;
    
    if (tags) {
        // validate tags
        if (typeof tags == "string" && TAGS.includes(tags)) {
            query["tags"] = { $in: [tags] };
        } else if (typeof tags == "object") {
            let tagQuery = []
            for (const tag in tags) {
                if (!TAGS.includes(tags[tag])) {
                    return res.status(400).end("Please enter a valid tag param!");
                }
                tagQuery.push(tags[tag])
            } 
            query["tags"] = { $all: tagQuery } ;
        } else {
            return res.status(400).end("Please enter a valid tag param!");
        }
        
    } 
    if (minPrice || maxPrice) {
        // Add a default value if one is not passed
        if (minPrice == null) {
            minPrice = 0
        }
        if (maxPrice == null) {
            maxPrice = Number.MAX_SAFE_INTEGER
        }

        // validate minPrice and maxPrice are numbers
        if (!isNumeric(minPrice) || !isNumeric(maxPrice)) {
            return res.status(400).send("Please enter a valid inventory minPrice or maxPrice!");
        }
        query["purchaseCost"] =  { $gt: parseInt(minPrice)-1, $lt : parseInt(maxPrice)+1 };
    } 
    if (minQuantity || maxQuantity) {
        // Add a default value if one is not passed
        if (minQuantity == null) {
            minQuantity = 0
        }
        if (maxQuantity == null) {
            maxQuantity = Number.MAX_SAFE_INTEGER
        }

        // validate minQuantity or maxQuantity are numbers
        if (!isNumeric(minQuantity) || !isNumeric(maxQuantity)) {
            return res.status(400).send("Please enter a valid inventory minQuantity or maxQuantity!");
        }
        query["quantity"] =  { $gt: parseInt(minQuantity)-1, $lt : parseInt(maxQuantity)+1 };
    } 
    if (regexName) {
        // validate regexName is a string
        if (typeof regexName != "string") {
            return res.status(400).send("Please enter a valid inventory item regex name!");
        }
        query["name"] =  { $regex: regexName };
    } 

    // Add sort to query
    if (sort) {
        // validate sort key
        if (VALID_SORT_KEYS.includes(sort)) {
            let descVar = 1;
            if (desc != null) {
                descVar = -1;
            }
            items = await InventoryItem.find(query).sort({[sort]: descVar});
        } else {
            return res.status(400).end("Please enter a valid sort key!");
        }
    } else {
        items = await InventoryItem.find(query);
    }
    
    if (items == null) {
        return res.status(500).send();
    }
    else {
        return res.json(items);
    }
})

// API Route Task: Create an inventory item
router.post('/create', validateParams, async (req, res) => {
    const { name, tags, purchaseCost, quantity }  = res.locals;

    // check name is passed 
    if (name == null) {
        return res.status(400).send("Please pass an inventory item name!");
    }

    // check if name already exists
    if (await exists({name: name})) {
        return res.status(400).send("Item name already exists!");
    }

    let inventoryItem = new InventoryItem({
        name: name,
        tags: tags,
        quantity: quantity,
        purchaseCost: purchaseCost
    });
    try {
        await inventoryItem.save();
        return res.status(200).send('Created invetory item!');
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
})


// API Route Task: Edit an inventory item
router.post('/edit', validateParams, async (req, res) => {
    const { id, name, tags, purchaseCost, quantity }  = res.locals;

    // check if name already exists
    if (await exists({_id: { $ne: id }, name: name })) {
        return res.status(400).send("Item name already exists!");
    }

    // check if id exists before updating
    if (! await exists({_id: id})) {
        return res.status(400).send("Item doesn't exist!");
    }

    const values = [name, quantity, purchaseCost, tags];
    const obj = {};

    for (let i = 0; i < VALID_KEYS.length; ++i) {
        if (values[i] != null) {
            obj[VALID_KEYS[i]] = values[i];
        }
        
    }

    await update({ _id: id }, { $set: obj });
    return res.status(200).send('Updated invetory item!');
})


// API Route Task: Delete an inventory item
router.delete('/delete', async (req, res) => {
    // check if id exists before updating
    if (! await exists({_id: res.locals.id})) {
        return res.status(400).send("Item doesn't exist!");
    }

    try {
        await deleteItem({_id: res.locals.id})
    } 
    catch (error) {
        return res.status(400).send(error)
    }
    
    return res.status(200).send("Deleted Inventory Item")
})

module.exports = router;