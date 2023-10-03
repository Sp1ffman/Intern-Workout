import React from "react";
import { Form, Input, Button, message, Space } from "antd";
import { useNavigate } from "react-router-dom";

const NewClaimForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:8000/api/addclaim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Claim created successfully");

        navigate("/claimslist");
      } else {
        console.error("Error creating claim:", response.statusText);
        message.error("Error creating claim");
      }
    } catch (error) {
      console.error("Error creating claim:", error.message);
      message.error("Error creating claim");
    }
  };
  const handleCancel = () => {
    navigate("/claimslist");
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: "400px" }}
    >
      <Form.Item
        label="Patient ID "
        name="Id"
        rules={[{ required: true, message: "Please enter patient name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="User ID "
        name="user_id"
        rules={[{ required: true, message: "Please enter patient name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Patient "
        name="patient"
        rules={[{ required: true, message: "Please enter patient name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Filed Date"
        name="Filed_Date"
        rules={[{ required: true, message: "Please enter claim filed date" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Service Date"
        name="Service_Date"
        rules={[
          { required: true, message: "Please enter claim serviced date" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Visit Fee"
        name="Fees"
        rules={[{ required: true, message: "Please enter the visit fee" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Estimated Reimbursement After Deduction"
        name="reimbursement1"
        rules={[
          { required: true, message: "Please enter the reimbursement details" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Estimated Reimbursement For This Visit"
        name="reimbursement2"
        rules={[
          { required: true, message: "Please enter the reimbursement details" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Payer"
        name="payer_name"
        rules={[{ required: true, message: "Please enter payer name(if any)" }]}
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
  );
};

export default NewClaimForm;
