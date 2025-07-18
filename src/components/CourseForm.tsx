import React from "react";
import { Form, Input, Button } from "antd";
import type { Course } from "../types/CourseType";
import API from "../api/api";
import DrawerForm from "./DrawerForm";
import {
  PlusOutlined 
} from '@ant-design/icons';

type Props = {
  onCourseAdded: () => void;
};

const CourseForm: React.FC<Props> = ({onCourseAdded}) => {
    const [open, setOpen] = React.useState<boolean>(false);

  // const [form] = Form.useForm();
  // const onFinish = async (values: Course) => {
  //   console.log(values);
  //   try {
  //     const response = await API.post("/Course", values);
  //     // alert("Data Saved");
  //     onCourseAdded();
  //     form.resetFields();
  //     console.log("Data posted as", response.data);
  //   } catch (err) {
  //     console.log("Error occurs", err);
  //   }
  // };
  return (
    <>
      {/* <Form form={form} onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Course Name"
          name="name"
          rules={[{ required: true, message: "Please Enter the Course!" }]}
        >
          <Input placeholder="Please Enter the Course" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> */}
       <Button color="cyan" variant="solid" onClick={() =>{setOpen(true)}} style={{marginLeft:"20px"}}>
        <PlusOutlined />
            Add Course Name
          </Button>
           {open && (
        <DrawerForm
          open={open}
          setOpen={() => {
            setOpen(false);
            // setFormInitialValues(null);
          }}
          // initialValues={formInitialValues}
          // onSave={handleSave}
        />
      )}
    </>
  );
};

export default CourseForm;
