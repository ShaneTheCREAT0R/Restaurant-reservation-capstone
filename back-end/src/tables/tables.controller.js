/**
 * List handler for table resources
 */
 const tablesService = require("./tables.service.js");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

 const VALID_FIELDS = ["table_name", "capacity"];

 function isValidTable(req, res, next) {
    const table = req.body.data;
    if (!table) {
      return next({ status: 400, message: "Must have data property" });
    }
  
    VALID_FIELDS.forEach((field) => {
      if (!table[field]) {
        return next({ status: 400, message: `Must have ${field} property.` });
      }
    });
  
    if (typeof table["capacity"] !== "number") {
      return next({
        status: 400,
        message: "capacity must be a number greater than 0",
      });
    }
  
    if (table["table_name"].length < 2) {
      return next({
        status: 400,
        message: "table_name must be at least two characters long.",
      });
    }
  
    next();
  }



async function list(req, res, next) {
    const data = await tablesService.list();
    res.json({ data });
  }
  
  
  async function create(req, res) {
    const table = req.body.data;
    const { table_id } = await tablesService.create(table);
    table.table_id = table_id;
    res.status(201).json({ data: table });
  }
  
  module.exports = {
    list: asyncErrorBoundary(list),
    create: [isValidTable, asyncErrorBoundary(create)],
    isValidTable,
  };