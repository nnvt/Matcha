import React from "react";
import "../assets/css/Profile.less";
import Layout from "../layout/default";
import UserInfo from "../components/UserInfo";
import { useParams } from "react-router-dom";

const User = (props) => {
  const { username } = useParams();

  return (
    <Layout>
      <UserInfo username={username} />
    </Layout>
  );
};

export default User;