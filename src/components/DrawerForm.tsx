import React, { useState, useEffect } from "react";
import { Form, Input, Button, Drawer, Space } from "antd";
import API from "../api/api";
import type { Course } from "../types/CourseType";

interface IOpen {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  initialValues?: Course | null;
  onSave?: (values: Course) => void;
  //  refresh: boolean;
}

const DrawerForm: React.FC<IOpen> = (props: IOpen) => {
  const [form] = Form.useForm();

  const onClose = () => {
    form.resetFields();
    props.setOpen(false);
  };

const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    
    if (props.initialValues && props.initialValues.id) {
      const response = await API.put(`/Course/${props.initialValues.id}`, values);
      console.log("Data updated as", response.data);
    } else {
      const response = await API.post("/Course", values);
      console.log("Data posted as", response.data);
    }

    form.resetFields();
    props.setOpen(false);

    if (props.onSave) {
      props.onSave(values);
    }

  } catch (err) {
    console.log("Error occurs", err);
  }
};


  useEffect(() => {
    if (props.initialValues) {
      form.setFieldsValue(props.initialValues);
      console.log("Initial values set:", props.initialValues);
    }
  }, [props.initialValues]);
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
        <Form
          form={form}
          style={{ maxWidth: 600 }}
          initialValues={props.initialValues || {}}
        >
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
