import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Avatar, Divider, Collapse, Button, Input } from "antd";
import { ReceivedMsg } from "../components/ReceivedMsg";
import { SentMsg } from "../components/SentMsg";
import { SendOutlined } from "@ant-design/icons";
import { Context } from "../Contexts/Context";
import { matchingAction, msgAction } from "../actions/chatActions";
import { socketConn as socket } from "../sockets";
import Layout from "../layout/default";

const { Panel } = Collapse;

const Chat = () => {
  const { state } = useContext(Context);
  const [matchers, setMatchers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState({
    userid: null,
    chatid: null,
  });
  const [messageToSend, setMessageToSend] = useState("");

  // Function to load messages for the active chat
  const loadMessages = async () => {
    console.log("Loading messages for chat ID:", activeChat.chatid);
    if (activeChat.chatid) {
      const res = await msgAction(state.token, activeChat.chatid);
      console.log("Response from msgAction:", res);
      if (res && res.success) {
        console.log("Loaded messages: ", res.data);
        setMessages(res.data);
      } else {
        console.error("Failed to load messages:", res);
      }
    }
  };

  // Function to open a chat and set it as active
  const openChat = (userid, chatid) => {
    console.log("Opening chat with User ID:", userid, " and Chat ID:", chatid);
    setActiveChat({ userid, chatid });
  };

  // Handle typing event
  const handleTyping = (e) => {
    setMessageToSend(e.target.value);
    console.log("Typing message:", e.target.value);
    if (e.target.value !== "") {
      console.log("Emitting typing event for chat ID:", activeChat.chatid);
      socket.emit("isTyping", { chatid: activeChat.chatid });
    }
  };

  // Handle sending message
  const handleSendMsg = () => {
    if (messageToSend.trim() !== "") {
      console.log("Sending message:", messageToSend);
      socket.emit("sendMessage", {
        message: messageToSend,
        sender: state.id,
        receiver: activeChat.userid,
        chat_id: activeChat.chatid,
      });
      setMessageToSend("");
      setTimeout(() => {
        loadMessages();
      }, 1000); // Adjust timeout if needed
    }
  };

  // Fetch matched users when component mounts
  useEffect(() => {
    console.log("Fetching matched users...");
    const fetchMatchers = async () => {
      console.log("State Token: ", state.token); // Log the token to verify
      const res = await matchingAction(state.token);
      console.log("Response from matchingAction:", res);
      if (res && res.success && res.users && res.users.length > 0) {
        setMatchers(res.users);
      } else {
        console.error("No matched users found or an error occurred:", res);
      }
    };
    fetchMatchers();
  }, [state.token]);


  // Set up socket listener for new messages
  useEffect(() => {
    console.log("Setting up socket listener for new messages...");
    socket.on("newMessage", (data) => {
      console.log("New message received via socket:", data);
      if (data.chat_id === activeChat.chatid) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      console.log("Cleaning up socket listener for new messages...");
      socket.off("newMessage");
    };
  }, [messages, activeChat.chatid]);

  return (
    <Layout>
      <Row justify="center">
        {/* Sidebar for conversations */}
        <Col lg={8} span={24} style={{ padding: "10px" }}>
          <Collapse
            defaultActiveKey={["0"]}
            accordion
            style={{ borderRadius: "15px", overflow: "auto" }}
          >
            <Panel header="Conversations :" key="0">
              <div
                style={{
                  padding: "0px",
                  height: "700px",
                  maxHeight: 700,
                  overflowY: "auto",
                  textAlign: "center",
                  borderRadius: "30px",
                }}
              >
                {matchers.map((item) => (
                  <Card
                    key={item.id}
                    hoverable
                    onClick={() => openChat(item.id, item.chatid)}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <Row align="middle">
                      <Avatar src={`https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/${item.profile}`} />
                      <h3 style={{ marginBottom: "0px", marginLeft: "10px" }}>
                        {item.lastname}_{item.firstname}
                      </h3>
                    </Row>
                  </Card>
                ))}
              </div>
            </Panel>
          </Collapse>
        </Col>

        {/* Main chat area */}
        <Col lg={14} span={24} style={{ height: "800px", padding: "10px" }}>
          <Card style={{ width: "100%", borderRadius: "15px", height: "100%" }}>
            <Divider />
            <Card
              style={{
                marginBottom: "15px",
                border: "none",
                maxHeight: 550,
                minHeight: 550,
                overflow: "scroll",
                overflowX: "hidden",
              }}
            >
              {/* Render messages */}
              {messages.map((item) =>
                item.user_id === state.id ? (
                  <SentMsg key={item.id} message={item} />
                ) : (
                  <ReceivedMsg key={item.id} message={item} />
                )
              )}
            </Card>

            {/* Input area for sending messages */}
            {activeChat.chatid && (
              <Row
                type="flex"
                style={{
                  alignItems: "center",
                  border: "1px solid #cdcd",
                  padding: "5px",
                  borderRadius: "15px",
                  width: "100%",
                }}
              >
                <Col xs={19} md={22} span={20}>
                  <Input
                    value={messageToSend}
                    onChange={handleTyping}
                    className="input-reply"
                    maxLength={100}
                    style={{
                      borderRadius: "13px",
                      height: "80px",
                      border: "none",
                      outline: "none",
                    }}
                    placeholder="Type a message here"
                  />
                </Col>
                <Col xs={4} md={2} span={2}>
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={handleSendMsg}
                    icon={<SendOutlined style={{ fontSize: "0.8rem" }} />}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Chat;
