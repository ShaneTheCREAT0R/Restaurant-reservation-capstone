const knex = require("../db/connection");


function list() {
    return knex("tables")
      .select("*")
  }

function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((newTable) => newTable[0]);
  }

module.exports = {
  list,
  create,
};