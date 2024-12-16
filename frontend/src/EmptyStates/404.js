import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    let navigate = useNavigate();

    const handlClick = () => {
        navigate("/");
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button
                    style={{ fontSize: "0.6rem" }}
                    type="primary"
                    onClick={handlClick}>
                    Back Home
                </Button>
            }
        />
    );
};

export default Page404;
