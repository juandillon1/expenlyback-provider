class ExpenseManager {
    constructor(db) {
        this.name = '';
        this.value = 0;
        this.date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        this.db = db;
    }

    async getExpense({ name }) {
        try {
            this.name = name;
            const collection = this.db.collection('expenses');
            
            const existingExpense = await collection.findOne({ name: name });
            if (!existingExpense) {
                throw new Error('No hay un item con ese nombre');
            }
            return existingExpense;
        } catch(e) {
            console.error(e);
            throw new Error('Error al insertar en MongoDB');
        }
    }

    async getExpenses({ month }) {
        try {
            if (month === undefined || month === null || typeof month !== 'number' || month < 0 || month > 11) {
                throw new Error('Debe proporcionar un número de mes válido (0-11)');
            }
    
            const currentYear = new Date().getFullYear();
            const firstDayOfMonth = new Date(currentYear, month, 1);
            const lastDayOfMonth = new Date(currentYear, month + 1, 0);
            const collection = this.db.collection('expenses');
            const expenses = await collection.find({ date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } }).toArray();
            
            return expenses;
        } catch(e) {
            console.error(e);
            throw new Error('Error al obtener las expensas de MongoDB');
        }
    }
    
    

    async saveExpense({ name, value }) {
        try {
            this.name = name;
            this.value = value;
            const collection = this.db.collection('expenses');
            
            const existingExpense = await collection.findOne({ name: name });
            if (existingExpense) {
                throw new Error('Ya existe un item con el mismo nombre en la base de datos. No se insertará uno nuevo.');
            }
            
            const result = await collection.insertOne({ name: this.name, value: this.value, date: this.date });
            return result;
        } catch(e) {
            console.error(e);
            throw new Error('Error al insertar en MongoDB');
        }
    }
    

    async updateExpense({ name, value, month }) {
        try {
            this.name = name;
            this.value = value;
            const collection = this.db.collection('expenses');
            const currentYear = new Date().getFullYear();
            const firstDayOfMonth = new Date(currentYear, month - 1, 1);
            const lastDayOfMonth = new Date(currentYear, month, 0);
            const filter = { name, date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } };
            const updateDoc = { $set: { value } };
            const result = await collection.updateOne(filter, updateDoc);
            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error al actualizar en MongoDB');
        }
    }

    async deleteExpense({ name, month }) {
        try {
            const collection = this.db.collection('expenses');
            const currentYear = new Date().getFullYear();
            const firstDayOfMonth = new Date(currentYear, month - 1, 1);
            const lastDayOfMonth = new Date(currentYear, month, 0);
            const filter = { name, date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } };
            const result = await collection.deleteOne(filter);
            if (result.deletedCount === 0) {
                throw new Error('No se encontró ninguna expensa para eliminar');
            }
    
            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error al borrar en MongoDB');
        }
    }
    
    
    
    
};

module.exports = ExpenseManager;