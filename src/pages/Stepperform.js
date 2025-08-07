import React, { useState } from "react";
import Personaldetails from "./stepperform/personaldetails";
import Countrydetails from "./stepperform/countrydetails";
import Skillsdetails from "./stepperform/skillsdetails";
import Credentaildetails from "./stepperform/credentaildetails";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import Layout from "../component/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const steps = [
  "Personal Information",
  "Details",
  "Skills Details",
  "Credentail Details",
];

export default function Stepperform() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {
      photo: "",
      photoPreview: "",
      name: "",
      gender: "",
      phone: "",
    },
    credential: { email: "", password: "", passwordConfirmation: "" },
    skills: [],
    country: { countryId: "", stateId: "" },
  });
  const navigate = useNavigate();

  //validations

  const validators = [
    // Step 0 — Personal
    () => {
      const { name, gender, phone, photo } = formData.personal;
      if (!name.trim()) return alert("Full Name is required");
      if (!gender) return alert("Gender is required");
      if (!phone.trim()) return alert("Phone is required");
      //   if (!photo) return alert("Profile photo is required");
      return true;
    },

    // Step 2 — Country/State
    () => {
      const { countryId, stateId } = formData.country;
      if (!countryId) return alert("Country must be selected");
      if (!stateId) return alert("State must be selected");
      return true;
    },
    // Step 3 — Skills
    () => {
      if (formData.skills.length === 0) {
        return alert("Please add at least one skill");
      }
      return true;
    },
    // Step 4 — Credentials
    () => {
      const { email, password, passwordConfirmation } = formData.credential;
      if (!email.trim()) return alert("Email is required");
      if (!password) return alert("Password is required");
      if (password !== passwordConfirmation)
        return alert("Passwords must match");
      return true;
    },
  ];

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://reactinterviewtask.codetentaclestechnologies.in/api/add-user",
        formData, // 👈 combined data from all steps
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if token required
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("User successfully added!");
        navigate("/user-list"); // ✅ navigate to list page
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Personaldetails
              personal={formData.personal}
              setFormData={setFormData}
            />
          </>
        );
      case 1:
        return (
          <>
            <Countrydetails
              formData={formData}
              setFormData={setFormData}
              nextStep={handleNext}
              prevStep={handleBack}
            />
          </>
        );
      case 2:
        return (
          <>
            <Skillsdetails
              formData={formData}
              setFormData={setFormData}
              nextStep={handleNext}
              prevStep={handleBack}
            />
          </>
        );
      case 3:
        return (
          <>
            <Credentaildetails formData={formData} setFormData={setFormData} />
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Layout>
      <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
        <div>
          <h3 class="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
            Stepper Form
          </h3>
        </div>
      </div>
      <div className="bg-white">
        <div className="p-4 rounded-lg dark:border-gray-700 mb-2">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
      <div className="bg-white">
        <div className="p-4 rounded-lg dark:border-gray-700">
          <>
            {activeStep === steps.length ? (
              <div className="flex justify-center  w-full mt-5">
                <div className=" p-8 m-4">
                  <Typography variant="h5" className="mt-10 mb-10 pb-10">
                    Thank you for submitting the form!
                  </Typography>
                  <Link
                    to="/List"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    View List
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <Typography variant="h5">
                  {getStepContent(activeStep)}
                </Typography>
                <div className="flex justify-center">
                  <div className="flex justify-between w-full mt-4">
                    <Button
                      className="bg-back "
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (!validators[activeStep]()) return; // ✅ run validation first

                        if (activeStep === steps.length - 1) {
                          handleSubmit(); // ✅ final step — submit to backend
                        } else {
                          setActiveStep((prev) => prev + 1); // ✅ otherwise just go to next step
                        }
                      }}
                    >
                      {activeStep === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </div>
    </Layout>
  );
}
