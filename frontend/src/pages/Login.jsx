import { useState } from "react";
import { z, ZodError } from "zod";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useAuthStore } from "../store";
import { authService } from "../services/api";
import { loginValidation } from "../validations";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, setLoginAttempts } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    try {
      loginValidation.parse(formData);
      setLoginAttempts();
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
      return;
    }

    setLoading(true);
    try {
      await authService.login(formData);
      const userData = await authService.getMe();
      login(userData.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #6366F1, #EC4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            HWCR System
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Wildlife Camera Recognition
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            transition: "all 0.3s",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access the dashboard
          </Typography>

          <Box component="form">
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="button"
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Box
                  alignItems={"center"}
                  display={"flex"}
                  justifyContent={"space-around"}
                  marginTop={"1rem"}
                >
                  <Link component={RouterLink} to="/register" color="primary">
                    Register here
                  </Link>
                  <Link component={RouterLink} to="/subscribe" color="primary">
                    Subscribe here
                  </Link>
                </Box>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 3 }}
        >
          © 2026 HWCR System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
