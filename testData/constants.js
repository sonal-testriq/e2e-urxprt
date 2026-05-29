export const pageRoutes = {
  home: `/en`,
  account: `/en/account`,
  loginWithEmail: `/en/loginwithemail`,
  signup: `/en/signup`,
};

export const authData = {
  invalidEmailFormat: "test@testing",
  invalidPassword: "wrongpassword",
  incorrectPassword: "Shiva@12",
  validMobileNumber: "1234567890",
  invalidMobileNumber: "0000000000",
  shortMobileNumber: "00000000",
  otpSuccess: ["1", "2", "3", "4", "5", "6"],
  otpInvalid: ["0", "0", "0", "0", "0", "0"],
  errorMessages: {
    blankEmail: "Email is required",
    blankPassword: "Password is required",
    invalidEmailFormat: "Invalid email format",
    passwordRequirements:
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character, and should not contain spaces",
    invalidPassword: "Invalid password",
    otpSentSuccess: "OTP sent successfully.",
    unregisteredMobile: "mobile number is not registered.",
    exactly10Digits: "Minimum of 9 digits should be there",
    requiredField: "This field is required",
    registrationRequired: "This is required",
    termsRequired: "You must agree to the terms and conditions",
  },
};

// export const PTJPostName = "Part Time Job Post - E2E";
const getRandomNumber = () => Math.floor(Math.random() * 1000) + 1;
export const PTJPostName = "Temp V2 Post Automation" + "_" + getRandomNumber();
export const TAIProductName = "Temp TAI post" + getRandomNumber();
export const BSMProductName = "Temp BSM post" + "_" + getRandomNumber();
export const PBPPostName = "PBP Post Automation" + "_" + getRandomNumber();
export const WBOPostName = "WBO Post Automation" + "_" + getRandomNumber();
export const PTJPost_Name = "PTJ Post Automation";
