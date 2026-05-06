import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  MenuItem
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Videocam as VideocamIcon,
  AddCircleOutline as AddIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { cameraService, organizationService } from "../services/api";
import toast from "react-hot-toast";
import { addCameraValidation } from "../validations/index";
import { useAuthStore , useOrganizationStore} from "../store/index";

const EMPTY_FORM = { name: "", location: "", streamUrl: "" };

export default function Cameras() {
  const [cameras, setCameras] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { organizations, setOrganizations } = useOrganizationStore();
  const{getAllOrganizations} = organizationService
  
  const role = user?.roleName;
  if (role !== "admin" && role !== "superadmin") {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You do not have permission to view this page.
        </Typography>
      </Box>
    );
  }
  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const res = await cameraService.getAll();
      setCameras(res.data);
      console.log("Fetched cameras:", res.data);
    } catch (err) {
      toast.error("Failed to load cameras");
    }
  };
  const fetchOrganizations = async () => {
    try {
      const res = await organizationService.getAllOrganizations();
      setOrganizations(res.data);
    } catch (err) {
      toast.error("Failed to load organizations");
    }
  }

  const handleToggleStatus = async (camera) => {
    try {
      await cameraService.updateStatus({
        id: camera.id,
        isActive: !camera.isActive,
      });
      toast.success(`Camera ${camera.isActive ? "deactivated" : "activated"}`);
      fetchCameras();
    } catch (err) {
      toast.error(
        err.response?.status === 403
          ? "You are not authorized to update this camera"
          : "Failed to update camera status",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await cameraService.delete(deleteTarget.id);
      toast.success(`Camera "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchCameras();
    } catch (err) {
      toast.error(
        err.response?.status === 403
          ? "You are not authorized to delete this camera"
          : "Failed to delete camera",
      );
    }
  };

  const handleAddCamera = async () => {
    setFormErrors({});
    setSubmitting(true);

    try {
      const data = await addCameraValidation.parseAsync(form);
      
      await cameraService.create(data);
      toast.success(`Camera "${data.name}" added`);
      setAddOpen(false);
      setForm(EMPTY_FORM);
      fetchCameras();
    } catch (err) {
      // Zod validation error
      if (err?.name === "ZodError") {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          const field = e.path[0];
          if (field) fieldErrors[field] = e.message;
        });
        setFormErrors(fieldErrors);
        return;
      }

      toast.error(
        err.response?.status === 403
          ? "You are not authorized to add cameras"
          : "Failed to add camera",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleCloseAdd = () => {
    setAddOpen(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };
  const allCameras = cameras?.allCameras ?? [];

  const filtered = allCameras.filter((c) =>
    `${c?.name || ""} ${c?.location || ""} ${c?.streamUrl || ""}`
      .toLowerCase()
      .includes(search?.toLowerCase() ?? ""),
  );
  //if user ! superadmin show only cameras from their organization still on the filtered list
  if (role !== "superadmin") {
    filtered = filtered.filter((c) => c.organizationId === user.organizationId);
  }

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography variant="h3" fontWeight={800}>
          Cameras
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setAddOpen(true);
            fetchOrganizations();
          }}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Add Camera
        </Button>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage and monitor your wildlife camera network
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip
          icon={<VideocamIcon />}
          label={`${cameras.length} Total`}
          variant="outlined"
        />
        <Chip
          label={`${allCameras.filter((c) => c.isActive).length} Active`}
          color="success"
          variant="outlined"
        />
        <Chip
          label={`${allCameras.filter((c) => !c.isActive).length} Inactive`}
          color="warning"
          variant="outlined"
        />
      </Stack>

      <Card>
        <CardContent>
          <TextField
            size="small"
            placeholder="Search by name, location, stream URL..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ mb: 2, width: 360 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Name",
                    "Location",
                    "Stream URL",
                    "Status",
                    "Added",
                    "Actions",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 11,
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 6, color: "text.secondary" }}
                    >
                      No cameras found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {c.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {c.location ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.streamUrl ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={c.isActive ? "success" : "warning"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip
                            title={c.isActive ? "Deactivate" : "Activate"}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStatus(c)}
                            >
                              {c.isActive ? (
                                <ToggleOnIcon
                                  fontSize="small"
                                  color="success"
                                />
                              ) : (
                                <ToggleOffIcon
                                  fontSize="small"
                                  color="warning"
                                />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(c)}
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Add camera dialog */}
      <Dialog open={addOpen} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add New Camera</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Camera Name"
              size="small"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="e.g. North Gate Camera"
            />
            <TextField
              label="Location"
              size="small"
              fullWidth
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              error={!!formErrors.location}
              helperText={formErrors.location}
              placeholder="e.g. North entrance, Sector 4"
            />
            <TextField
              label="Stream URL"
              size="small"
              fullWidth
              value={form.streamUrl}
              onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
              error={!!formErrors.streamUrl}
              helperText={formErrors.streamUrl}
              placeholder="https://stream.example.com/cam1"
            />
          </Stack>
          {/* if user is superadmin show organizations dropdown from the organization state pick orgid else use his organization id */}
          {role === "superadmin" && (
            <TextField
              select
              label="Organization"
              size="small"
              fullWidth
              value={form.organizationId}
              onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
              error={!!formErrors.organizationId}
              helperText={formErrors.organizationId}
            >
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          {role !== "superadmin" && (
            setForm({ ...form, organizationId: user.organizationId })
            //log form data
            
          )}
          
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAdd} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCamera}
            disabled={submitting}
            sx={{ fontWeight: 600 }}
          >
            {submitting ? "Adding..." : "Add Camera"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle fontWeight={700}>Delete Camera</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
