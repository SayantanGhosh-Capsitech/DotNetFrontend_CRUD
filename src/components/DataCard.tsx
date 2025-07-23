import React, { useState, useEffect } from "react";
import { Card, Flex, Button, Modal, Input, Form, Radio, Select } from "antd";
import API from "../api/api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Student } from "../types/StudentType";
import type { Course } from "../types/CourseType";

type Props = {
  refresh: boolean;
};

const DataCard: React.FC<Props> = ({ refresh }) => {
  const [formdata, setFormdata] = useState<Student[] | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();
  // const { Option } = Select;

  const [allCourses, setAllCourses] = useState<Course[]>([]); // <-- Add this

  // Fetch all courses once when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await API.get("/Course");
        setAllCourses(result.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      form.setFieldsValue({
        ...editingStudent,
        courses: Array.isArray(editingStudent.courseDetail)
          ? editingStudent.courseDetail.map((c) => c.id) // <-- course IDs here
          : [],
      });
    }
  }, [editingStudent, form]);

  // Fetch data
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await API.get("/Students/course-details");
        setFormdata(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, [refresh]);

  // Delete function ------------------------------------
  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      await API.delete(`/Students/${id}`);
      setFormdata((prev) => (prev ? prev.filter((s) => s.id !== id) : null));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (student: Student) => {
    console.log("Editing student:", student);
    setEditingStudent(student);
    setIsModalVisible(true);
  };

  const onFinish = async (values: Partial<Student>) => {
    if (!editingStudent?.id) return;
    console.log("Updating student:", values);
    if (values.courses) {
    }
    const updatedStudent = {
      ...editingStudent,
      ...values,
      courses: values.courses, 
    };
    // if (updatedStudent.courses && typeof updatedStudent.courses === "string") {
    //   updatedStudent.courses = (updatedStudent.courses as string)
    //     .split(",")
    //     .map((c) => c.trim());
    // }
    try {
      await API.put(`/Students/${editingStudent.id}`, updatedStudent);
      setFormdata((prev) =>
        prev
          ? prev.map((s) => (s.id === editingStudent.id ? updatedStudent : s))
          : null
      );
      setIsModalVisible(false);
      setEditingStudent(null);
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };
  return (
    <>
      <Flex wrap gap="middle" style={{ margin: "20px" }} justify="center">
        {formdata && formdata.length > 0 ? (
          formdata.map((value) => (
            <Card
              key={value.id}
              style={{ width: "300px", border: "1px solid green" }}
            >
              <Flex justify="space-between">
                <Button type="primary" onClick={() => handleEdit(value)}>
                  <EditOutlined />
                </Button>
                <Button danger onClick={() => handleDelete(value.id)}>
                  <DeleteOutlined />
                </Button>
              </Flex>
              <p>Name: {value.name}</p>
              <p>Gender: {value.gender}</p>
              <p>Age: {value.age}</p>
              <p>Graduated: {value.isGraduated === true ? "Yes" : "No"}</p>
              <p>
                Courses:
                {Array.isArray(value.courseDetail)
                  ? value.courseDetail.map((course) => course.name).join(", ")
                  : "No courses"}
              </p>
            </Card>
          ))
        ) : (
          <Card style={{ width: 300 }}>
            <p>No data found</p>
          </Card>
        )}
      </Flex>

      {/* Edit Modal-------------------------------------------------*/}
      <Modal
        title="Edit Student"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        {editingStudent && (
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please input gender!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Age"
              name="age"
              rules={[{ required: true, message: "Please input age!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Graduated"
              name="isGraduated"
              rules={[
                { required: true, message: "Please select graduation status!" },
              ]}
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="courses"
              label="Courses"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                options={allCourses.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
                placeholder="Select courses"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => setIsModalVisible(false)}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default DataCard;
