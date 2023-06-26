const BOOK = require("../../model/bookDataSchema")
const ONHOLD = require("../../model/onHold");
const USER = require("../../model/userSchema");
const mongoose = require("mongoose");

async function addReview(req, res) {
    // console.log(req.ID)
    // console.log(req.body)
    await BOOK.updateOne({ _id: req.body.bookID }, {
        $push: {
            rating: {
                star: req.body.rating,
                review: req.body.text,
                user: req.ID
            }
        }
    })
    const updateReviews = await BOOK.findOne({ _id: req.body.bookID }, { rating: 1 }).populate({
        path: 'rating.user',
        select: 'name profilePhoto',
      })
    console.log(updateReviews)
    res.status(200).json(updateReviews)


}


const placeHold = async (req, res) => {
    try {
        const maxHold = 4
        const currentDate = new Date();
        const maxReservationDays = 5;
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + maxReservationDays);
        let CheckBook = await BOOK.findOne({ _id: req.body.bookId }).populate("author genre")
        let available = CheckBook.copy - (CheckBook.onHold + CheckBook.borrowed)
        console.log(available, "available")
        if (available > 0) {
            let ONHold = await ONHOLD.findOne({ user: req.ID });
            if (!ONHold) {
                //first time holding a book
                let newOnHold = new ONHOLD({
                    books: [
                        {
                            bookID: req.body.bookId,
                            date: req.body.date,
                        },
                    ],
                    user: req.ID,
                });
                await newOnHold.save();

                //+1 to onhold of book

                await BOOK.updateOne(
                    { _id: req.body.bookId },
                    {
                        $inc: {
                            onHold: 1
                        }
                    }
                );
                console.log("saved to db")
                res.status(200).send({ message: "Placed hold of this book", CheckBook: CheckBook })

            } else {
                //add the book to existing books array of this user
                //check if the book already exists
                // getting the user data from the db

                let bookExists = ONHold.books.findIndex((book) => book.bookID == req.body.bookId);

                //-1 means that book doesnt exist. 1 means it exists
                if (bookExists !== -1) {
                    //book und
                    console.log("Already holding this book");
                    res.status(409).send({ message: "Already holding this book" })
                } else {
                    //book array ll illa so add 
                    //max hold aayo nokk

                    if (ONHold.books.length < maxHold) {
                        //date of expire
                        const endDate = new Date('2023-05-20');
                        const userPickedDate = new Date(req.body.date);
                        const differenceInMilliseconds = endDate - userPickedDate;
                        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
                        if (differenceInDays >= 0) {
                            await ONHOLD.updateOne(
                                { user: req.ID },
                                {
                                    $push: {
                                        books: {
                                            bookID: req.body.bookId,
                                            date: req.body.date,
                                        },
                                    },
                                }
                            );
                            //+1 to onhold of book
                            await BOOK.updateOne(
                                { _id: req.body.bookId },
                                {
                                    $inc: {
                                        onHold: 1
                                    }
                                }
                            );
                            console.log("added to array ")
                            res.status(200).send({ message: "Placed hold of this book", CheckBook: CheckBook })

                        } else {
                            console.log("max date exceeded");
                            res.status(403).send({ message: "Exceeds maximum date" })
                        }



                    } else {
                        console.log("maximum books holding");
                        res.status(403).send({ message: "Exceeds maximum limit of books" })

                    }

                }
            }
        } else {
            console.log("Book Unavailable");
            res.status(403).send({ message: "Book Unavailable" })
        }

        // checkAndDeleteHold()

    } catch (err) {
        console.log(err.message);
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }
};

async function checkAndDeleteHold() {
    try {
        //code not correct
        const currentDate = new Date();
        const expiredHolds = await ONHOLD.find({ date: { $lt: currentDate } });
        await ONHOLD.deleteMany({ date: { $lt: currentDate } });

        const numberOfRemovedHolds = expiredHolds.length;
        await BOOK.updateMany({}, { $inc: { onHold: -numberOfRemovedHolds } });
        console.log('Expired hold elements removed successfully.');

    } catch (error) {
        console.error('Error while checking and deleting expired hold elements:', error);

    }
}
const fetchBook = async (req, res) => {
    try {
        let allBook = await BOOK.find({}, { title: 1, image: 1 })
        res.status(200).send({ allBook: allBook })
    } catch (error) {
        console.log(error);
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }
}

const fetchSingleBook = async (req, res) => {
    try {
        let singleBook = await BOOK.find({ _id: req.params.id })
        .populate({
            path: 'author genre',
          }).populate({
            path: 'rating.user',
            select: 'name profilePhoto',
          })
        res.status(200).send({ singleBook: singleBook })
    } catch (error) {
        console.log(error);
        console.log("Internal server error")
        res.status(500).send({ message: "Internal server error" });

    }
}

//  
module.exports = { addReview, placeHold, checkAndDeleteHold, fetchBook, fetchSingleBook } 