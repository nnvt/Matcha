import React from "react";
import { Typography, Button, Row, Col } from "antd";

import { useNavigate } from "react-router-dom";
import landing from "../assets/logo/homepage.svg";


const { Paragraph, Title } = Typography;


const Begin = () => {
    let navigate = useNavigate();
    return (
        <Row style={{ alignItems: "center" }}>
            <Col lg={7} span={20} className="text">
                <Title
                    strong
                    style={{
                        fontSize: 50,
                        color: "white",
                    }}
                >
                    Onlyfans
                </Title>
                <Paragraph style={{ color: "#f5f1f1" }}>
                    ///////////////////////////////////
                </Paragraph>
                <Row>
                    <Col md={11} span={24} style={{ marginBottom: "10px", marginRight: "10px" }}> {/* Thêm marginRight để tạo khoảng cách ngang giữa các nút */}
                        <Button
                            id="button"
                            type=""
                            htmlType="submit"
                            shape="round"
                            style={{
                                color: "#d9374b",
                                width: "100%", // Đảm bảo nút chiếm hết chiều rộng của Col
                                borderRadius: "15px", // Giảm border-radius để tạo hình chữ nhật nhẹ
                                height: "45px", // Giảm chiều cao của nút
                                fontSize: "16px", // Giảm kích thước chữ
                                display: "flex",
                                alignItems: "center", // Căn giữa chữ theo chiều dọc
                                justifyContent: "center", // Căn giữa chữ theo chiều ngang
                            }}
                            onClick={() => navigate("/login")}
                            block // Đảm bảo nút chiếm toàn bộ chiều rộng Col
                        >
                            LOGIN
                        </Button>
                    </Col>

                    <Col md={11} span={24} style={{ marginBottom: "10px" }}>
                        <Button
                            id="button"
                            type="ghost"
                            htmlType="submit"
                            shape="round"
                            style={{
                                color: "white",
                                width: "100%", // Đảm bảo nút chiếm hết chiều rộng của Col
                                borderRadius: "15px", // Giảm border-radius để tạo hình chữ nhật nhẹ
                                height: "45px", // Giảm chiều cao của nút
                                fontSize: "16px", // Giảm kích thước chữ
                                display: "flex",
                                alignItems: "center", // Căn giữa chữ theo chiều dọc
                                justifyContent: "center", // Căn giữa chữ theo chiều ngang
                            }}
                            onClick={() => navigate("/register")}
                            block // Đảm bảo nút chiếm toàn bộ chiều rộng Col
                        >
                            Register
                        </Button>
                    </Col>

                </Row>
            </Col>
            <Col xs={0} lg={14} span={20} className="intro">
                <div className="intro">
                    <img
                        style={{
                            width: "100%",
                            maxWidth: "800px",
                            marginBottom: "60px",
                            marginTop: "0",
                        }}
                        id="img"
                        alt="login svg"
                        src={landing}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default Begin;
