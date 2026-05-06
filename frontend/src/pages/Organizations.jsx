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
  Stack,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import {
  Search as SearchIcon,
  People as PeopleIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { organizationService, userService } from "../services/api";
import { useAuthStore, useOrganizationStore } from "../store/index";

const EMPTY_FORM = {
  name: "",
  userId: "",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const AVATAR_COLORS = [
  "#6366F1",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
];

const avatarColor = (id = "") =>
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length] || AVATAR_COLORS[0];

export default function Organizations() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { user } = useAuthStore();
  const { organizations, setOrganizations } = useOrganizationStore();

  const role = user?.roleName;
  const canAccess = role === "admin" || role === "superadmin";

  const orgList = Array.isArray(organizations) ? organizations : [];

  const fetchOrganizations = async () => {
    setLoadingOrganizations(true);

    try {
      const res = await organizationService.getAllOrganizations();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.organizations || res.data?.allOrganizations || [];

      setOrganizations(data);
    } catch (err) {
      toast.error("Failed to load organizations");
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const fetchUsers = async () => {
    if (role !== "superadmin") return;

    setLoadingUsers(true);

    try {
      const res = await userService.getAll();

      const data = res.data      

      setUsers(data);
    } catch (err) {
      toast.error("Failed to load system users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (canAccess) {
      fetchOrganizations();
    }
  }, [canAccess]);

  useEffect(() => {
    if (role === "superadmin") {
      fetchUsers();
    }
  }, [role]);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return orgList;

    return orgList.filter((org) =>
      [
        org?.name,
        org?.subscriptionType,
        org?.subscriptionValidUntil,
        org?.isActive ? "active" : "inactive",
        org?.updatedAt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchText)
    );
  }, [orgList, search]);

  const paginated = useMemo(() => {
    return filtered.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filtered, page, rowsPerPage]);

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === form.userId) || null;
  }, [users, form.userId]);

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Organization name is required";
    }

    if (role === "superadmin" && !form.userId) {
      errors.userId = "Please select a system user";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setAddOpen(true);

    if (role === "superadmin" && users.length === 0) {
      fetchUsers();
    }
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const handleAddOrganization = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await organizationService.createOrganization({
        name: form.name.trim(),
        userId: role === "superadmin" ? form.userId : undefined,
      });

      toast.success("Organization added successfully");
      handleCloseAdd();
      fetchOrganizations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add organization");
    } finally {
      setSubmitting(false);
    }
  };

  if (!canAccess) {
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

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography variant="h4" gutterBottom fontWeight={800}>
          Organizations
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Add Organization
        </Button>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage organizations and subscription details.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip
          icon={<PeopleIcon />}
          label={`${orgList.length} Total`}
          variant="outlined"
        />

        <Chip
          label={`${filtered.length} Showing`}
          color="success"
          variant="outlined"
        />
      </Stack>

      <Card>
        <CardContent>
          <TextField
            size="small"
            placeholder="Search by name, subscription, status..."
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
                    "Organization Name",
                    "Subscription Type",
                    "Subscription Valid Until",
                    "Active",
                    "Last Updated",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 11,
                        letterSpacing: 0.5,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loadingOrganizations ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      Loading organizations...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 6, color: "text.secondary" }}
                    >
                      No organizations found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((org) => (
                    <TableRow key={org.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: 12,
                              fontWeight: 700,
                              bgcolor: avatarColor(org.id),
                            }}
                          >
                            {getInitials(org.name)}
                          </Avatar>

                          <Typography variant="body2" fontWeight={600}>
                            {org.name || "Unnamed Organization"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {org.subscriptionType || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {org.subscriptionValidUntil
                            ? new Date(
                                org.subscriptionValidUntil
                              ).toLocaleDateString()
                            : "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={org.isActive ? "Yes" : "No"}
                          size="small"
                          color={org.isActive ? "success" : "warning"}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {org.updatedAt
                            ? new Date(org.updatedAt).toLocaleDateString()
                            : "—"}
                        </Typography>
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
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={addOpen} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add New Organization</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Organization Name"
              size="small"
              fullWidth
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              placeholder="e.g. NatureWatch Kenya"
            />

            {role === "superadmin" && (
              <Autocomplete
                options={users}
                loading={loadingUsers}
                value={selectedUser}
                onChange={(_, selected) =>
                  setForm((prev) => ({
                    ...prev,
                    userId: selected?.id || "",
                  }))
                }
                getOptionLabel={(option) => {
                  const fullName = `${option?.firstName || ""} ${
                    option?.lastName || ""
                  }`.trim();

                  return `${fullName || option?.name || "Unnamed User"}${
                    option?.email ? ` (${option.email})` : ""
                  }`;
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                filterOptions={(options, state) => {
                  const input = state.inputValue.toLowerCase();

                  return options.filter((u) =>
                    [
                      u?.firstName,
                      u?.lastName,
                      u?.name,
                      u?.email,
                      u?.phone,
                      u?.roleName,
                    ]
                      .filter(Boolean)
                      .join(" ")
                      .toLowerCase()
                      .includes(input)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select System User"
                    size="small"
                    fullWidth
                    error={Boolean(formErrors.userId)}
                    helperText={
                      formErrors.userId ||
                      "Search by name, email, phone, or role"
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingUsers ? (
                            <CircularProgress color="inherit" size={18} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAdd} disabled={submitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddOrganization}
            disabled={submitting}
            sx={{ fontWeight: 600 }}
          >
            {submitting ? "Adding..." : "Add Organization"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}