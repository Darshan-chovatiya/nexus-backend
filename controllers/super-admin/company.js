const asyncHandler = require("express-async-handler");
const Company = require("../../models/company");
const response = require("../../utils/response");
const { encrypt, decrypt } = require("../../utils/encryptor");
const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete image:", err);
  });
};

exports.createCompany = asyncHandler(async (req, res) => {
  const { prefix, name, company,mobile, state, city, email, password, category, aboutBusiness, aboutProduct } = req.body;
  const profileImage = req.file ? req.file.path : null;

  if(!prefix || !name || !company || !mobile || !state || !city || !email || !password || !category || !aboutBusiness || !aboutProduct){
    if (profileImage) deleteFile(profileImage);
    return response.success("All Fields Are Required",null,res)
  }
  // if(!profileImage){
  //   return response.success("profileImage image is Required",null,res)
  // }

  const exists = await Company.findOne({ email });
  if (exists) {
    deleteFile(profileImage);
    return response.success("Email already exists",null, res);
  }
  
const encryptedPassword = encrypt(password);
  const user = await Company.create({
      prefix,
      name,
      company,
      mobile,
      state,
      city,
      email,
      password:encryptedPassword,
      profileImage:profileImage || "",
      category,
      aboutBusiness,
      aboutProduct,
      isActive:false
  });
  return response.success("Company created successfully", user, res);
});

exports.updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if(!updates.name || !updates.email || !updates.password || !updates.mobile || !updates.pname || !updates.address || !updates.isActive){
    if (req.file) deleteFile(req.file.path);
    return response.success("All Fields Are Required",null,res)
  }
  const existingCompany = await Company.findById(id);
  if (!existingCompany) {
    if (req.file) deleteFile(req.file.path);
    return response.success("Company not found.",null,res)
  }
  
  const emailExists = await Company.findOne({ email: updates.email, _id: { $ne: id } });
  if (emailExists) {
    if (req.file) deleteFile(req.file.path);
    return response.success("Email already exists.", null, res);
  }

  if (updates.password) {
    updates.password = encrypt(updates.password);
  }

  if (req.file) {
    if (existingCompany.logo) {
      deleteFile(existingCompany.logo);
    }
    updates.logo = req.file.path;
  } else {
    updates.logo = existingCompany.logo
  }

  const company = await Company.findByIdAndUpdate(id, updates, { new: true });
  if (!company) return response.success("Failed to update company.",null,res)

  return response.success("Company updated successfully", company, res);
});

exports.deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await Company.findById(id);
  if (!company) return response.notFound(res);

  if (company.logo) {
    deleteFile(company.logo);
  }

  const result = await Company.findByIdAndDelete(id);
  if (!result) return response.notFound(res);
  return response.success("Company deleted successfully", null, res);
});

exports.getAllCompany = asyncHandler(async (req,res) =>{
  const companies = await Company.find();
  if(!companies){
    return response.notFound(res)
  }
  const company = companies.map(c => ({
    ...c.toObject(),
    password: decrypt(c.password),
  }));
  return response.success("All companies fetched successfully", company, res)
});

exports.getAllOtherCompanies = asyncHandler(async (req, res) => {
  const loggedInId = req.user._id;

  const companies = await Company.find({ _id: { $ne: loggedInId },isActive: true });

  if (!companies || companies.length === 0) {
    return response.notFound("No other companies found", res);
  }

  return response.success("Other companies fetched successfully", companies, res);
});


exports.updateStatus = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return response.notFound(res, "Company not found.");

  company.isActive = !company.isActive;
  await company.save();

  return response.success(
    `Company status updated to ${company.isActive ? 'Active' : 'Inactive'}`,
    company,
    res
  );
});
 

exports.getDashboardCompany = asyncHandler(async (req, res) => {
  const totalCompanies = await Company.countDocuments();
  const totalVisitor = await Company.countDocuments();
  return response.success("Company stats fetched", {totalCompanies,totalVisitor}, res);
});

exports.updateCompanyProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const requiredFields = ["prefix", "name", "company", "state", "city", "email", "category", "aboutBusiness", "aboutProduct"];
  for (let field of requiredFields) {
    if (!updates[field]) {
      if (req.file) deleteFile(req.file.path);
      return response.success(`${field} is required`, null, res);
    }
  }

  const company = await Company.findById(id);
  if (!company) {
    if (req.file) deleteFile(req.file.path);
    return response.success("Company not found.", null, res);
  }

  const emailExists = await Company.findOne({ email: updates.email, _id: { $ne: id } });
  if (emailExists) {
    if (req.file) deleteFile(req.file.path);
    return response.success("Email already exists.", null, res);
  }

  if (req.file) {
    if (company.profileImage) {
      deleteFile(company.profileImage);
    }
    updates.profileImage = req.file.path;
  } else {
    updates.profileImage = company.profileImage;
  }

  delete updates.password;
  delete updates.isActive;

  const updatedCompany = await Company.findByIdAndUpdate(id, updates, { new: true });
  if (!updatedCompany) return response.success("Failed to update profile.", null, res);

  return response.success("Profile updated successfully", updatedCompany, res);
});


exports.UpdateCompanyPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return response.success("All fields are required.", null, res);
  }
  if (newPassword !== confirmPassword) {
    return response.success("New password and confirm password do not match.", null, res);
  }

  const company = await Company.findById(id);
  if (!company) return response.notFound(res);

  const decryptedPassword = decrypt(company.password);
  if (decryptedPassword !== currentPassword) {
    return response.success("Current password is incorrect.", null, res);
  }
  company.password = encrypt(newPassword);
  await company.save();

  return response.success("Password updated successfully", null, res);
});

exports.companyInfoVisit = asyncHandler(async (req,res) => {
  const {companyId} = req.params;

  const companyStatus = await Company.findById(companyId).select("isActive").lean();
    if (!companyStatus) {
      return response.success("Company not found!", null, res);
    }
    if (!companyStatus.isActive) {
      return response.success("Company is inactive!", null, res);
    }

  const company = await Company.findById(companyId).select("logo name");
    if (!company) {
      return response.success("User not found!", null, res);
    }

    return response.success("User found successfully!", company, res);
})


// GET /company/public/:id
exports.getCompanyPublic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await Company.findById(id).select("-password -isActive -__v");

  if (!company) return response.notFound("Company not found", res);

  return response.success("Company data fetched", company, res);
});
