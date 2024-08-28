import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import DefaultLayout from '../layout/DefaultLayout';

const Settings = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = async (e) => {
      e.preventDefault();
      if (!email) {
        setIsError(true);
        setErrMsg("Email is required.");
        return;
      }else{

      
      try {
        //const output = await resetPassword({ "username" });
        handleResetPassword(email);
        setStep(2);
      } catch (error) {
        setIsError(true);
        setErrMsg('Error in resetting password. Please try again.');
      }
    }
    };
    const handleResetPassword = async (username) => {
      try {
        const output = await resetPassword({ username });
        handleResetPasswordNextSteps(output, username);
      } catch (error) {
        setIsError(true);
        const message = error.toString().split(':').pop().trim();
        if (message === 'Username/client id combination not found.') {
          const messages = 'User Not Found';
          setIsError(true);

          setErrMsg(messages);
        } else if (
          message ===
          'Exceeded daily email limit for the operation or the account. If a higher limit is required, please configure your user pool to use your own Amazon SES configuration for sending email.'
        ) {
          const messages =
            'Your daily limit exceed,Please try again after some time';
          setIsError(true);
          setErrMsg(messages);
        } else {
          console.log(message);
          setErrMsg(message);
        }
      }
    };
    function handleResetPasswordNextSteps(output, username) {
      const { nextStep } = output;
      switch (nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
          const codeDeliveryDetails = nextStep.codeDeliveryDetails;
          console.log(
            `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`,
          );
        
          // setIsForgetPassword(false);
          // setIsVerifyOTP(true);
          // setIsChangePassword(false);
          //setIsOtpStage(true);
          break;
        case 'DONE':
          console.log('Successfully reset password.');
          break;
      }
    }
    const handleOTPSubmit = (e) => {
      e.preventDefault();
      if (!otp) {
        setIsError(true);
        setErrMsg("OTP is required.");
        return;
    }else{
      setStep(3);

    }
  };

  const handleConfirmPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setIsError(true);
      setErrMsg("Password and Confirm Password are required.");
      return;
    }else   if (newPassword !== confirmPassword) {
      setIsError(true);
      setErrMsg('Passwords do not match.');
      return;
    }else{
      try {
        console.log("email",email,"otp", otp, "newPassword", newPassword);
        await handleConfirmResetPassword(email, otp, newPassword);

        // await confirmResetPassword(email, otp, newPassword);
        
        //navigate("/signIn");
      } catch (error) {
        setIsError(true);
        setErrMsg('Error in confirming password. Please try again.');
      }
    }
   
  };



  const handleConfirmResetPassword = async (email, otp, newPassword) => {
    console.log(email);
    console.log(otp);
    console.log(newPassword);
 
    try {
      await confirmResetPassword({ username: email, newPassword:newPassword,confirmationCode: otp });
      navigate('auth/signin');
    } catch (error) {
      console.log(error);
      setIsError(true);
      const message = error.toString().split(':').pop().trim();
      setErrMsg(message);
    }
  }
  return (
    <>
      <Breadcrumb pageName="Update Password" />
      <div className="flex justify-center items-center">
  <div className="w-full max-w-md rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex flex-wrap items-center mt-3">
      {step === 1 && (
        <div className="w-full p-4 sm:p-12.5 ">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Change My Password
          </h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  {/* Your SVG icon here */}
                </span>
              </div>
            </div>
            <div className="w-full justify-center items-center">
            <button
            className="btn-grad w-[180px] justify-center"
            onClick={() => {
             
            }}
          >
           
         Continue
          </button>
           
              {/* <input
                type="submit"
                value="Continue"
                className="w-full cursor-pointer rounded-lg border border-primary bg-[#50abe3] p-4 text-white transition hover:bg-opacity-90"
              /> */}
              {isError && <p className="text-red-500">{errMsg}</p>}
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="w-full p-10 ">
          <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            OTP
          </h2>
          <form onSubmit={handleOTPSubmit}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Enter OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  {/* Your SVG icon here */}
                </span>
              </div>
            </div>
            <div className="mb-5">
              <input
                type="submit"
                value="Verify OTP"
                className="btn-grad w-[180px] justify-center"              />
              {isError && <p className="text-red-500">{errMsg}</p>}
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Change Password
          </h2>
          <form onSubmit={handleConfirmPassword}>
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Enter Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="6+ Characters, 1 Capital letter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  {/* Your SVG icon here */}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="6+ Characters, 1 Capital letter"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  {/* Your SVG icon here */}
                </span>
              </div>
            </div>
            <div className="mb-5">
              <input
                type="submit"
                value="Change Password"
                className="btn-grad w-[180px] justify-center"              />
            
              {isError && <p className="text-red-500">{errMsg}</p>}
            </div>
          </form>
        </div>
      )}
    </div>
  </div>
</div>

    </>
  );
};

export default Settings;
