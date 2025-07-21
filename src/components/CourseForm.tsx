// CourseForm.tsx
import React from "react";
import { Button } from "antd";
import DrawerForm from "./DrawerForm";
import { PlusOutlined } from "@ant-design/icons";
import type { Course } from "../types/CourseType";

interface CourseFormProps {
  onSave?: (values: Course) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSave }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <Button
        color="cyan"
        variant="solid"
        onClick={() => {
          setOpen(true);
        }}
        style={{ marginLeft: "20px" }}
      >
        <PlusOutlined />
        Add Course Name
      </Button>
      {open && (
        <DrawerForm
          open={open}
          setOpen={() => {
            setOpen(false);
          }}
          onSave={onSave}
        />
      )}
    </>
  );
};

export default CourseForm;
