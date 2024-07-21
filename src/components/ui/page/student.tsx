import React from "react";
import Layout from ".";

export interface StudentLayoutProps {
  title: string;
}

const StudentPage = (props: React.PropsWithChildren<StudentLayoutProps>) => {
  return (
    <Layout title={props.title} requiredRoles={["student"]}>
      {props.children}
    </Layout>
  );
};

export default StudentPage;
