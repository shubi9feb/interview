import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import List from "./pages/List";
import Stepperform from "./pages/Stepperform";
import Product from "./pages/sales/Listproduct";
import Addproduct from "./pages/sales/Addproduct";
import PrivateRoute from "./routes/PrivateRoute.js";
function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/List"
              element={
                <PrivateRoute allowedRoles="admin">
                  <List />
                </PrivateRoute>
              }
            />

            <Route
              path="/Stepperform"
              element={
                <PrivateRoute allowedRoles="admin">
                  <Stepperform />
                </PrivateRoute>
              }
            />

            <Route
              path="/Product"
              element={
                <PrivateRoute allowedRoles="admin">
                  <Product />
                </PrivateRoute>
              }
            />

            <Route
              path="/Add-product"
              element={
                <PrivateRoute allowedRoles="admin">
                  <Addproduct />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
