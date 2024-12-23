import React from "react";
import { Layout, Carousel } from "antd";
import logo from "../assets/logo/logo.svg";
import "../assets/css/Homepage.less";
import About from "../components/About";
import Begin from "../components/Begin";
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
const { Header, Content, Footer } = Layout;

const HomePage = () => {
    return (
        <Layout>
            <Header
                style={{
                    position: "fixed",
                    zIndex: 1,
                    width: "100%",
                    background: "#f5f1f1",
                    textAlign: "center",
                }}
            >
                <img className="logo" alt="logo" src={logo}></img>
            </Header>
            <Content
                className="site-layout"
                style={{ padding: "0", marginTop: "64px" }}
            >
                <Carousel autoplay className="carousel">
                    <Begin />
                    <About />
                </Carousel>
            </Content>
            <Footer
                style={{
                    textAlign: "center",
                    background: "#f5f1f1",
                    color: "#d9374b",
                }}
            >
                OnlyFans Made with <i className="las la-lg la-heart" />
            </Footer>
        </Layout>
    );
};

export default HomePage;
