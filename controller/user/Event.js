const EVENT = require("../../model/eventDataschema")
const instance = require('../../config/razorpay')
const crypto = require("crypto")

async function allEvents(req, res) {
    try {
        const eventData = await EVENT.find({}, { guests: 0, Images: 0 });

        const x = new Date();
        const currentDate = x.toISOString().split('T')[0];

        eventData.forEach(async (event) => {

            const y = new Date(event.date)
            const eventDate = y.toISOString().split('T')[0];
            if (eventDate > currentDate) {
            } else if (eventDate === currentDate) {
                const startTime = new Date(`${currentDate} ${event.startTime}`);
                const endTime = new Date(`${currentDate} ${event.endTime}`);
                if (x >= startTime && x <= endTime) {
                    await EVENT.findByIdAndUpdate(event._id, { status: "Now" });
                } else if (x < endTime) {
                    await EVENT.findByIdAndUpdate(event._id, { status: "Ended" });
                } else {


                }
            } else {
                await EVENT.findByIdAndUpdate(event._id, { status: "Ended" });
            }

        });


        const updatedEvent = await EVENT.find({}, { guests: 0, Images: 0 });
        res.json(updatedEvent)
    } catch (error) {
        console.log(error)
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }
}

async function fetchSingleEvent(req, res) {
    try {
        const singleEventData = await EVENT.findById({ _id: req.params.id }, { guests: 0 })
        res.json(singleEventData)
    } catch (error) {
        console.log(error)
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }
}

async function bookEvent(req, res) {
    try {
        const options = {
            amount: Number(req.body.totalPrice * 100),  // amount in the smallest currency unit
            currency: "INR",
            // receipt: "order_rcptid_11"
        };
        const order = await instance.orders.create(options)
        // console.log(order)
        let x = await EVENT.updateOne(
            { _id: req.body.id },
            {
              $push: {
                guests: {
                  user: req.ID,
                  ticketCount: req.body.numSeats,
                  timeOfBooking: Date.now(),
                  amountPaid: req.body.totalPrice,
                  paymentStatus: "Pending",
                  orderID: order.id,
                },
              },
              $inc: {
                availableSeat: -req.body.numSeats,
              },
            }
          );
          console.log(x);
          

        res.status(200).json({ success: true, order })



    } catch (error) {
        console.log(error)
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }
}



async function payment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        console.log(req.body)
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;
        console.log(isAuthentic)
        if (isAuthentic) {
            // Database comes here


            let x = await EVENT.updateOne(
                { 'guests.orderID': razorpay_order_id },
                {
                    $set: {
                        'guests.$.paymentStatus': 'Complete',
                        'guests.$.paymentDetails': {
                            razorpay_order_id: razorpay_order_id,
                            razorpay_payment_id: razorpay_payment_id,
                        },
                    },
                }
            );
            console.log(x)


            console.log("object")
            res.redirect(
                // `https://magnuspubliclibrary.tech/payment?reference=${razorpay_payment_id}`
                `http://localhost:3000/payment?reference=${razorpay_payment_id}`
            );
        } else {

            let x = await EVENT.updateOne(
                { 'guests.orderID': razorpay_order_id },
                {
                    $pull: {
                        guests: {
                            orderID: razorpay_order_id
                        }
                    },
                }
            );
            console.log(x)
            console.log("here")
            res.status(400).json({
                success: false,
            });
        }

    } catch (error) {
        console.log(error)
    }

}




module.exports = { allEvents, fetchSingleEvent, bookEvent, payment }