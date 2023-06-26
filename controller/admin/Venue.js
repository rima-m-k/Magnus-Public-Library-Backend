const LIBRARYDATA = require("../../model/libraryDataSchema");
const mongoose = require('mongoose')

async function addVenue(req, res) {

    try {
        console.log(req.body)
        if (req.body.name && req.body.capacity) {
            const newVenue =await  LIBRARYDATA.updateOne({},{
                $push:{
                    venue:{
                        name:req.body.name,
                        capacity:req.body.capacity
                    }
                }
            })
            console.log(newVenue)
        }
    } catch (error) {
        console.log(error);
        console.log("Internal server error");
        res.status(500).send({ message: "Internal server error" });

    }

}
module.exports = { addVenue };
