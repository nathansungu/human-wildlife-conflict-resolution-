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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  NotificationsActive as SubIcon,
  NotificationsOff as UnsubIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { userService } from "../services/api";
import { useAuthStore } from "../store/index";
import toast from "react-hot-toast";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

const AVATAR_COLORS = [
  "#6366F1",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
];
const avatarColor = (id) =>
  AVATAR_COLORS[id?.charCodeAt(0) % AVATAR_COLORS.length];

export default function Subscribers() {
  const [subscribers, setSubscribers ] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updating, setUpdating] = useState(null);

  const { user } = useAuthStore();
  const role = user?.roleName;
  if (role !== "admin" && role !== "superadmin") {
    return (
      <Box display={useAuthStore.r} textAlign="center" py={10}>
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
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const res = await userService.getSubscribers();
      setSubscribers(res.data);
    } catch (err) {
      toast.error("Failed to load subscribers");
    }
  };

  const handleUpdate = async (user, patch) => {
    setUpdating(user.id);
    try {
      await userService.updateSubscriber({ id: user.id, ...patch });
      setSubscribers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...patch } : u)),
      );
      toast.success("User updated");
    } catch (err) {
      toast.error(
        err.response?.status === 403
          ? "You are not authorized to update this user"
          : "Failed to update user",
      );
    } finally {
      setUpdating(null);
    }
  };

  const filtered = subscribers.filter((u) =>
    [u.name, u.email, u.phone, u.roleName]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight={800}>
        Subscribers
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage subscriber accounts and subscriptions
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip
          icon={<PeopleIcon />}
          label={`${subscribers.length} Total`}
          variant="outlined"
        />
      
      
        <Chip
          label={`${subscribers.filter((u) => u.subscribed).length} Subscribed`}
          color="success"
          variant="outlined"
        />
      </Stack>

      <Card>
        <CardContent>
          <TextField
            size="small"
            placeholder="Search by name, email, phone, role..."
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
                    "User",
                    "Organization",
                    "Email",
                    "Phone",
                     "Subscribed",
                    "Joined",
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
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((u) => {
                    const isUpdating = updating === u.id;

                    return (
                      <TableRow key={u.id} hover>
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
                                bgcolor: avatarColor(u.id),
                              }}
                            >
                              {getInitials(u.name)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {u.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {u.organization?.name ?? "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {u.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {u.phone ?? "—"}
                          </Typography>
                        </TableCell>

                        
                        {/* Subscribed toggle */}
                        <TableCell>
                          <Tooltip
                            title={u.isActive ? "Unsubscribe" : "Subscribe"}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                              sx={{ width: "fit-content" }}
                            >
                              <Chip
                                label={u.isActive ? "Yes" : "No"}
                                size="small"
                                color={u.isActive ? "success" : "warning"}
                                variant="outlined"
                              />
                              <IconButton
                                size="small"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleUpdate(u, { subscribed: !u.isActive })
                                }
                              >
                                {u.isActive ? (
                                  <UnsubIcon fontSize="small" color="warning" />
                                ) : (
                                  <SubIcon fontSize="small" color="success" />
                                )}
                              </IconButton>
                            </Stack>
                          </Tooltip>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
    </Box>
  );
}
