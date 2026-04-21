import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Container,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import { addUserValidation } from "../validations/index";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {userService} from "../services/api"
const pageInfo = {
  Subscribe: {
    title: "Register",
    desc: "Register to access wildlife detection platform",
  },
};

export default function Register() {
  const info = pageInfo["Subscribe"];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      await addUserValidation.parseAsync(formData);
    } catch (error) {
      const fieldErrors = {};
      error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await userService.register(formData);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      if(error.response?.data.message)
      toast.error(error.response?.data?.message );
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
    <Box>
      <Typography variant="h3" gutterBottom fontWeight={800}>
        {info.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {info.desc}
      </Typography>

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
        <Box component="form">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />

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
            label="Phone Number"
            name="phone"
            type="tel"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+254</InputAdornment>
              ),
            }}
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            required
          />
          <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
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
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Have an account?{" "}
              <Link component={RouterLink} to="/login" color="primary">
                Log in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  </Container>
</Box>
  );
}
