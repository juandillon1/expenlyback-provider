const { MongoClient } = require('mongodb');

class MongoDBManager {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect(uri) {
    try {
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db('expenses_db');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log(error.message);
        const msg = (!uri) ? 'Error al conectarse a mongoDB: uri no especificado' : 'Error al conectarse a mongoDB';
        console.error(error);
        throw new Error(msg);
    } 
  }

  async disconnect() {
    try {
        await this.client.close();
        console.log('Desconectado de MongoDB');
    } catch(error) {
        console.error(error);
        throw new Error(msg);
    }
  }

}

module.exports = MongoDBManager;