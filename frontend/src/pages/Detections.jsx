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
  Button,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { detectionService } from "../services/api";
import {useAuthStore} from "../store/index";

export default function Detections() {
  const [detections, setDetections] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //refetch detections every 30 seconds
  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const res = await detectionService.getAll();
        setDetections(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetections();
    const interval = setInterval(fetchDetections, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = detections.filter((d) =>
    [d.animal?.name, d.camera?.name, d.camera?.location]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const sorted = filtered.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <Box>
          <Typography variant="h3" gutterBottom fontWeight={800}>
            Detections
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            View and manage wildlife detections
          </Typography>
        </Box>
        <Button
          display={useAuthStore.getState().user?.role === "admin" ? "inline-flex" : "none"}
          variant="contained"
          color="primary"
          sx={{ ml: "auto", blockSize: "2.5rem" }}
          onClick={() => detectionService.restartDetectionService()}
          
        >
          Restart Detection Service
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            size="small"
            placeholder="Search by species, camera, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ mb: 2, width: 340 }}
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
                    "Species",
                    "Camera",
                    "Location",
                    "Confidence",
                    "Verified",
                    "Detected At",
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
                      No detections found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((d) => (
                    <TableRow key={d.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {d.animal?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {d.camera?.name ?? d.cameraId.slice(0, 8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {d.camera?.location ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${(d.confidence * 100).toFixed(1)}%`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor:
                              d.confidence >= 0.85
                                ? "success.main"
                                : d.confidence >= 0.6
                                  ? "warning.main"
                                  : "error.main",
                            color: "white",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={d.isVerified ? "Verified" : "Pending"}
                          size="small"
                          variant="outlined"
                          color={d.isVerified ? "success" : "warning"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(d.createdAt).toLocaleString()}
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
