import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Space,
} from "antd";
import API from "../api/api";

interface IOpen {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  //   initialValues?: PartyFormValues | null;
  //   onSave?: (values: PartyFormValues) => void;
}

const DrawerForm: React.FC<IOpen> = (props: IOpen) => {
  const [form] = Form.useForm();
  //   const onFinish = async (values: Course) => {
  //     console.log(values);
  //     try {
  //       const response = await API.post("/Course", values);
  //       // alert("Data Saved");
  //       onCourseAdded();
  //       form.resetFields();
  //       console.log("Data posted as", response.data);
  //     } catch (err) {
  //       console.log("Error occurs", err);
  //     }
  //   };

  const onClose = () => {
    form.resetFields();
    props.setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
    const response = await API.post("/Course", values);
        // alert("Data Saved");
        // onCourseAdded();
        form.resetFields();
        console.log("Data posted as", response.data);
      } catch (err) {
        console.log("Error occurs", err);
      }
    }
  return (
    <>
      <Drawer
        title="Add Course Name"
        width={820}
        onClose={() => onClose()}
        open={props.open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => onClose()}>Cancel</Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              type="primary"
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} style={{ maxWidth: 600 }}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true, message: "Please Enter the Course!" }]}
          >
            <Input placeholder="Please Enter the Course" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default DrawerForm;
