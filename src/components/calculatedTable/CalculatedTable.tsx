import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Typography, Grid, Box, TableContainer, Button } from '@mui/material';
import NumberFormat, { NumericFormat } from "react-number-format";
import {fetchCalculation} from "../../services/CalculationService";

// Define the type for the table data
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

const CalculatedTable: React.FC<CalculatedTableProps> = ({ inputUsage, token }) => {
  // Using React Query's useQuery hook to fetch the calculation data
  const queryKey = ['calculation', inputUsage, token]; // Define dynamic queryKey with inputUsage and token
  const queryFn = () => fetchCalculation(inputUsage, token); // Define queryFn

  const { data, isLoading, error } = useQuery<CalculationData, Error>({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  // Show loading spinner while the data is being fetched
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} color="primary" />
      </Box>
    );
  }

  // Handle error state
  if (error instanceof Error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  // Render table and data when available
  if (!data || !data.items) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
        <Typography variant="h6" color="textSecondary">
          No data available.
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Grid container spacing={4} justifyContent="space-between" alignItems="center">
        <Grid item>

        </Grid>
        <Grid item>
          <Typography variant="h6" color="textSecondary">
            <strong>Total Costs</strong>
          </Typography>
          <Typography variant="body1">
            <strong>Total Price: </strong>
            <NumericFormat
              value={data.total}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={(value) => <span>{value}</span>}
            />
          </Typography>
          <Typography variant="body1">
            <strong>Total VAT Price: </strong>
            <NumericFormat
              value={data.totalWithVAT}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={(value) => <span>{value}</span>}
            />
          </Typography>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f4f4' }}>
              <TableCell><strong>From</strong></TableCell>
              <TableCell><strong>To</strong></TableCell>
              <TableCell><strong>Standard Price</strong></TableCell>
              <TableCell><strong>Usage</strong></TableCell>
              <TableCell><strong>Sub Total</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((item, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                <TableCell>{item.from}</TableCell>
                <TableCell>{item.to}</TableCell>
                <TableCell>
                  <NumericFormat
                    value={item.standardPrice}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    renderText={(value) => <div>{value}</div>}
                  />
                </TableCell>
                <TableCell>{item.usage}</TableCell>
                <TableCell>
                  <NumericFormat
                    value={item.price}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    renderText={(value) => <div>{value}</div>}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CalculatedTable;
