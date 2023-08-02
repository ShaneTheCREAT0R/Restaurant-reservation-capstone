/**
 * List handler for reservation resources
 */
 const reservationsService = require("./reservations.service.js");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


 const VALID_RESERVATION_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];


//helper function for validation
function _validateTime(str) {
  const [hour, minute] = str.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

function isValidReservation(req, res, next){
   const reservation = req.body.data;
   if(!reservation){
    return next({ status: 400, message: `Must have data property.` });
   } 
   VALID_RESERVATION_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      return next({ status: 400, message: `${field} field required` });
    }

    if (field === "people" && typeof reservation[field] !== "number") {
      return next({
        status: 400,
        message: `${reservation[field]} is not a number type for people field.`,
      });
    }

    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({ status: 400, message: `${field} is not a valid date.` });
    }

    if (field === "reservation_time") {
      if (!_validateTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time` });
      }
    }
  });
  next();

}

function isValidTimeAndDate(req, res, next){
  const reservation = req.body.data;
  const date = reservation.reservation_date;
  const time = reservation.reservation_time;
  // validation to check if reservation is on a Tuesday 
  const day = new Date(date).getUTCDay();
  if (day === 2) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays."})
  }

  // Validation to check if reservation is in the past 
  const formattedDate = new Date(`${date}T${time}`);
  if (formattedDate <= new Date()) {
    return next({status: 400, message: "Reservation must be in the future"});
  }

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

function mobileNumberIsNumber(req, res, next) {
  const { mobile_number } = req.body.data;
  const mobileInt = parseInt(mobile_number)
  const validNumber = Number.isInteger(mobileInt);
  if (validNumber) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `mobile_number field formatted incorrectly: ${mobile_number} needs to be a number.`,
    })
  }
}

function hasBookedStatus(req, res, next) {
  const { status } = res.locals.reservation
    ? res.locals.reservation
    : req.body.data;
  if (status === "seated" || status === "finished" || status === "cancelled") {
    return next({
      status: 400,
      message: `New reservation can not have ${status} status.`,
    });
  }
  next();
}

function isValidStatus(req, res, next) {
  const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!VALID_STATUSES.includes(status)) {
    return next({ status: 400, message: "Status unknown." });
  }
  next();
}

function isAlreadyFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Cannot change a reservation with a finished status.",
    });
  }
  next();
}

const reservationExists = async (req, res, next) => {
  const { reservation_Id } = req.params;
  const reservation = await reservationsService.read(reservation_Id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation_id ${reservation_Id} does not exist.`,
  });
};




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

async function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({data: reservation});

}

async function update(req, res, next) {
  const { reservation_Id } = req.params;
  const { status } = req.body.data;
  const reservation = await reservationsService.update(reservation_Id, status);
  res.json({ data: reservation });
}

async function modify(req, res, next) {
  const { reservation_Id } = req.params;
  const reservation = req.body.data;
  const data = await reservationsService.modify(reservation_Id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(isValidReservation),
    isValidTimeAndDate,
    mobileNumberIsNumber,
    hasBookedStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    isValidStatus,
    isAlreadyFinished,
    asyncErrorBoundary(update),
  ],
  modify: [
    isValidReservation,
    isValidTimeAndDate,
    asyncErrorBoundary(reservationExists),
    hasBookedStatus,
    asyncErrorBoundary(modify),
  ],
};
