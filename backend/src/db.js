const mongoose = require('mongoose');
const { DocumentNotFoundError } = mongoose.Error;
const ObjectId = mongoose.Types.ObjectId;
mongoose.connect("mongodb://127.0.0.1:27017/inventoryStore"); // This link would typically be place in a .env file(excluded due to access permissions of recruiter)
mongoose.Promise = global.Promise;

const InventoryItem = require('../models/inventorySchema');

module.exports = {
    InventoryItem,
    ObjectId,
    
    isObjectIdValid(id) {    
        if (ObjectId.isValid(id)) {  
            if (String(new ObjectId(id)) === id) {        
                return true;      
            } else {     
                return false;     
            }    
        } 
        else { 
            return false;  
        }  
    },
    
    async exists(query) {
        const document = await InventoryItem.findOne(query);
        if (document == null) {
            return false;
        }
        return true;
    },

    async find(query) {
        const document = await InventoryItem.findOne(query)
        return document;
    },
    
    async update(query, update) {
        await InventoryItem.updateOne(query, update)
        .catch(
            (error) => {
                if (error instanceof DocumentNotFoundError) {
                    throw "Document Not Found!";
                }
    
                console.error(error);
                throw "Failed to Update!";
            }
        )
    },

    async deleteItem(query) {
        await InventoryItem.deleteOne(query)
        .catch(
            (error) => {
                if (error instanceof DocumentNotFoundError) {
                    throw "Document Not Found!";
                }
    
                console.error(error);
                throw "Failed to Delete!";
            }
        )
    }
}

// Check connection state
if (mongoose.connection.readyState == 2) {
    console.log("Database is active!")
} else if (mongoose.connection.readyState == 0) {
    console.log("Database is disconnected!")
}