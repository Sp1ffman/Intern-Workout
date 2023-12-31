import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Button, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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

export default function ClaimsList({ setIsAuthenticated, isAuthenticated }) {
  const [claims, setClaims] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const paginationProps = {
    ...pagination,
    total: claims.length,
    position: ["bottomCenter"],
    showSizeChanger: true,
  };

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
      const response = await fetch(
        "http://localhost:8000/api/claims/getclaims",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
    fetch("http://localhost:8000/api/user/logout", {
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
      sorter: (a, b) => a.patient.localeCompare(b.patient),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <span>
          <CustomSVG size={16} />
          <a href="#" className="a-style">
            {" "}
            {text}
          </a>
          <p>
            <Button type="link" onClick={() => handleUpdatePatient(record)}>
              Update
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this patient?"
              onConfirm={() => handleDeletePatient(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </p>
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
      sorter: (a, b) => a.reimbursement1.localeCompare(b.reimbursement1),
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
      sorter: (a, b) => a.reimbursement2.localeCompare(b.reimbursement2),
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
      sorter: (a, b) => a.payer_name.localeCompare(b.payer_name),
      sortDirections: ["ascend", "descend"],
    },
  ];

  const handleUpdatePatient = (record) => {
    navigate(`/updateform/${record.Id}`);
  };
  const handleNewClaim = () => {
    navigate("/newclaim");
  };

  const handleDeletePatient = async (record) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/claims/deletepatient/${record.Id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        message.success("Patient deleted successfully");
        fetchClaimsData();
      } else {
        console.error("Error deleting patient:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting patient:", error.message);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const searchTextLowerCase = searchText.toLowerCase();
    return Object.keys(claim).some((key) => {
      const value = claim[key];
      if (typeof value === "string") {
        if (key === "Filed_Date" || key === "Service_date") {
          const formattedDate = formatDate(value).toLowerCase();
          return formattedDate.includes(searchTextLowerCase);
        } else {
          return value.toLowerCase().includes(searchTextLowerCase);
        }
      } else if (typeof value === "number" && key === "Fees") {
        return value.toString().includes(searchTextLowerCase);
      }
      return false;
    });
  });

  const rowClassName = (row, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const handleTableChange = (newPage) => {
    setPagination(newPage);
  };

  return (
    <div>
      <Search
        placeholder="Search"
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
        enterButton="Search"
        maxLength={50}
        showCount
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={handleNewClaim}>
        New
      </Button>

      <div>
        <Table
          dataSource={filteredClaims}
          className="claims-table"
          columns={columns}
          pagination={paginationProps}
          onChange={handleTableChange}
          rowClassName={rowClassName}
          scroll={{ y: 400 }}
          locale={{
            triggerDesc: "",
            triggerAsc: "",
            cancelSort: "",
          }}
        />

        {loading && <div>Loading...</div>}
        {allDataLoaded && !loading && <div>All data loaded.</div>}
      </div>
    </div>
  );
}
