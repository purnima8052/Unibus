const Route = require("../models/Route");

exports.createRoute = async (req, res) => {
  const route =
    await Route.create(req.body);

  res.status(201).json(route);
};

exports.getAllRoutes = async (req, res) => {
  const routes =
    await Route.find();

  res.json(routes);
};