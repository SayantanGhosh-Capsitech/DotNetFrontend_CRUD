import React, { useState, useEffect } from "react";
import { Card, Flex, Button, Modal, Input, Form, Radio } from "antd";
import API from "../api/api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Student } from "../types/StudentType";

type Props = {
  refresh: boolean;
};

const DataCard: React.FC<Props> = ({ refresh }) => {
  const [formdata, setFormdata] = useState<Student[] | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch data 
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await API.get("/Students");
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
    setEditingStudent(student);
    setIsModalVisible(true);
  };

  const onFinish = async (values: Partial<Student>) => {
    if (!editingStudent?.id) return;

    const updatedStudent = { ...editingStudent, ...values };

    if (updatedStudent.courses && typeof updatedStudent.courses === "string") {
      updatedStudent.courses = (updatedStudent.courses as string)
        .split(",")
        .map((c) => c.trim());
    }
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
                {Array.isArray(value.courses)
                  ? value.courses.join(", ")
                  : value.courses}
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
          <Form
            layout="vertical"
            initialValues={editingStudent}
            onFinish={onFinish}
          >
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

            <Form.Item label="Courses" name="courses">
              <Input />
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
