const USER = require('../../model/userSchema')
const BOOK = require('../../model/bookDataSchema')
const CHECKOUT = require('../../model/bookLoanDataSchema')

async function getBookData(req, res) {
  try {
    let books = await BOOK.find({}, { title: 1 })
    res.json(books)

  } catch (error) {
    console.log(error);
    console.log("Internal server error")
    res.status(500).send({ message: "Internal server error" });

  }


}
async function userSearch(req, res) {
  try {

    let user = await USER.findOne({ cardNumber: req.body.term })
    if (user) {
      let history = await CHECKOUT.findOne({ user: user._id }).populate({
        path: 'books.bookID',
        select: 'title '
      })

      res.json({ user: user, history: history })
    } else {
      res.status(404).send({ message: "User Not Found" })
    }
  } catch (error) {
    console.log(error);
    console.log("Internal server error")
    res.status(500).send({ message: "Internal server error" });

  }
}

async function checkout(req, res) {
  try {
    const maxHold = 4;
    let expectedReturnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    let CheckBook = await BOOK.findOne({ _id: req.body.bookID }, { copy: 1, onHold: 1, borrowed: 1 });
    let available = CheckBook.copy - (CheckBook.onHold + CheckBook.borrowed);

    if (available > 0) {
      let checkUser = await CHECKOUT.findOne({ user: req.body.userID });

      if (!checkUser) {
        // Create new checkUser
        let newCheckout = new CHECKOUT({
          user: req.body.userID,
          books: [
            {
              bookID: req.body.bookID,
              dateOfBorrow: Date.now(),
              renewDates: [],
              dateOfReturn: null,
              expectedDOR: expectedReturnDate,
              fine: 0,
              hasReturned: false,
            },
          ],
        });

        await newCheckout.save();
        await BOOK.updateOne(
          { _id: req.body.bookID },
          {
            $inc: {
              borrowed: 1,
            },
          }
        );

        let history = await CHECKOUT.findOne({ user: req.body.userID }).populate({
          path: 'books.bookID',
          select: 'title',
        });

        res.status(200).send({ message: 'Success', history: history });
      } else {
        const countNotReturnedBooks = checkUser.books.filter((book) => !book.hasReturned);
        console.log('enc', countNotReturnedBooks);

        if (countNotReturnedBooks.length < maxHold) {
          let bookExists = checkUser.books.findIndex((book) => book.bookID.toString() === req.body.bookID);
          if (bookExists !== -1) {
            // Book already borrowed
            console.log('Already borrowed this book');
            res.status(409).send({ message: 'Already borrowed this book' });
          } else {
            await CHECKOUT.updateOne(
              { user: req.body.userID },
              {
                $push: {
                  books: {
                    bookID: req.body.bookID,
                    dateOfBorrow: Date.now(),
                    renewDates: [],
                    dateOfReturn: null,
                    expectedDOR: expectedReturnDate,
                    fine: 0,
                    hasReturned: false,
                  },
                },
              }
            );

            let history = await CHECKOUT.findOne({ user: req.body.userID }).populate({
              path: 'books.bookID',
              select: 'title',
            });

            await BOOK.updateOne(
              { _id: req.body.bookID },
              {
                $inc: {
                  borrowed: 1,
                },
              }
            );

            console.log('Added to array');
            res.status(200).send({ message: 'Success', history: history });
          }
        } else {
          console.log('Maximum books holding');
          res.status(403).send({ message: 'Exceeds maximum limit of books to checkout' });
        }
      }
    } else {
      console.log('Book Unavailable');
      res.status(403).send({ message: 'Book Unavailable' });
    }
  } catch (error) {
    console.log(error);
    console.log('Internal server error');
    res.status(500).send({ message: 'Internal server error' });
  }

}

async function getCheckoutData(req, res) {

  const checkoutData = await CHECKOUT.find({})
    .populate({
      path: 'books.bookID',
      select: 'title'
    }).populate({
      path: 'user',
      select: 'name'
    })
  res.status(200).json(checkoutData)


}

async function renewBook(req, res) {
  try {

    const currentDate = new Date();

    let expectedReturnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

     let x =await CHECKOUT.updateOne(
      { user: req.body.userID, "books._id": req.body.bookID },
      { $push: { "books.$.renewDates": currentDate },
      $set:{expectedDOR:expectedReturnDate} }
    );
    console.log(x)
    res.status(200).send({message:"Renewed"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while renewing the book." });
  }
}
async function returnBook(req, res) {
  try {

    const currentDate = new Date();


     let x =await CHECKOUT.updateOne(
      { user: req.body.userID, "books._id": req.body.bookID },
      { $set: 
        { 
          "books.$.dateOfReturn": currentDate ,
        hasReturned:true},
       }
    );
    // console.log(x)
      await BOOK.updateOne({_id:req.body.book},{
        
          $inc: {
            borrowed: -1,
          },
        
      })
    res.status(200).send({message:"Return Successful"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while renewing the book." });
  }
}

module.exports = {
  getBookData,
  userSearch,
  checkout,
  getCheckoutData,
  renewBook,
  returnBook
}