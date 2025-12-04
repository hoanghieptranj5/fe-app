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
import { styled } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
// import "./SharedMoneyCalculator.scss"; // ❌ not needed with glassy layout
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addPerson,
  removePerson,
  addExpense,
  removeExpense,
} from "../../redux/slices/peopleExpensesSlice";
import { GlassyCard } from "../../components/glassyCard/GlassyCard";

interface NewExpenseState {
  payer: string;
  amount: string;
  description: string;
}

const INITIAL_EXPENSE: NewExpenseState = {
  payer: "",
  amount: "",
  description: "",
};

// ------ styled ------------------------------------------------

const Page = styled(Container)(({ theme }) => ({
  maxWidth: "1120px",
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(7),
}));

const SectionCard = styled(GlassyCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 24,
}));

const SummaryCard = styled(GlassyCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 24,
}));

const GlassyTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  borderRadius: 18,
  overflow: "hidden",
  background: "rgba(15,23,42,0.9)",
  border: "1px solid rgba(51,65,85,0.9)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
}));

const TableHeaderCell = styled(TableCell)(() => ({
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.08,
  color: "rgba(226,232,240,0.9)",
}));

// ------ component ---------------------------------------------

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
      return {
        total: 0,
        averagePerPerson: 0,
        debts: [] as { name: string; balance: number }[],
      };
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
    <Page className="shared-money-calculator">
      {/* HEADER */}
      <Stack spacing={1} mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
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
      <SummaryCard sx={{ mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
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
      </SummaryCard>

      <Divider sx={{ my: 3, borderColor: "rgba(30,64,175,0.6)" }} />

      <Grid container spacing={3}>
        {/* LEFT COLUMN: People + Add Expense */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            {/* PEOPLE */}
            <SectionCard>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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

              <List dense sx={{ mt: 1 }}>
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
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={p.name} />
                  </ListItem>
                ))}
              </List>
            </SectionCard>

            {/* ADD EXPENSE */}
            <SectionCard>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Add Expense
              </Typography>

              <Stack spacing={1.5} mt={1}>
                <TextField
                  select
                  label="Payer"
                  value={newExpense.payer}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      payer: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  disabled={people.length === 0}
                  helperText={people.length === 0 ? "Add people first" : undefined}
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
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                />

                <TextField
                  label="Description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
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
            </SectionCard>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: Items Paid + Balance Sheet */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            {/* ITEMS PAID */}
            <SectionCard>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Items Paid
              </Typography>
              <GlassyTableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Payer</TableHeaderCell>
                      <TableHeaderCell>Description</TableHeaderCell>
                      <TableHeaderCell align="right">Amount</TableHeaderCell>
                      <TableHeaderCell align="center" width={48}></TableHeaderCell>
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
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </GlassyTableContainer>
            </SectionCard>

            {/* BALANCE SHEET */}
            <SectionCard>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Balance Sheet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Positive = this person paid more than average (others owe them). Negative = this
                person owes money to the group.
              </Typography>

              <GlassyTableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell align="right">Balance</TableHeaderCell>
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
              </GlassyTableContainer>
            </SectionCard>
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
    </Page>
  );
};

export default SharedMoneyCalculator;
