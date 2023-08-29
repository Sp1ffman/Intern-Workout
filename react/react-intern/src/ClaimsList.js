import React, { useState, useEffect } from "react";

import "./ClaimsList.css";
import { Navigate, useNavigate } from "react-router-dom";
function ClaimsList({ setIsAuthenticated, isAuthenticated }) {
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchClaimsData();
    }
  }, [setIsAuthenticated, navigate]);
  const fetchClaimsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getclaims", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims);
      } else {
        console.error("Error fetching claims data");
      }
    } catch (error) {
      console.error("Error fetching claims data", error);
    }
  };

  if (!isAuthenticated) {
    if (localStorage.getItem("token")) localStorage.removeItem("token");
    fetch("http://localhost:8000/api/logout", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        navigate("/");
      });

    return <Navigate to="/" />;
  }
  return (
    <div className="claims-list">
      <table className="claims-table">
        <thead>
          <tr>
            <th>Filed Date</th>
            <th>Patient</th>
            <th>Fees</th>
            <th>Service Date</th>
            <th>Estimated Reimbursement After Deduction</th>
            <th>Reimbursement for This Visit</th>
            <th>Payer</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.Id}>
              <td>{new Date(claim.Filed_Date).toLocaleDateString()}</td>
              <td>{claim.patient}</td>
              <td>{claim.Fees}</td>
              <td>{new Date(claim.Service_date).toLocaleDateString()}</td>
              <td>{claim.reimbursement1}</td>
              <td>{claim.reimbursement2}</td>
              <td>{claim.payer_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClaimsList;
