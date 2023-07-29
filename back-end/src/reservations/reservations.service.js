const knex = require("../db/connection");


function list() {
    return knex("reservations")
      .select("*")
  }

function create(reservation) {
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((newReservation) => newReservation[0]);
  }

  function listByDate(reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      // .whereNotIn("status", ["finished", "cancelled"])
      .orderBy("reservations.reservation_time");
  }


module.exports = {
  list,
  create,
  listByDate,
};