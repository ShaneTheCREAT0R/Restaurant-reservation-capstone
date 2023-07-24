/**
 * List handler for reservation resources
 */
 const reservationsService = require("./reservations.service.js");
 const errorHandler = require("../errors/errorHandler");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


 const validReservationsField = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];


function isValidReservation(req, res, next){
   const reservation = req.body.data;
   if(!reservation){
    return next({ status: 400, message: `Must have data property.` });
   }
   
}

async function list(req, res) {
  const data = await reservationsService.list();
  res.json({ data })
}


async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await reservationsService.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [isValidReservation, asyncErrorBoundary(create)],
};
