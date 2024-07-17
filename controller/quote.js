const express = require("express");
const { isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Quote = require("../model/quote");
const ErrorHandler = require("../utils/ErrorHandler");

// create quote
router.post(
  "/create-quote",
  catchAsyncErrors(async (req, res, next) => {
    try {
        const {quote} = req.body;
        const createQuote = await Quote.create({quote});
        
        res.status(201).json({
            success: true,
            createQuote
        });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// edit quote
router.put(
    "/edit-quote/:id",
    catchAsyncErrors(async (req,res,next)=>{
        try{
            const { id } = req.params.id;
            const { quote } = req.body;

            const editQuote = Quote.findByIdAndUpdate(id,
                { quote },
                { new: true }
                );

            if (!editQuote) {
                return next(new ErrorHandler("Quote is not found with this id", 404));
            } 

           res.status(201).json({
            success: true,
            editQuote
           });

        }catch(error){
        return next(new ErrorHandler(error, 400));
        }
    })
)

// get quote 
router.get("/get-quote/:id",
catchAsyncErrors(async(req,res,next)=>{
  try{
    const {id} = req.params.id;

    const getQuote = await Quote.findById(id);

    res.status(201).json({
      success: true,
      getQuote
    });

  }catch(error){
    return next(new ErrorHandler(error, 400));
  }
}))


// delete quote of a shop
router.delete(
  "/delete-quote/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const quote = await Quote.findById(req.params.id);

      if (!quote) {
        return next(new ErrorHandler("quote is not found with this id", 404));
      }    
    
      await quote.remove();

      res.status(201).json({
        success: true,
        message: "quote Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all quotes
router.get(
  "/get-all-quotes",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const quotes = await Quote.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        quotes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;