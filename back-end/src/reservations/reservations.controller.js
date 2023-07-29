/**
 * List handler for reservation resources
 */
 const reservationsService = require("./reservations.service.js");
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
   } next()
}

function isValidTimeAndDate(req, res, next){
  const reservation = req.body.data;
  const date = reservation.reservation_date;
  const time = reservation.reservation_time;
  // validation to check if reservation is on a Tuesday 
  const day = new Date(date).getUTCDay();
  if (day === 2) {
    return next({ status: 400, message: "Reservation cannot be on a Tuesday."})
  }

  // Validation to check if reservation is in the past 
  const formattedDate = new Date(`${date}T${time}`);
  if (formattedDate <= new Date()) {
    return next({status: 400, message: "Reservation must be in the future"});
  }

  console.log(time)
  // Validation to check if time is before 10:30am or after 9:30PM
  const hours = Number(time.split(":")[0]);
  const minutes = Number(time.split(":")[1]);
  if (hours < 10 || (hours === 10 && minutes < 30)) {
    return next({status: 400, message: "Reservation must be after 10:30am"});
  }
  if (hours > 21 || (hours === 21 && minutes > 30)) {
    return next({status: 400, message: "Reservation must be before 9:30pm"});
  }

  next()
}


//CRUD
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await reservationsService.search(mobile_number);
  } else {
    reservations = date ? await reservationsService.listByDate(date) : await reservationsService.list();
  }
  res.json({
    data: reservations,
  });
}


async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await reservationsService.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [isValidReservation, isValidTimeAndDate, asyncErrorBoundary(create)],
};
