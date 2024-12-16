import React from "react";
import { Result, Button } from "antd";

const Warning = () => {
    return (
        <Result
            status="warning"
            title="There are some problems with your operation."
            extra={<div>
                <Button style={{ fontSize: "0.6rem" }} type="primary" key="login">
                    Login
                </Button>
            </div>}
        />
    );
};

export default Warning;
