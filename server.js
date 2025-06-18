const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Crear tabla de usuarios si no existe, solo con username y password
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error al crear la tabla de usuarios:', err.message);
            } else {
                console.log('Tabla de usuarios verificada/creada.');
            }
        });
    }
});

// Ruta de registro de usuarios
app.post('/register', (req, res) => {
    const { username, password } = req.body; // Solo username y password

    // Validación básica
    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });
    }

    // En un entorno real, ¡hashearías la contraseña antes de guardarla!
    // Ejemplo: const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`; // Consulta SQL ajustada
    db.run(sql, [username, password], function(err) { // Parámetros ajustados
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
            }
            console.error('Error al insertar el usuario:', err.message);
            return res.status(500).json({ message: 'Error interno del servidor al registrar.' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente!', userId: this.lastID });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Cierre de la base de datos al cerrar la aplicación (opcional, pero buena práctica)
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexión a la base de datos cerrada.');
        process.exit(0);
    });
});