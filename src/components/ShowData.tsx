import React, { useState, useEffect } from "react";
import { Splitter, Select, Form, Input, Button, Table, Space } from "antd";
import StudentForm from "./StudentForm";
import CourseForm from "./CourseForm";
import DataCard from "./DataCard";
import CourseDataCard from "./CourseDataCard";
import { Flex, Layout } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import API from "../api/api";

interface DataType {
  key: string;
  cname: string;
}

const { Sider } = Layout;

const ShowData: React.FC = () => {
  // const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [ShowData, setShowData] = useState(false);
  const [ShowCourse, setCourse] = useState(false);
  const [tableData, setTableData] = useState<DataType[]>([]);

const fetchData = async () => {
  const result = await API.get("/Course");
  console.log(result.data)
  const tableData: DataType[] = result.data.map((item: any, index: number) => ({
    key: `${index}`,
    cname: result.data.name, 
  }));
  setTableData(tableData);
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
    // backgroundColor: "#1677ff",
    margin: "25px",
  };

  const triggerRefresh = () => setRefresh((prev) => !prev);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Course Name",
      dataIndex: "cname",
      key: "cname",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <EditOutlined onClick={() => handleEdit(record.key)} /> */}
          <Button
            danger
            type="text"
            className="dltbttn"
            // onClick={() => handleDelete(record.key)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Splitter
        style={{ height: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="60%" min="20%" max="70%">
          {/* <Flex justify='center' style={{width:"500px"}}><StudentForm onStudentAdded={triggerRefresh}/></Flex> */}
          <Form.Item label="Select" style={{ maxWidth: 700 }}>
            <Select onChange={handleForm} placeholder="Please select a option">
              <Select.Option value="course">Course Name</Select.Option>
              <Select.Option value="student">Students Details</Select.Option>
            </Select>
          </Form.Item>
          {ShowData && <StudentForm onStudentAdded={triggerRefresh} />}

          {/* ------------------------------------------------Course Form----------------------------------------- */}
          {ShowCourse && <CourseForm onCourseAdded={triggerRefresh} />}
        </Splitter.Panel>
        <Splitter.Panel>
          <Layout>
            <Sider width="50%" style={siderStyle}>
              <Table<DataType>
                columns={columns}
                dataSource={tableData}
                pagination={{ pageSize: 10 }}
                size="small"
                style={{ margin: "20px", color:"white" }}
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
