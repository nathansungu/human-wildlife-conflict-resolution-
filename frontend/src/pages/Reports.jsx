import {
  Box, Typography, Card, CardContent, Chip, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, InputAdornment, Stack, Grid,
  Button, Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Pets as PetsIcon,
  Notifications as NotifIcon,
  Warning as AlertIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { detectionService } from "../services/api";
import toast from "react-hot-toast";

const COLORS = ["#6366F1", "#10B981", "#EC4899", "#F59E0B", "#3B82F6", "#EF4444"];

export default function Reports() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const printRef = useRef();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await detectionService.getAllReports();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    }
  };

  const handlePrint = () => window.print();

  if (!data) return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <Typography color="text.secondary">Loading reports...</Typography>
    </Box>
  );

  const {
    dailyTotal = [],
    monthlyTotal = [],
    totalDetections = 0,
    highPriorityAlerts = 0,
    notificationsSent = 0,
    topSpecies = [],
    topCamera = [],
  } = data;

  const species = [...new Set(dailyTotal.map((r) => r.speciesName))];

  const filteredDaily = dailyTotal.filter((r) => {
  const dateLabel = new Date(r.date).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  return [r.speciesName, dateLabel]
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase());
});

  const generatedAt = new Date().toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-break { page-break-after: always; }
          @page { margin: 20mm; }
        }
      `}</style>

      <Box className="no-print" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h3" fontWeight={800}>Reports</Typography>
          <Typography variant="body1" color="text.secondary">
            Generate daily and monthly detection reports
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Print Report
        </Button>
      </Box>

      <Box className="no-print" sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by species or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box id="printable-report" ref={printRef}>
        <Card>
          <CardContent sx={{ p: 4 }}>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Wildlife Monitoring System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detection Report
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" color="text.secondary">Generated</Typography>
                <Typography variant="body2" fontWeight={600}>{generatedAt}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Summary stats */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Summary
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                { label: "Total Detections", value: totalDetections, color: "#6366F1" },
                { label: "High Priority Alerts", value: highPriorityAlerts, color: "#EF4444" },
                { label: "Notifications Sent", value: notificationsSent, color: "#10B981" },
                { label: "Top Species", value: topSpecies[0]?.speciesName ?? "—", color: "#F59E0B" },
              ].map(({ label, value, color }) => (
                <Grid item xs={6} sm={3} key={label}>
                  <Box sx={{
                    p: 2, borderRadius: 2, border: "1px solid",
                    borderColor: "divider", textAlign: "center",height: "100%",
                  }}>
                    <Typography variant="caption" color="text.secondary"
                      textTransform="uppercase" letterSpacing={0.5} display="block">
                      {label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color }}>
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Monthly totals */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Monthly Species Totals
            </Typography>
            <TableContainer sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    {["Species", "Month", "Total Count"].map((h) => (
                      <TableCell key={h} sx={{
                        fontWeight: 700, textTransform: "uppercase",
                        fontSize: 11, letterSpacing: 0.5,
                      }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyTotal.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No monthly data
                      </TableCell>
                    </TableRow>
                  ) : (
                    monthlyTotal.map((r, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Chip
                            label={r.speciesName}
                            size="small"
                            sx={{
                              textTransform: "capitalize", fontWeight: 600,
                              bgcolor: COLORS[i % COLORS.length] + "20",
                              color: COLORS[i % COLORS.length],
                              border: "none",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{r.month}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>{r.count}</Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {/* Totals row */}
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell colSpan={2}>
                      <Typography variant="body2" fontWeight={700}>Total</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {monthlyTotal.reduce((s, r) => s + r.count, 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ mb: 3 }} />

            {/* Daily breakdown */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Daily Breakdown
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    {["#", "Species", "Date", "Count"].map((h) => (
                      <TableCell key={h} sx={{
                        fontWeight: 700, textTransform: "uppercase",
                        fontSize: 11, letterSpacing: 0.5,
                      }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDaily.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDaily.map((r, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{i + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={r.speciesName}
                            size="small"
                            sx={{
                              textTransform: "capitalize", fontWeight: 600,
                              bgcolor: COLORS[species.indexOf(r.speciesName) % COLORS.length] + "20",
                              color: COLORS[species.indexOf(r.speciesName) % COLORS.length],
                              border: "none",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(r.date).toLocaleDateString("en-GB", {
                              weekday: "short", day: "numeric",
                              month: "short", year: "numeric",
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {r._sum?.count ?? 0}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {/* Totals row */}
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" fontWeight={700}>Total</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {filteredDaily.reduce((s, r) => s + (r._sum?.count ?? 0), 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Report footer */}
            <Divider sx={{ mt: 4, mb: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Wildlife Human Conflict Resolution System
              </Typography>
            </Stack>

          </CardContent>
        </Card>
      </Box>
    </>
  );
}