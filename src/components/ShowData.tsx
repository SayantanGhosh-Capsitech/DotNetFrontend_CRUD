import React, { useState, useEffect } from "react";
import { Splitter, Select, Form, Input, Button, Table, Space } from "antd";
import StudentForm from "./StudentForm";
import CourseForm from "./CourseForm";
import DataCard from "./DataCard";
import type { Course } from "../types/CourseType";
import { Layout } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import API from "../api/api";
import DrawerForm from "./DrawerForm";

const { Sider } = Layout;

const ShowData: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [ShowData, setShowData] = useState(false);
  const [ShowCourse, setCourse] = useState(false);
  const [tableData, setTableData] = useState<Course[]>([]);
  const [formInitialValues, setFormInitialValues] = useState<Course | null>(
    null
  );
  const [open, setOpen] = React.useState<boolean>(false);

  const fetchData = async () => {
    try {
      const result = await API.get("/Course");
      console.log("GET data", result.data);
      const tableData: Course[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setTableData(tableData);
    } catch (err) {
      console.log("error");
    }
  };

  const handleCourseDelete = async (id?: string) => {
    console.log("Delete clicked for id:", id);
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
    console.log("Edit clicked for id:", id);
    const courseToEdit = tableData.find((course) => course.id === id);
    console.log("Course to edit:", courseToEdit);
    if (courseToEdit) {
      setFormInitialValues(courseToEdit);
      console.log("Setting form initial values:", formInitialValues?.id);
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleForm = (value: string) => {
    if (value === "student") {
      setCourse(false);
      setShowData(true);
    } else {
      setShowData(false);
      setCourse(true);
    }
  };
  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    lineHeight: "120px",
    color: "#fff",
    // backgroundColor: "#9dc6ffff",
    margin: "25px",
  };
const handleSave = (values: Course) => {
  console.log("Saving values:", values);
  triggerRefresh(); 
};

  const triggerRefresh = () => setRefresh((prev) => !prev);
  const columns: TableProps<Course>["columns"] = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "cname",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <EditOutlined onClick={() => handleEdit(record.id)} />
            <Button
              danger
              type="text"
              className="dltbttn"
              onClick={() => {
                console.log("clicked for id:", record.id);
                handleCourseDelete(record.id);
              }}
            >
              <DeleteOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <Splitter
        style={{ height: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <Form.Item label="Select" style={{ maxWidth: 700 }}>
            <Select onChange={handleForm} placeholder="Please select a option">
              <Select.Option value="course">Course Name</Select.Option>
              <Select.Option value="student">Students Details</Select.Option>
            </Select>
          </Form.Item>
          {ShowData && <StudentForm onStudentAdded={triggerRefresh} />}
          {open && (
            <DrawerForm
              open={open}
              setOpen={() => {
                setOpen(false);
              }} 
              initialValues={formInitialValues}
              onSave={handleSave}
              // refresh={refresh}
            />
          )}

          {/* ------------------------------------------------Course Form----------------------------------------- */}
          {ShowCourse && <CourseForm onSave={handleSave} />}
        </Splitter.Panel>
        <Splitter.Panel>
          <Layout>
            <Sider width="50%" style={siderStyle}>
              <Table<Course>
                columns={columns}
                dataSource={tableData}
                pagination={{ pageSize: 10 }}
                size="small"
                style={{ margin: "20px", color: "white" }}
              />
            </Sider>
            <DataCard refresh={refresh} />
          </Layout>
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default ShowData;
