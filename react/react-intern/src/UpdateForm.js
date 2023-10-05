import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message } from "antd";

const UpdateForm = () => {
  const [form] = Form.useForm();

  const { id } = useParams();
  const navigate = useNavigate();
  console.log("Patient Id:", id);

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/claims/updatepatient/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        message.success("Patient updated successfully");
        navigate("/claimslist");
      } else {
        console.error("Error updating patient:", response.statusText);
        message.error("Error updating patient");
      }
    } catch (error) {
      console.error("Error updating patient:", error.message);
      message.error("Error updating patient");
    }
  };
  const handleCancel = () => {
    navigate("/claimslist");
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Update Patient</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: "400px" }}
      >
        <Form.Item
          label="Patient Name"
          name="patient"
          rules={[{ message: "Please enter patient name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Filed Date"
          name="Filed_Date"
          rules={[{ message: "Please enter the filed date" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Service Date"
          name="Service_Date"
          rules={[{ message: "Please enter the Service date" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Visit fee"
          name="Fees"
          rules={[{ message: "Please enter the Visit Fee" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Update
            </Button>

            <Button type="default" htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default UpdateForm;
