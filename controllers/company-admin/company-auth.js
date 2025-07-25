const response = require("../../utils/response");
const helpers = require("../../utils/helpers");
const { decrypt } = require("../../utils/encryptor");
const asyncHandler = require("express-async-handler");
const models = require("../../models/zindex");

exports.signInCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response.forbidden("All fields are required", res);
  }

  const company = await models.company.findOne({ email }).lean();

  if (!company) {
    return response.success("Invalid credentials!", null, res);
  }

  if (!company.isActive) {
    return response.forbidden("Your account is inactive. Please contact admin.", res);
  }

  const encryptedPassword = company.password;
  const plainTextPassword = decrypt(encryptedPassword);

  if (plainTextPassword !== password) {
    return response.success("Invalid credentials!", null, res);
  }

  const token = helpers.generateToken({ id: String(company._id), type: "company" });

  return response.success("Company login successfully!", { token, company }, res);
});

exports.updateDeviceInfo = asyncHandler(async (req, res) => {
  const { fcmToken, deviceId } = req.body; 
  const userId = req.token.id;
  if (!fcmToken || !deviceId) {
    return response.forbidden("All fields are required", res);
  }
  const company = await models.company.findById(userId);
  if (!company) {
    return response.success("Company not found!", null, res);
  }
  company.fcmToken = fcmToken;
  company.deviceId = deviceId;
  await company.save();
  return response.success("Device info updated successfully!", company, res);
});


exports.verifyCompany = asyncHandler(async (req, res) => {
  try {
   const userId = req.token.id;
  // Find the user
  const user = await models.company.findById(userId);
  if (!user) {
    return response.success("User not found!", null, res);
  }
    if (!user.isActive) {
      return response.forbidden("Your account is inactive. Please contact admin.", res);
    }
  return response.success("User found!", user, res);
  } catch (error) {
    return response.forbidden("Invalid or expired token", res);
  }
});


const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-');
exports.companySlugInfo = asyncHandler(async (req,res) => {
    const companies = await models.company.find();

    const Company = companies.find((c) => slugify(c.name) === req.params.slug);
    if (!Company) {
      return response.success("User not found!", null, res);
    }

    return response.success("User found successfully!", Company, res);
})