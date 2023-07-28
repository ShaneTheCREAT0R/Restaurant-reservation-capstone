/**
 * List handler for table resources
 */
 const tablesService = require("./tables.service.js");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



async function list(req, res) {
    const data = await tablesService.list();
    res.json({ data })
  }
  
  
  async function create(req, res) {
    const table = req.body.data;
    const { table_id } = await tablesService.create(table);
    table.table_id = table_id;
    res.status(201).json({ data: table });
  }
  