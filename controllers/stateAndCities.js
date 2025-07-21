const cities = require("../models/cities");
const states = require("../models/states");
const asyncHandler = require("express-async-handler");
const response = require("./../utils/response");
const { default: mongoose } = require("mongoose");

exports.getCitiesByStates = async (req, res) => {
    try {
        const { stateId } = req.body;
        // Check if stateId is provided and valid
        if (!stateId || !mongoose.Types.ObjectId.isValid(stateId)) {
            return response.success("Valid stateId is required!", null, res);
        }
        // Verify if the state exists
        const StateExists = await states.findOne({ _id: stateId });
        if (!StateExists) {
            return response.success("State not found or is deleted!", null, res);
        }
        // Fetch cities for the given stateId, excluding deleted ones
        const Cities = await cities
            .find({ stateId })
            .select('name code _id') // Select only necessary fields for dropdown
            .sort({ name: 1 }); // Sort alphabetically by name
        if (!Cities || Cities.length === 0) {
            return response.success("No cities found for this state!", [], res);
        }
        
        // Format response for dropdown (array of objects with id, name, code)
        const cityList = Cities.map(city => ({
            id: city._id,
            name: city.name,
            code: city.code
        }));
        return response.success("Cities fetched successfully!", cityList, res);
    } catch (err) {
        return response.serverError(err, res);
    }
};
exports.getStates = async (req, res) => {
    try {
        // Fetch all states, excluding deleted ones
        
        const States = await states
        .find({  })
        .select('name code _id') // Select only necessary fields for dropdown
        .sort({ name: 1 }); // Sort alphabetically by name
        if (!States || States.length === 0) {
            return response.success("No states found!", [], res);
        }
        // Format response for dropdown (array of objects with id, name, code)
        const stateList = States.map(state => ({
            id: state._id,
            name: state.name,
            code: state.code
        }));
        return response.success("States fetched successfully!", stateList, res);
    } catch (err) {
        return response.serverError(err, res);
    }
}