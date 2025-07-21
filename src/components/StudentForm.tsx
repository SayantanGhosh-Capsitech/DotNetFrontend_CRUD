import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Select, InputNumber } from "antd";
import API from "../api/api";
import type { Student } from "../types/StudentType";
import type { Course } from "../types/CourseType";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const { Option } = Select;
type Props = {
  onStudentAdded: () => void;
};

const StudentForm: React.FC<Props> = ({ onStudentAdded }) => {
  const [courseName, setCourseName] = useState<Course[] | null>(null);

  useEffect(() => {
    const coursedata = async () => {
      try {
        const result = await API.get("/Course");
        setCourseName(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    coursedata();
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values: Student) => {
    console.log(values);
    try {
      const response = await API.post("/students", values);
      // alert("Data Saved");
      onStudentAdded();
      form.resetFields();
      console.log("Data posted as", response.data);
    } catch (err) {
      console.log("Error occurs", err);
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        variant="underlined"
        style={{ maxWidth: 600 }}
      >
        <p
          style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}
        >
          Student Data
        </p>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please Enter your Name" }]}
        >
          <Input placeholder="Enter Your Name" />
        </Form.Item>

        <Form.Item
          label="Graduated"
          name="isGraduated"
          rules={[{ required: true, message: "Please select field" }]}
        >
          <Radio.Group>
            <Radio value={true}> Yes </Radio>
            <Radio value={false}> No </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="courses"
          label="Courses"
          rules={[{ required: true, message: "Please select Course!" }]}
        >
          <Select placeholder="select your course" mode="multiple">
            {courseName?.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[
            {
              type: "number",
              min: 0,
              max: 99,
              required: true,
              message: "Enter Your Valid Age",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default StudentForm;
