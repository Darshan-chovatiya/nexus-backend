const axios = require('axios');

const sendSms = async (mobile, otp) => {
  const bypassNumbers = ['9316755406', '9876543210', '1234567890']; // Add your 3 numbers here

  if (bypassNumbers.includes(mobile)) {
    console.log(`🚧 Bypassing OTP for test number: ${mobile}`);
    return true; // Simulate success
  }

  const apiKey = process.env.FACTOR_KEY;
  const templateName = process.env.FACTOR_TEMPLATE_NAME;
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/${templateName}`;

  try {
    const response = await axios.get(url);
    if (response.data.Status === 'Success') {
      console.log('✅ OTP sent successfully');
      return true;
    } else {
      console.error('❌ Failed to send OTP:', response.data);
      return false;
    }
  } catch (err) {
    console.error('❌ Error sending OTP via 2Factor:', err.message);
    return false;
  }
};

module.exports = sendSms;
