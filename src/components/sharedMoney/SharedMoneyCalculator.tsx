import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Select,
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

const SharedMoneyCalculator: React.FC = () => {
  const people = useAppSelector((state) => state.peopleExpenses.people);
  const expenses = useAppSelector((state) => state.peopleExpenses.expenses);
  const dispatch = useAppDispatch();

  const [newPerson, setNewPerson] = useState("");
  const [newExpense, setNewExpense] = useState({ payer: "", amount: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => `${amount.toLocaleString("vi-VN")} ₫`;

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const addPersonHandler = () => {
    if (!newPerson.trim()) return handleError("Person name cannot be empty");
    dispatch(addPerson({ id: Date.now(), name: newPerson.trim() }));
    setNewPerson("");
  };

  const removePersonHandler = (id: number) => {
    if (expenses.some((e) => e.payer === id)) return handleError("Cannot remove a person who has paid for an item.");
    dispatch(removePerson(id));
  };

  const addExpenseHandler = () => {
    if (!newExpense.payer || !newExpense.amount || !newExpense.description.trim()) {
      return handleError("All expense fields must be filled out");
    }
    dispatch(
      addExpense({
        id: Date.now(),
        payer: Number(newExpense.payer),
        amount: Number(newExpense.amount),
        description: newExpense.description.trim(),
      })
    );
    setNewExpense({ payer: "", amount: "", description: "" });
  };

  const removeExpenseHandler = (id: number) => {
    dispatch(removeExpense(id));
  };

  const calculateDebts = () => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const average = total / people.length;
    const balances = new Map<number, number>(people.map((p) => [p.id, 0]));
    expenses.forEach((e) => balances.set(e.payer, (balances.get(e.payer) || 0) + e.amount));
    return { total, debts: people.map((p) => ({ name: p.name, balance: (balances.get(p.id) || 0) - average })) };
  };

  const { total, debts } = calculateDebts();

  return (
    <Container className="shared-money-calculator">
      <Typography variant="h4" className="title">
        Shared Money Calculator
      </Typography>
      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Paper elevation={3} className="total-paper">
        <Typography variant="h6">Total Money Spent: {formatCurrency(total)}</Typography>
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper elevation={3} className="paper">
          <Typography variant="h6" className="paper-title">People</Typography>
          <TextField
            label="Name"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Button onClick={addPersonHandler} variant="contained" className="add-button">
            Add Person
          </Button>
          <List className="list">
            {people.map((p) => (
              <ListItem
                key={p.id}
                secondaryAction={
                  <IconButton onClick={() => removePersonHandler(p.id)}>
                    <Delete className="delete-icon" />
                  </IconButton>
                }
              >
                <ListItemText primary={p.name} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper elevation={3} className="paper">
          <Typography variant="h6" className="paper-title">Expenses</Typography>
          <Select
            value={newExpense.payer}
            onChange={(e) => setNewExpense({ ...newExpense, payer: e.target.value })}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Payer
            </MenuItem>
            {people.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            type="number"
            label="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            fullWidth
            margin="dense"
          />
          <Button onClick={addExpenseHandler} variant="contained" className="add-button">
            Add Expense
          </Button>
        </Paper>

        <Paper elevation={3} className="paper">
          <Typography variant="h6" className="paper-title">Items Paid</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payer</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{people.find((p) => p.id === e.payer)?.name}</TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell>{formatCurrency(e.amount)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeExpenseHandler(e.id)}>
                        <Delete className="delete-icon" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper elevation={3} className="paper">
          <Typography variant="h6" className="paper-title">Balance Sheet</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debts.map(({ name, balance }) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      {balance >= 0 ? "Earned" : "Owes"} {formatCurrency(Math.abs(balance))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SharedMoneyCalculator;