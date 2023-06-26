const EVENT = require("../../model/eventDataschema");
const LIBRARYDATA = require("../../model/libraryDataSchema");

async function addEvent(req, res) {
  try {
    if (
      req.body.name &&
      req.body.date &&
      req.body.startTime &&
      req.body.endTime &&
      req.body.host &&
      req.body.description &&
      req.body.fees &&
      req.body.venue
    ) {

      let flag = 0;
      let findVenue = await LIBRARYDATA.findOne({ "venue.name": req.body.venue }, { "venue.$": 1 })


      const checkEventName = await EVENT.findOne({ name: req.body.name });
      if (checkEventName) {
        console.log("Event with same name exists");
        res.status(409).send({ message: "Event with same name already exists" })

      } else {
        const checkEventDate = await EVENT.findOne({ date: req.body.date });
        if (checkEventDate) {
          let A = new Date(`1970-01-01T${checkEventDate.startTime}`);
          let B = new Date(`1970-01-01T${checkEventDate.endTime}`);
          let C = new Date(`1970-01-01T${req.body.startTime}`);
          let D = new Date(`1970-01-01T${req.body.endTime}`);

          const overlapsWithSecond = A <= D && B >= C;
          const overlapsWithFirst = A >= D && B <= C;
          if (overlapsWithFirst || overlapsWithSecond) {
            flag = 0;
          } else {
            flag = 1;
          }
        } else {
          flag = 1;
        }
        if ((flag === 1)) {
          let newEvent = new EVENT({
            name: req.body.name,
            description: req.body.description,
            host: req.body.host,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            fees: req.body.fees,
            status: "Upcoming",
            totalSeat: findVenue.venue[0].capacity,
            availableSeat:findVenue.venue[0].capacity,
            venue: req.body.venue,
            banner: req.file.filename
          });
          newEvent.save();
          console.log("saved");
          res.status(200).send({ message: "Event added" });
        } else {
          console.log("Unable to book event in the given time");
          res.status(409).send({ message: "Unable to book event in the given time" });
        }
      }

    } else {
      console.log("notok");
      res.status(409).send({ message: "Form contains invalid data " });
    }
  } catch (error) {
    console.log(error);
    console.log("Internal server error");
    res.status(500).send({ message: "Internal server error" });
  }
}


async function fetchVenue(req, res) {
  let venueData = await LIBRARYDATA.find({}, { venue: 1 })
  res.json(venueData)
}
async function getEventData(req, res) {
  let venueData = await EVENT.find({})
  console.log(venueData)
  res.json(venueData)
}


module.exports = { addEvent, fetchVenue , getEventData};



//  status :Upcoming, In progress , Ended , Postponed, Cancelled, Sold out, Registration closed

//venue: meeting room-50 ,community hall-300
