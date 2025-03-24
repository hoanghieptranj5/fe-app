import React, { useState } from "react";
import {
  Container, TextField, Button, List, ListItem, ListItemText, IconButton, MenuItem, Select, Typography, Grid, Paper, Snackbar, Alert
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface Person {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  payer: number;
  amount: number;
  description: string;
}

const SharedMoneyCalculator: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [newExpense, setNewExpense] = useState({ payer: "", amount: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => `${amount.toLocaleString("vi-VN")} ₫`;

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const addPerson = () => {
    if (!newPerson.trim()) return handleError("Person name cannot be empty");
    setPeople([...people, { id: Date.now(), name: newPerson.trim() }]);
    setNewPerson("");
  };

  const removePerson = (id: number) => {
    if (expenses.some((e) => e.payer === id)) return handleError("Cannot remove a person who has paid for an item.");
    setPeople(people.filter((p) => p.id !== id));
  };

  const addExpense = () => {
    if (!newExpense.payer || !newExpense.amount || !newExpense.description.trim()) {
      return handleError("All expense fields must be filled out");
    }
    setExpenses([...expenses, { id: Date.now(), payer: Number(newExpense.payer), amount: Number(newExpense.amount), description: newExpense.description.trim() }]);
    setNewExpense({ payer: "", amount: "", description: "" });
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
    <Container>
      <Typography variant="h4" gutterBottom>Shared Money Calculator</Typography>
      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6">Total Money Spent: {formatCurrency(total)}</Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">People</Typography>
            <TextField label="Name" value={newPerson} onChange={(e) => setNewPerson(e.target.value)} fullWidth margin="dense" />
            <Button onClick={addPerson} variant="contained" fullWidth>Add Person</Button>
            <List>
              {people.map((p) => (
                <ListItem key={p.id} secondaryAction={<IconButton onClick={() => removePerson(p.id)}><Delete /></IconButton>}>
                  <ListItemText primary={p.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Expenses</Typography>
            <Select value={newExpense.payer} onChange={(e) => setNewExpense({ ...newExpense, payer: e.target.value })} fullWidth displayEmpty>
              <MenuItem value="" disabled>Select Payer</MenuItem>
              {people.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
            <TextField type="number" label="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} fullWidth margin="dense" />
            <TextField label="Description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} fullWidth margin="dense" />
            <Button onClick={addExpense} variant="contained" fullWidth>Add Expense</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Items Paid</Typography>
            <List>
              {expenses.map((e) => (
                <ListItem key={e.id}>
                  <ListItemText primary={`${people.find((p) => p.id === e.payer)?.name}: ${e.description} - ${formatCurrency(e.amount)}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Balance Sheet</Typography>
            <List>
              {debts.map(({ name, balance }) => (
                <ListItem key={name}>
                  <ListItemText primary={`${name}: ${balance >= 0 ? "Earned" : "Owes"} ${formatCurrency(Math.abs(balance))}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SharedMoneyCalculator;
