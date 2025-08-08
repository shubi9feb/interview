import React, { useState } from "react";
import Personaldetails from "./stepperform/personaldetails";
import Countrydetails from "./stepperform/countrydetails";
import Skillsdetails from "./stepperform/skillsdetails";
import Credentaildetails from "./stepperform/credentaildetails";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import Layout from "../component/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
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
      phoneNumber: "",
    },
    credential: { email: "", password: "", passwordConfirmation: "" },
    skills: [],
    country: { countryId: "", stateId: "" },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //validations

  const validators = [
    // Step 0 — Personal
    () => {
      const { name, gender, phoneNumber, photo } = formData.personal;
      if (!name.trim()) return alert("Full Name is required");
      if (!gender) return alert("Gender is required");
      //   if (!phoneNumber .trim()) return alert("Phone is required");
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
    // debug: see the nested object you logged earlier
    console.log("SUBMIT - current formData:", formData);

    // Defensive extraction from nested structure
    const personal = formData.personal || {};
    const credential = formData.credential || {};
    const country = formData.country || {};
    const skillsArr = formData.skills || [];

    const name = personal.name?.trim() ?? "";
    const email = credential.email?.trim() ?? "";
    const phoneNumber =
      personal.phoneNumber?.trim() ?? personal.phone?.trim() ?? "";
    const password = credential.password ?? "";
    const password_confirmation =
      credential.passwordConfirmation ?? credential.password ?? "";
    const role = credential.role ?? "user";
    const gender = personal.gender ?? "";
    const countryId = country.countryId ?? "";
    const stateId = country.stateId ?? "";
    const photoFile = personal.photo ?? null;
    const skills = Array.isArray(skillsArr)
      ? skillsArr.join(",")
      : skillsArr || "";
    const token = localStorage.getItem("token") ?? "";

    const clientErrors = [];
    if (!name) clientErrors.push("Name is required");
    if (!email) clientErrors.push("Email is required");
    if (!phoneNumber) clientErrors.push("phoneNumber  is required");
    if (!password) clientErrors.push("Password is required");
    if (!photoFile) clientErrors.push("Profile photo is required");

    if (clientErrors.length) {
      // show to user (you can use state instead of alert)
      alert("Please fix: \n" + clientErrors.join("\n"));
      return;
    }

    // Build FormData
    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("phoneNumber", phoneNumber);
    payload.append("role", role);
    payload.append("password", password);
    payload.append("password_confirmation", password_confirmation);
    payload.append("gender", gender);
    payload.append("skills", skills);
    payload.append("countryId", countryId);
    payload.append("stateId", stateId);
    if (photoFile) payload.append("photo", photoFile);
    if (token) payload.append("token", token);

    for (const pair of payload.entries()) {
      console.log("FormData:", pair[0], pair[1]);
    }

    try {
      const url =
        "https://reactinterviewtask.codetentaclestechnologies.in/api/api/register";
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("REGISTER RESPONSE:", res.data);
      if (res.data?.success) {
        alert(res.data.message || "Registered successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        navigate("/List");
      } else {
        alert(res.data?.message || "Unexpected response");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response body:", err.response.data);

        // Extract messages (Laravel style or generic)
        let messages = [];
        const data = err.response.data;
        if (data?.errors && typeof data.errors === "object") {
          messages = Object.values(data.errors).flat();
        } else if (Array.isArray(data?.message)) {
          messages = data.message;
        } else if (data?.message) {
          messages = [data.message];
        } else {
          messages = [err.message || "Validation failed"];
        }

        alert(messages.join("\n"));
      } else {
        alert(err.message || "Network error");
      }
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
            <Personaldetails formData={formData} setFormData={setFormData} />
          </>
        );
      case 1:
        return (
          <>
            <Countrydetails formData={formData} setFormData={setFormData} />
          </>
        );
      case 2:
        return (
          <>
            <Skillsdetails formData={formData} setFormData={setFormData} />
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
                        if (!validators[activeStep]()) return; //  run validation first

                        if (activeStep === steps.length - 1) {
                          handleSubmit(); //  final step — submit to backend
                        } else {
                          setActiveStep((prev) => prev + 1); //  otherwise just go to next step
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
