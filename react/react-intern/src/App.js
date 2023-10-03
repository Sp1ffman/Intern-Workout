import React, { useState } from "react";
import "./PasswordToggle";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClaimsList from "./ClaimsList";
import UpdateForm from "./UpdateForm";
import NewClaimForm from "./NewClaimForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router basename="/intern">
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        ></Route>
        <Route
          path="/claimslist"
          element={
            <ClaimsList
              setIsAuthenticated={setIsAuthenticated}
              isAuthenticated={isAuthenticated}
            />
          }
        ></Route>
        <Route path="/updateform/:id" element={<UpdateForm />}></Route>
        <Route path="/newclaim" element={<NewClaimForm />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
