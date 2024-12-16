import { Row, Col, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import logo from "../assets/logo/logo.svg";
import registerSvg from "../assets/logo/register.svg";
import "../assets/css/register.less";
import cupid from "../assets/audio/cupid.m4a";
import { Context } from "../Reducers/Context";
import React, { useContext, useState } from "react";
import { registerAction } from "../api/userActions";
import { useNavigate, Link } from "react-router-dom";
import { openMessageSuccess, openMessageError } from "../utils/Verifications";

const { Title } = Typography;

const Register = () => {
    let navigate = useNavigate();
    const { dispatch } = useContext(Context);
    let audio = new Audio(cupid);

    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    let checks = {
        firstname: [
            { required: true, message: "Please entre your firstname!" },
            { max: 30, message: "The firstname is too long !" },
            {
                pattern: new RegExp(/^[A-Za-z]{3,}$/),
                message:
                    "The FirstName must be contains letters only at least 3 letters !",
            },
        ],
        lastname: [
            { required: true, message: "Please entre your lastname!" },
            { max: 30, message: "The lastname is too long !" },
            {
                pattern: new RegExp(/^[A-Za-z]{3,}$/),
                message:
                    "The lastname must be contains letters only at least 3 letters !",
            },
        ],
        username: [
            { required: true, message: "Please entre your username!" },
            {
                max: 20,
                min: 3,
                message: "The username should be between 3 and 20 characters !",
            },
            {
                pattern: new RegExp(/^[a-zA-Z]+(([-_.]?[a-zA-Z0-9])?)+$/),
                message:
                    "The username must be contains letters or numbers ( -, _ or . ) !",
            },
        ],
        email: [
            { required: true, message: "Please entre your Email!" },
            {
                pattern: new RegExp(
                    /[a-zA-Z0-9-_.]{1,50}@[a-zA-Z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/
                ),
                message: "Invalid email address !",
            },
        ],
        password: [
            { required: true, message: "Please entre your Password!" },
            {
                pattern: new RegExp(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/
                ),
                message:
                    "The password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !",
            },
        ],
        confirmpassword: [
            {
                required: true,
                message: "Please Confirm your Password!",
            },
            {
                pattern: new RegExp(`${data.password}`),
                message: "Password dosnt match!",
            },
        ],
    };

    const handleSubmit = async () => {
        const res = await registerAction(data);

        message.loading("Loading...", 2);
        if (res.success) {
            openMessageSuccess(res.message);

            navigate("/login");
        } else {
            openMessageError(res.error);
        }
    };

    return (
        <Row>
            <Col xs={0} md={14} span={24}>
                <div id="left-container">
                    <Title level={1} id="title">
                        Find Your Lover
                    </Title>
                    <Title level={2} id="subtitle">
                        Get Started
                    </Title>
                    <img src={registerSvg} id="img" alt="register svg" />
                </div>
            </Col>
            <Col md={10} span={24} id="right-bg">
                <div id="right-container">
                    <img id="logo" alt="logo" src={logo}></img>
                    <Form
                        name="registerf"
                        id="form"
                        initialValues={{ remember: true }}
                        onFinish={handleSubmit}
                    >
                        <div id="add-margin-bottom">
                            <Form.Item name="firstname" rules={checks.firstname}>
                                <Input
                                    name="firstname"
                                    prefix={<UserOutlined />}
                                    placeholder="First name"
                                    onChange={(e) => setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    })}
                                    value={data.firstname}
                                />
                            </Form.Item>
                        </div>
                        <div id="add-margin-bottom">
                            <Form.Item name="lastname" rules={checks.lastname}>
                                <Input
                                    name="lastname"
                                    prefix={<UserOutlined />}
                                    placeholder="Last name"
                                    onChange={(e) => setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    })}
                                    value={data.lastname}
                                />
                            </Form.Item>
                        </div>
                        <div id="add-margin-bottom">
                            <Form.Item name="username" rules={checks.username}>
                                <Input
                                    name="username"
                                    prefix={<UserOutlined />}
                                    placeholder="Username"
                                    onChange={(e) => setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    })}
                                    value={data.username}
                                />
                            </Form.Item>
                        </div>
                        <div id="add-margin-bottom">
                            <Form.Item name="email" rules={checks.email}>
                                <Input
                                    name="email"
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                    onChange={(e) => setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    })}
                                    value={data.email}
                                />
                            </Form.Item>
                        </div>
                        <div id="last-margin-bottom">
                            <Form.Item name="password" rules={checks.password}>
                                <Input.Password
                                    autoComplete="on"
                                    name="password"
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    })}

                                />
                            </Form.Item>
                        </div>
                        <div id="last-margin-bottom">
                            <Form.Item rules={checks.confirmpassword} name="confirmpassword">
                                <Input.Password
                                    autoComplete="on"
                                    name="confirmpassword"
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm Password"
                                    value={data.confirmpassword}
                                    onChange={(e) => setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    })}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <Button
                                id="button"
                                type="primary"
                                htmlType="submit"
                                shape="round"
                            >
                                Register
                            </Button>
                        </Form.Item>

                        <div id="register-link">
                            <p className="font-size">
                                Already have an account? <Link to="/login">Log in</Link>
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

export default Register;
