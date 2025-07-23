import React, { useState, useEffect } from "react";
import {
  Splitter,
  Select,
  Form,
  Button,
  Table,
  Space,
  Layout,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import StudentForm from "./StudentForm";
import CourseForm from "./CourseForm";
import DataCard from "./DataCard";
import DrawerForm from "./DrawerForm";
import API from "../api/api";

import type { Course } from "../types/CourseType";
import type { TableProps } from "antd";

const { Sider } = Layout;

const ShowData: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [ShowData, setShowData] = useState(false);
  const [ShowCourse, setCourse] = useState(false);
  const [tableData, setTableData] = useState<Course[]>([]);
  const [formInitialValues, setFormInitialValues] = useState<Course | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Sync route path with component state
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/student")) {
      setShowData(true);
      setCourse(false);
    } else if (path.includes("/course")) {
      setCourse(true);
      setShowData(false);
    }
  }, [location.pathname]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const result = await API.get("/Course");
      const tableData: Course[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setTableData(tableData);
    } catch (err) {
      console.log("error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  const handleForm = (value: string) => {
    if (value === "student") {
      navigate("/student");
    } else {
      navigate("/course");
    }
  };

  const handleCourseDelete = async (id?: string) => {
    if (!id) return;
    try {
      await API.delete(`/Course/${id}`);
      setTableData((prev) => (prev ? prev.filter((s) => s.id !== id) : []));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id?: string) => {
    if (!id) return;
    const courseToEdit = tableData.find((course) => course.id === id);
    if (courseToEdit) {
      setFormInitialValues(courseToEdit);
      setOpen(true);
    }
  };

  const handleSave = (values: Course) => {
    console.log("Saving values:", values);
    triggerRefresh();
  };

  const columns: TableProps<Course>["columns"] = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "cname",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record.id)} />
          <Button
            danger
            type="text"
            className="dltbttn"
            onClick={() => handleCourseDelete(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    lineHeight: "120px",
    color: "#fff",
    margin: "25px",
  };

  return (
    <>
      <Splitter
        style={{ height: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <Form.Item label="Select" style={{ maxWidth: 700 }}>
            <Select
              onChange={handleForm}
              // value={ShowData ? "student" : "course"}
              placeholder="Please select an option"
            >
              <Select.Option value="course">Course Name</Select.Option>
              <Select.Option value="student">Students Details</Select.Option>
            </Select>
          </Form.Item>

          {ShowData && <StudentForm onStudentAdded={triggerRefresh} />}
          {ShowCourse && <CourseForm onSave={handleSave} />}

          {open && (
            <DrawerForm
              open={open}
              setOpen={() => setOpen(false)}
              initialValues={formInitialValues}
              onSave={handleSave}
            />
          )}
        </Splitter.Panel>

        <Splitter.Panel>
          <Layout style={{ display: "flex", justifyContent: "center" }}>
            {ShowCourse && (
              <Sider width="50%" style={siderStyle}>
                <Table<Course>
                  columns={columns}
                  dataSource={tableData}
                  pagination={{ pageSize: 10 }}
                  size="small"
                  style={{ margin: "20px", color: "white" }}
                  rowKey="id"
                />
              </Sider>
            )}
            {ShowData && <DataCard refresh={refresh} />}
          </Layout>
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default ShowData;
