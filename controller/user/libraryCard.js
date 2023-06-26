const USER = require("../../model/userSchema")

async function libraryCard(req, res) {
    try {
        let user = await USER.findOne({ _id: req.ID })
        console.log(user)
        if (user) {
            let CardNumber = "MgPL"+(user.index+10000)
            //update user
            await USER.updateOne({ _id: req.ID }, {
                $push: { 
                    address: {
                        address1: req.body.address1,
                        address2: req.body.address2,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode
                    }
                },
                $set: {
                    profilePhoto: req.file.filename,
                    issuedOn: Date.now(),
                    cardNumber:CardNumber
                }
            },
                // { upsert: true }
            )

            res.status(200).send({ message: "success" })
        } else {
            res.status(401).send({ message: "User not found" })
        }

    } catch (error) {
        console.log(error);
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }



}
module.exports = {
    libraryCard
}

// $2b$10$  rzfLN2aitW4JMw8R96glf.QZttVhMvF3GqvTxzq8DKJLV1qICde3e
// $2b$10$  g4TjzRgcGsZjJk/y8935HuA.6pW.P15pcbh0kZHG75oK4ZmO0sIUK