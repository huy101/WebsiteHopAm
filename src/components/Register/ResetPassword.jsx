import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/authActions";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [notification, setNotification] = useState({
    type: "",
    content: "",
  });

  // Reset thông báo khi form được mở lại
  useEffect(() => {
    setNotification({ type: "", content: "" });
  }, []);

  const handleBlur = () => {
    setNotification({ type: "", content: "" }); // Reset notification khi blur
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      setNotification({
        type: "success",
        content: message,
      });
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      setNotification({
        type: "error",
        content: error,
      });
    }
  }, [error]);

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Đặt lại mật khẩu
      </Typography>

      <form onSubmit={handleSubmit} onBlur={handleBlur}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          style={{ marginBottom: "20px" }}
        />
        
        {notification.content && (
          <Box
            display="flex"
            alignItems="center"
            style={{
              color: notification.type === "success" ? "green" : "red",
            }}
          >
            <Alert severity={notification.type}>
              {notification.content}
            </Alert>
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
