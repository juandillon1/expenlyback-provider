require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const ConnectionManager = require('./modules/db/connection');
const ExpenseManager = require('./modules/expense/expense');

app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_PASS}@cluster0.fzx4uxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const connection = new ConnectionManager();

connection.connect(uri).then(async () => {
  const Expense = new ExpenseManager(connection.db);

  app.get('/', async (req, res) => {
    res.json({ msg: 'api alive' });
  });

  app.get('/expenses/:month', async (req, res) => {
    try {
      const expenses = await Expense.getExpenses({ month: +req.params.month });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ msg: 'Ocurrió un error al obtener las expensas.', error: error.message });
    }
  });


  app.get('/expenses/expense/:name', async (req, res) => {
    try {
      const expense = await Expense.getExpense({ name: req.params.name });
      res.json(expense);
    } catch (error) {
      res.status(500).json({ msg: 'Ocurrió un error al obtener la expensa.', error: error.message });
    }
  });


  app.post('/expenses', async (req, res) => {
    try {
      const newExpense = req.body;
      console.log(newExpense);
      const createdExpense = await Expense.saveExpense(newExpense);
      res.json(createdExpense);
    } catch (error) {
      res.status(500).json({ msg: 'Ocurrió un error al guardar la expensa.', error: error.message });
    }
  });


  app.put('/expenses/:name/:month', async (req, res) => {
    try {
      const updatedExpense = await Expense.updateExpense({ name: req.params.name, value: req.body, month: +req.params.month });
      res.json(updatedExpense);
    } catch (error) {
      res.status(500).json({ msg: 'Ocurrió un error al actualizar la expensa.', error: error.message });
    }
  });


  app.delete('/expenses/:name/:month', async (req, res) => {
    try {
      await Expense.deleteExpense({ name: req.params.name, month: +req.params.month });
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Ocurrió un error al eliminar la expensa.', error: error.message });
    }
  });


  app.on('close', () => {
    connection.disconnect();
  });

  app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
  });
});
