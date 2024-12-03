import { Row, Col, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../assets/logo/logo.svg";
import loginSvg from "../assets/logo/login.svg";
import cupid from "../assets/audio/cupid.m4a";
import "../assets/css/login.less";
import { Context } from "../Reducers/Context";
import React, { useContext } from "react";
import { loginAction } from "../api/userActions";
import { useNavigate, Link } from "react-router-dom";
import { openMessageSuccess, openMessageError } from "../utils/Verifications";

const { Title } = Typography;

const Login = () => {
    let navigate = useNavigate();
    const { dispatch } = useContext(Context);
    let audio = new Audio(cupid);

    const checks = {
        username: [{ required: true, message: "Please enter your username!" }],
        password: [{ required: true, message: "Please enter your password!" }],
    };

    const submit = async (values) => {
        const res = await loginAction(values, dispatch);

        message.loading("Loading...", 2);
        if (res.success) {
            if (!res.isInfosComplete) {
                navigate("/steps");
                audio.play();
            } else {
                navigate("/home");
                audio.play();
            }

            openMessageSuccess(res.message);
        } else {
            openMessageError(res.error);
        }
    };



    return (
        <Row gutter={0}>
            <Col xs={0} md={14} span={24}>
                <div id="left-container">
                    <div id="titles">
                        <Title level={1} id="title">
                            Find Your Lover
                        </Title>
                        <Title level={2} id="subtitle">
                            Get Started
                        </Title>
                    </div>
                    <img id="img" alt="login svg" src={loginSvg} />
                </div>
            </Col>
            <Col md={10} span={24} id="right-bg">
                <div id="right-container">
                    <img id="logo" alt="logo" src={logo}></img>
                    <div id="oauth-div">
                    </div>
                    <Form
                        name="login"
                        id="form"
                        initialValues={{ remember: true }}
                        onFinish={submit}
                    >
                        <div id="add-margin-bottom">
                            <Form.Item name="username" checks={checks.username}>
                                <Input prefix={<UserOutlined />} placeholder="Username" />
                            </Form.Item>
                        </div>
                        <Form.Item name="password" checks={checks.password}>
                            <Input.Password
                                autoComplete="on"
                                prefix={<LockOutlined />}
                                placeholder="Password"
                            />
                        </Form.Item>

                        <div id="last-margin-bottom">
                            <Form.Item>
                                <Link
                                    to="/newpassword"
                                    className="font-size"
                                    id="forget-password"
                                >
                                    Forgot password?
                                </Link>
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <Button
                                id="button"
                                type="primary"
                                htmlType="submit"
                                shape="round"
                            >
                                Login
                            </Button>
                        </Form.Item>
                        <div id="register-link">
                            <p className="font-size">
                                No account? <Link to="/register">Create one</Link>
                            </p>
                        </div>
                    </Form>
                </div>
                <Col span={24}>
                    <div id="footer-links">
                        <Link to="/">About us</Link>
                        <Link to="/Policy">Policy</Link>
                        <Link to="/">Home</Link>
                    </div>
                </Col>
            </Col>
        </Row>
    );
};

export default Login;
