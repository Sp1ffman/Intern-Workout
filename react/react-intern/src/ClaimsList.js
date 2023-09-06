import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input } from "antd";
import CustomSVG from "./CustomSvg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import FeesSvg from "./FeesSvg";
import "antd/dist/reset.css";
import "./ClaimsList.css";

const { Search } = Input;

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatCurrency(value) {
  return `$ ${value.toFixed(2)}`;
}

function ClaimsList({ setIsAuthenticated, isAuthenticated }) {
  const [claims, setClaims] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchClaimsData();
    }
  }, [setIsAuthenticated, navigate]);

  const fetchClaimsData = async () => {
    if (loading || allDataLoaded) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/getclaims", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims);

        if (data.claims.length === 0) {
          setAllDataLoaded(true);
        }
      } else {
        console.error("Error fetching claims data");
      }
    } catch (error) {
      console.error("Error fetching claims data", error);
    } finally {
      setLoading(false);
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
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        navigate("/login");
      });
  }

  const columns = [
    {
      title: <span style={{ color: "gray" }}>Filed Date</span>,
      dataIndex: "Filed_Date",
      key: "Filed_Date",
      width: 125,
      sorter: (a, b) => a.Filed_Date.localeCompare(b.Filed_Date),
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <span>
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="sm"
            style={{ color: "#0c7c04" }}
          />{" "}
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: <span style={{ color: "gray" }}>Patient</span>,
      dataIndex: "patient",
      key: "patient",
      width: 225,
      sorter: (a, b) => (a.patient || "").localeCompare(b.patient || ""),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <span>
          <CustomSVG size={16} />
          <a href="#" className="a-style">
            {" "}
            {text}
          </a>
        </span>
      ),
    },
    {
      title: <span style={{ color: "gray" }}>Service Date</span>,
      dataIndex: "Service_date",
      key: "Service_date",
      width: 145,

      sorter: (a, b) => a.Service_date.localeCompare(b.Service_date),
      sortDirections: ["ascend", "descend"],
      render: (text) => formatDate(text),
    },
    {
      title: <span style={{ color: "gray" }}>Visit Fee</span>,
      dataIndex: "Fees",
      key: "Fees",
      width: 150,
      sorter: (a, b) => a.Fees - b.Fees,
      sortDirections: ["ascend", "descend"],
      render: (value) => (
        <span>
          <FeesSvg size={22} /> {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: (
        <div style={{ color: "gray" }}>
          Estimated Reimbursement After Deduction
        </div>
      ),
      dataIndex: "reimbursement1",
      key: "reimbursement1",
      width: 350,
      sorter: (a, b) => (a.reimbursement1 || 0) - (b.reimbursement1 || 0),
      sortDirections: ["ascend", "descend"],
      render: (text) =>
        text === "Verify Benefits" ? (
          <a href="#" className="a-style">
            {text}
          </a>
        ) : (
          text
        ),
    },
    {
      title: <div style={{ color: "gray" }}>Reimbursement For This Visit</div>,
      dataIndex: "reimbursement2",
      key: "reimbursement2",
      width: 350,
      sorter: (a, b) => (a.reimbursement2 || 0) - (b.reimbursement2 || 0),
      sortDirections: ["ascend", "descend"],
      render: (text) =>
        text === "Verify Benefits" ? (
          <a href="#" className="a-style">
            {text}
          </a>
        ) : (
          text
        ),
    },
    {
      title: <div style={{ color: "gray" }}>Payer</div>,
      dataIndex: "payer_name",
      key: "payer_name",
      width: 150,
      sorter: (a, b) => (a.payer_name || "").localeCompare(b.payer_name || ""),
      sortDirections: ["ascend", "descend"],
    },
  ];

  const filteredClaims = claims.filter((claim) =>
    Object.values(claim).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );
  const rowClassName = (row, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  return (
    <div>
      <div className="w3-container">
        <Search
          placeholder="Search"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginBottom: 16 }}
        />

        <Table
          dataSource={filteredClaims}
          className="claims-table"
          columns={columns}
          pagination={false}
          locale={{
            triggerDesc: "",
            triggerAsc: "",
            cancelSort: "",
          }}
          rowClassName={rowClassName}
          scroll={{ y: 400 }}
        />

        {loading && <div>Loading...</div>}
        {allDataLoaded && !loading && <div>All data loaded.</div>}
      </div>
    </div>
  );
}

export default ClaimsList;
