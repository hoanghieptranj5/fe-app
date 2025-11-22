import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
  Grid,
  Box,
  TableContainer,
  Button,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { fetchCalculation } from '../../services/CalculationService';

// ---- Types ----
interface CalculatedItem {
  from: number | string;
  to: number | string;
  standardPrice: number;
  usage: number;
  price: number;
}

interface CalculationData {
  total: number;
  totalWithVAT: number;
  items: CalculatedItem[];
}

interface CalculatedTableProps {
  inputUsage: number | string;
  token: string;
}

// Reusable currency formatter
const CurrencyText: React.FC<{ value: number }> = ({ value }) => {
  const rounded = Number(Number(value).toFixed(2));

  return (
    <NumericFormat
      value={rounded}
      displayType="text"
      thousandSeparator
      prefix="$"
      decimalScale={2}
      fixedDecimalScale
      renderText={(val) => <span>{val}</span>}
    />
  );
};

const CalculatedTable: React.FC<CalculatedTableProps> = ({ inputUsage, token }) => {
  const queryKey = ['calculation', inputUsage, token];
  const queryFn = () => fetchCalculation(inputUsage, token);

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<CalculationData, Error>({
    queryKey,
    queryFn,
    enabled: !!inputUsage && token !== 'invalid_token',
  });

  // --- Loading state (inline, not full screen) ---
  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          minHeight: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={1} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Calculating prices…
          </Typography>
        </Stack>
      </Box>
    );
  }

  // --- Error state ---
  if (error instanceof Error) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.error.light}`,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'background.paper'
              : '#fff5f5',
        }}
        elevation={0}
      >
        <Stack spacing={1.5}>
          <Typography variant="h6" color="error">
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
          <Box>
            <Button variant="contained" size="small" onClick={() => refetch()}>
              Try again
            </Button>
          </Box>
        </Stack>
      </Paper>
    );
  }

  // --- No data state ---
  if (!data || !data.items || data.items.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available for this usage. Try another value.
        </Typography>
      </Box>
    );
  }

  // --- Main UI ---
  return (
    <Stack spacing={2.5}>
      {/* Summary strip */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'background.paper'
              : 'rgba(249, 250, 251, 0.9)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                SUMMARY
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usage breakdown and total cost including VAT.
              </Typography>
              <Chip
                size="small"
                label={`Usage: ${inputUsage || 0}`}
                sx={{ mt: 0.5, alignSelf: 'flex-start' }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                TOTAL PRICE
              </Typography>
              <Typography variant="h6">
                <CurrencyText value={data.total} />
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                TOTAL WITH VAT
              </Typography>
              <Typography variant="h6">
                <CurrencyText value={data.totalWithVAT} />
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Includes all applicable taxes.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Divider />

      {/* Detail table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Table size="small" aria-label="calculated price table">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'background.paper'
                    : 'grey.100',
                '& th': {
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                },
              }}
            >
              <TableCell>Range (From)</TableCell>
              <TableCell>Range (To)</TableCell>
              <TableCell align="right">Standard Price</TableCell>
              <TableCell align="right">Usage</TableCell>
              <TableCell align="right">Sub Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'background.default'
                        : 'grey.50',
                  },
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'action.hover'
                        : 'grey.100',
                  },
                  transition: 'background-color 0.15s ease',
                }}
              >
                <TableCell>{item.from}</TableCell>
                <TableCell>{item.to}</TableCell>
                <TableCell align="right">
                  <CurrencyText value={item.standardPrice} />
                </TableCell>
                <TableCell align="right">{item.usage}</TableCell>
                <TableCell align="right">
                  <CurrencyText value={item.price} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Each row represents a usage tier with its own rate and subtotal.
        </Typography>
      </Box>
    </Stack>
  );
};

export default CalculatedTable;
