import React from "react";
import { Card, Col, Row } from "antd";

const About = () => {
    return (
        <Row
            style={{
                width: "100%",
                textAlign: "center",
                margin: "25vh 20px",
            }}
        >
            <div>
                <span style={{ color: "white", fontSize: "60px" }}>About us</span>
                <Row gutter={[16, 16]} className="site-card-wrapper">
                    <Col xs={16} lg={7} span={24}>
                        <Card
                            title="/////////"
                            bordered={false}
                            id="card"
                        >
                            /////////
                        </Card>
                    </Col>
                    <Col xs={16} lg={7} span={24}>
                        <Card title="/////////" bordered={false} id="card">
                            ///////////////////
                        </Card>
                    </Col>
                    <Col xs={16} lg={7} span={24}>
                        <Card
                            title="/////////////////"
                            bordered={false}
                            id="card"
                        >
                            //////////////////////
                        </Card>
                    </Col>
                </Row>
            </div>
        </Row>
    );
};

export default About;
