import React, { useState, useEffect } from "react";
import { Card, Flex, Button } from "antd";
import API from "../api/api";
import type { Course } from "../types/CourseType";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
  refresh: boolean;
};

const CourseDataCard: React.FC<Props> = (refresh) => {
  const [coursedata, setCoursedata] = useState<Course[] | null>(null);

  useEffect(() => {
    const coursedata = async () => {
      try {
        const result = await API.get("/Course");
        setCoursedata(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    coursedata();
  }, [refresh]);

  const handleCourseDelete = async (id?: string) => {
    if (!id) return;

    try {
      await API.delete(`/Course/${id}`);
      setCoursedata((prev) => (prev ? prev.filter((s) => s.id !== id) : null));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Flex wrap gap="middle" style={{ margin: "20px",padding:0 }} justify="center">
        {coursedata && coursedata.length > 0 ? (
          coursedata.map((val) => (
            <Card
              key={val.id}
              style={{ width: "200px", border: "1px solid ", margin:0, borderRadius:"6px" }}
              bodyStyle={{ padding: 0 }}
            >
              <Flex justify="space-between" style={{padding:0, alignItems:"center" }}>
                <p style={{marginLeft:"8px", padding:0}}>{val.name}</p>
                <Button danger onClick={() => handleCourseDelete(val.id)} size="small" style={{margin:"8px"}}>
                  <DeleteOutlined />
                </Button>
              </Flex>
            </Card>
          ))
        ) : (
          <Card style={{ width: 300 }}>
            <p>No data found</p>
          </Card>
        )}
      </Flex>
    </>
  );
};

export default CourseDataCard;
