import React, { useState, useEffect, useContext } from "react";
import { List, Avatar, Spin, Tag } from "antd";
import { Link } from "react-router-dom";
import { Context } from "../Reducers/Context";
import { historyAction } from "../api/editActions";
import { EnvironmentOutlined } from "@ant-design/icons";

export const History = () => {
  const { state } = useContext(Context);
  const [Historique, setHistorique] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await historyAction(state.token);

      if (res.success) {
        await setHistorique(res.data);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <List
        dataSource={Historique}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar src={`${process.env.REACT_APP_API_URL}/` + item.profile} />
              }
              title={
                // eslint-disable-next-line
                <Link to={`/profile/${item.username}`}>{item.firstname} {item.lastname}</Link>
              }
              description={item.age + " y.o"}
            />
            <div id="location">
              <Tag
                icon={<EnvironmentOutlined />}
              >{`${item.city}, ${item.country}`}</Tag>
            </div>
          </List.Item>
        )}
      >
        {Historique.loading && Historique.hasMore && (
          <div className="demo-loading-container">
            <Spin />
          </div>
        )}
      </List>
    </>
  );
};