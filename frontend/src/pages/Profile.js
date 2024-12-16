import React from "react";
import "../assets/css/Profile.less";
import Layout from "../layout/default";
import UserProfile from "../components/Userprofile";

const Profile = () => {
  return (
    <Layout>
      <UserProfile />
    </Layout>
  );
};

export default Profile;