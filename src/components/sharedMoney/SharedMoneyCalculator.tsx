import React, { useMemo, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Typography,
  Stack,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import "./SharedMoneyCalculator.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addPerson,
  removePerson,
  addExpense,
  removeExpense,
} from "../../redux/slices/peopleExpensesSlice";

interface NewExpenseState {
  payer: string; // we'll convert to number later
  amount: string;
  description: string;
}

const INITIAL_EXPENSE: NewExpenseState = {
  payer: "",
  amount: "",
  description: "",
};

const SharedMoneyCalculator: React.FC = () => {
  const people = useAppSelector((state) => state.peopleExpenses.people);
  const expenses = useAppSelector((state) => state.peopleExpenses.expenses);
  const dispatch = useAppDispatch();

  const [newPerson, setNewPerson] = useState("");
  const [newExpense, setNewExpense] = useState<NewExpenseState>(INITIAL_EXPENSE);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫`;

  const handleError = (message: string) => {
    setError(message);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const handleAddPerson = () => {
    const trimmed = newPerson.trim();
    if (!trimmed) {
      return handleError("Person name cannot be empty.");
    }

    // Optional: prevent duplicate names
    const exists = people.some((p: any) => p.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      return handleError("This person is already in the list.");
    }

    dispatch(addPerson({ id: Date.now(), name: trimmed }));
    setNewPerson("");
  };

  const handleRemovePerson = (id: number) => {
    if (expenses.some((e: any) => e.payer === id)) {
      return handleError("Cannot remove a person who has paid for an item.");
    }
    dispatch(removePerson(id));
  };

  const handleAddExpense = () => {
    if (!newExpense.payer || !newExpense.amount || !newExpense.description.trim()) {
      return handleError("All expense fields must be filled out.");
    }

    const amountValue = Number(newExpense.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return handleError("Amount must be a positive number.");
    }

    dispatch(
      addExpense({
        id: Date.now(),
        payer: Number(newExpense.payer),
        amount: amountValue,
        description: newExpense.description.trim(),
      }),
    );

    setNewExpense(INITIAL_EXPENSE);
  };

  const handleRemoveExpense = (id: number) => {
    dispatch(removeExpense(id));
  };

  const { total, averagePerPerson, debts } = useMemo(() => {
    if (people.length === 0) {
      return { total: 0, averagePerPerson: 0, debts: [] as { name: string; balance: number }[] };
    }

    const totalAmount = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const average = totalAmount / people.length;

    const balances = new Map<number, number>(people.map((p: any) => [p.id, 0]));
    expenses.forEach((e: any) => {
      balances.set(e.payer, (balances.get(e.payer) || 0) + e.amount);
    });

    const debtsArray = people.map((p: any) => ({
      name: p.name,
      balance: (balances.get(p.id) || 0) - average,
    }));

    return {
      total: totalAmount,
      averagePerPerson: average,
      debts: debtsArray,
    };
  }, [people, expenses]);

  const hasData = people.length > 0 || expenses.length > 0;

  return (
    <Container maxWidth="lg" className="shared-money-calculator">
      {/* HEADER */}
      <Stack spacing={1} mb={3}>
        <Typography variant="h4" className="title">
          Shared Money Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add people, record expenses, and see who should pay whom. Perfect for trips, parties, or
          that one friend who keeps “forgetting” to pay. 😏
        </Typography>
      </Stack>

      {/* ERROR SNACKBAR */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* SUMMARY CARD */}
      <Paper elevation={2} className="summary-paper">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Money Spent
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {formatCurrency(total)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Number of People
            </Typography>
            <Typography variant="h6">{people.length}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Average per Person
            </Typography>
            <Typography variant="h6">
              {people.length > 0 ? formatCurrency(averagePerPerson) : "—"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* LEFT COLUMN: People + Add Expense */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            {/* PEOPLE */}
            <Paper elevation={2} className="paper">
              <Typography variant="h6" className="paper-title">
                People
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <TextField
                  label="Name"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button onClick={handleAddPerson} variant="contained" color="primary" size="small">
                  Add
                </Button>
              </Stack>

              <List dense className="list">
                {people.length === 0 && (
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    No people added yet. Start by adding your friends / roommates.
                  </Typography>
                )}
                {people.map((p: any) => (
                  <ListItem
                    key={p.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemovePerson(p.id)} size="small">
                        <Delete className="delete-icon" fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={p.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* ADD EXPENSE */}
            <Paper elevation={2} className="paper">
              <Typography variant="h6" className="paper-title">
                Add Expense
              </Typography>

              <Stack spacing={1.5} mt={1}>
                <TextField
                  select
                  label="Payer"
                  value={newExpense.payer}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, payer: e.target.value }))}
                  fullWidth
                  size="small"
                  disabled={people.length === 0}
                  helperText={people.length === 0 ? "Add people first" : ""}
                >
                  <MenuItem value="" disabled>
                    Select payer
                  </MenuItem>
                  {people.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="number"
                  label="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                />

                <TextField
                  label="Description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, description: e.target.value }))
                  }
                  fullWidth
                  size="small"
                  placeholder="Dinner, taxi, tickets..."
                />

                <Box display="flex" justifyContent="flex-end">
                  <Button onClick={handleAddExpense} variant="contained" size="small">
                    Add Expense
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: Items Paid + Balance Sheet */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            {/* ITEMS PAID */}
            <Paper elevation={2} className="paper">
              <Typography variant="h6" className="paper-title">
                Items Paid
              </Typography>
              <TableContainer className="table-container">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Payer</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center" width={48}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary">
                            No expenses added yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {expenses.map((e: any) => (
                      <TableRow key={e.id} hover>
                        <TableCell>{people.find((p: any) => p.id === e.payer)?.name}</TableCell>
                        <TableCell>{e.description}</TableCell>
                        <TableCell align="right">{formatCurrency(e.amount)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleRemoveExpense(e.id)}
                            size="small"
                            aria-label="delete-expense"
                          >
                            <Delete className="delete-icon" fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* BALANCE SHEET */}
            <Paper elevation={2} className="paper">
              <Typography variant="h6" className="paper-title">
                Balance Sheet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Positive = this person paid more than average (others owe them). Negative = this
                person owes money to the group.
              </Typography>

              <TableContainer className="table-container">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {debts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body2" color="text.secondary">
                            Add people and expenses to see who owes what.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {debts.map(({ name, balance }) => {
                      const isPositive = balance > 0;
                      const isZero = Math.abs(balance) < 1;

                      return (
                        <TableRow key={name}>
                          <TableCell>{name}</TableCell>
                          <TableCell align="right">
                            {isZero ? (
                              <Typography variant="body2" color="text.secondary">
                                Settled up
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: isPositive ? "success.main" : "error.main",
                                }}
                              >
                                {isPositive ? "Should receive" : "Should pay"}{" "}
                                {formatCurrency(Math.abs(balance))}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {!hasData && (
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Start by adding people on the left, then add expenses. The balance sheet will update
            automatically.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SharedMoneyCalculator;
