// src/features/peopleExpensesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface PeopleExpensesState {
  people: Person[];
  expenses: Expense[];
}

const initialState: PeopleExpensesState = {
  people: [],
  expenses: [],
};

const peopleExpensesSlice = createSlice({
  name: "peopleExpenses",
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<Person>) => {
      state.people.push(action.payload);
    },
    removePerson: (state, action: PayloadAction<number>) => {
      state.people = state.people.filter((person) => person.id !== action.payload);
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    removeExpense: (state, action: PayloadAction<number>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
    },
  },
});

export const { addPerson, removePerson, addExpense, removeExpense } = peopleExpensesSlice.actions;
export default peopleExpensesSlice.reducer;
