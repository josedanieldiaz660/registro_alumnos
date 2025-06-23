const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5001;

// API Key ficticia
const API_KEY = '12345ABCDEF';

// Middleware
app.use(cors());
app.use(express.json());

// Archivo donde se almacenan los estudiantes
const STUDENTS_FILE = './students.json';
const CAREERS_FILE = './careers.json';
const CATEGORIES_FILE = './categories.json';

// Función para leer estudiantes desde archivo
function loadStudents() {
    try {
        const data = fs.readFileSync(STUDENTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading students, using empty list.", error);
        return [];
    }
}

// Función para guardar estudiantes en archivo
function saveStudents(students) {
    try {
        fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
    } catch (error) {
        console.error("Error saving students:", error);
    }
}

// Función para leer carreras desde archivo
function loadCareers() {
    try {
        const data = fs.readFileSync(CAREERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading careers, using empty list.", error);
        return [];
    }
}

// Función para guardar carreras en archivo
function saveCareers(careers) {
    try {
        fs.writeFileSync(CAREERS_FILE, JSON.stringify(careers, null, 2));
    } catch (error) {
        console.error("Error saving careers:", error);
    }
}

// Función para leer categorías desde archivo
function loadCategories() {
    try {
        const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error loading categories, using empty list.", error);
        return [];
    }
}

// Función para guardar categorías en archivo
function saveCategories(categories) {
    try {
        fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
    } catch (error) {
        console.error("Error saving categories:", error);
    }
}

// Inicializar estudiantes
let students = loadStudents();

// Inicializar carreras
let careers = loadCareers();

// Inicializar categorías
let categories = loadCategories();

// Middleware para validar API Key
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
        return res.status(401).json({ error: 'Unauthorized. Invalid API Key.' });
    }
    next();
});

// ============================
// Endpoints
// ============================

// Registrar nuevo estudiante
app.post('/api/students', (req, res) => {
    const { name, career_id } = req.body;

    if (!name || !career_id) {
        return res.status(400).json({ error: "Missing required fields: name and career_id." });
    }

    // Fuerza career_id a número
    const careerIdNum = parseInt(career_id);
    const careerObj = careers.find(c => c.id === careerIdNum);
    if (!careerObj) {
        return res.status(400).json({ error: "Career not found." });
    }

    const newStudentId = students.length ? students[students.length - 1].id + 1 : 1;

    const newStudent = {
        id: newStudentId,
        name,
        career: careerObj.name, // Asegúrate de que el backend guarda el nombre de la carrera
        career_id: careerIdNum
    };

    students.push(newStudent);
    saveStudents(students);

    return res.status(201).json({ message: "Student registered successfully.", student: newStudent });
});

// Consultar estudiante por ID
app.get('/api/students/:id', (req, res) => { // <-- CORREGIDO: 'pp' a 'app'
    const id = parseInt(req.params.id);
    const student = students.find(s => parseInt(s.id) === id); // Asegurar comparación numérica

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }

    // Asegúrate de incluir el nombre de la carrera en la respuesta aquí
    const careerObj = careers.find(c => c.id === student.career_id);
    const studentWithCareerName = {
        ...student,
        careerName: careerObj ? careerObj.name : 'Desconocida'
    };

    return res.status(200).json(studentWithCareerName);
});

// Actualizar estudiante por ID
app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => parseInt(s.id) === id); // Asegurar comparación numérica

    if (index === -1) {
        return res.status(404).json({ error: "Student not found for update." });
    }

    const { name, career_id } = req.body;

    if (!name || !career_id) {
        return res.status(400).json({ error: "Missing required fields: name and career_id for update." });
    }

    const careerIdNum = parseInt(career_id);
    const careerObj = careers.find(c => c.id === careerIdNum);
    if (!careerObj) {
        return res.status(400).json({ error: "Career not found for update." });
    }

    students[index] = {
        ...students[index],
        name,
        career: careerObj.name, // Actualiza el nombre de la carrera también
        career_id: careerIdNum
    };
    saveStudents(students);

    return res.status(200).json({ message: "Student updated successfully.", student: students[index] });
});

// Eliminar estudiante por ID   
app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => parseInt(s.id) === id); // Asegurar comparación numérica

    if (index === -1) {
        return res.status(404).json({ error: "Student not found for deletion." });
    }

    students.splice(index, 1);
    saveStudents(students); // Guardar cambios

    return res.status(200).json({ message: "Student deleted successfully." });
});

// Consultar todos los estudiantes o filtrar por carrera (mueve esta lógica aquí)
app.get('/api/students', (req, res) => {
    const { career } = req.query; // Busca por career_id pasado como query param
    const { name } = req.query; // Busca por nombre de estudiante

    let filteredStudents = students;

    if (career) {
        const careerIdNum = parseInt(career);
        if (!isNaN(careerIdNum)) {
            filteredStudents = filteredStudents.filter(s => parseInt(s.career_id) === careerIdNum); // Asegurar comparación numérica
        } else {
            // Si 'career' no es un número, asume que es el nombre de la carrera
            filteredStudents = filteredStudents.filter(s => s.career.toLowerCase().includes(career.toLowerCase()));
        }
    }

    if (name) {
        filteredStudents = filteredStudents.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    }

    // Añade el nombre de la carrera a cada estudiante antes de devolverlos
    const studentsWithCareerNames = filteredStudents.map(s => {
        const careerObj = careers.find(c => c.id === s.career_id);
        return {
            ...s,
            careerName: careerObj ? careerObj.name : 'Desconocida' // Añade careerName
        };
    });

    return res.status(200).json(studentsWithCareerNames);
});


// CRUD para carrera
// Registrar nueva carrera
app.post('/api/careers', (req, res) => {
    const { code, name, faculty_id, level, duration } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Missing required field: name." });
    }

    const existingCareer = careers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingCareer) {
        return res.status(409).json({ error: "Career already exists." });
    }

    const newCareersId = careers.length ? careers[careers.length - 1].id + 1 : 1;

    const newCareer = {
        id: newCareersId,
        code,
        name,
        faculty_id: faculty_id ? parseInt(faculty_id) : undefined,
        level,
        duration
    };

    careers.push(newCareer);
    saveCareers(careers);

    return res.status(201).json({ message: "Career registered successfully.", career: newCareer });
});
// Consultar carrera por ID
app.get('/api/careers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const career = careers.find(c => parseInt(c.id) === id); // Asegurar comparación numérica

    if (!career) {
        return res.status(404).json({ error: "Career not found." });
    }

    return res.status(200).json(career);
});
// Editar carrera por ID
app.put('/api/careers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log("ID recibido:", id);
    console.log("IDs en memoria:", careers.map(c => c.id));
    const index = careers.findIndex(c => parseInt(c.id) === id); // Asegurar comparación numérica

    if (index === -1) {
        return res.status(404).json({ error: "Career not found." });
    }

    const { code, name, faculty_id, level, duration } = req.body;
    careers[index] = {
        ...careers[index],
        code,
        name,
        faculty_id: parseInt(faculty_id),
        level,
        duration
    };
    saveCareers(careers);
    return res.json(careers[index]);
});
// Consultar todas las carreras
app.get('/api/careers', (req, res) => {
    const careerName = req.query.name;

    if (careerName) {
        const filteredCareers = careers.filter(c => c.name.toLowerCase() === careerName.toLowerCase());
        return res.status(200).json(filteredCareers);
    }
    return res.status(200).json(careers);
});

// Borrar carrera por ID
app.delete('/api/careers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = careers.findIndex(c => parseInt(c.id) === id); // Asegurar comparación numérica

    if (index === -1) {
        return res.status(404).json({ error: "Career not found for deletion." });
    }

    // Verificar si hay estudiantes asociados a la carrera (usa career_id y no el nombre)
    const studentsInCareer = students.filter(s => parseInt(s.career_id) === id); // Asegurar comparación numérica
    if (studentsInCareer.length > 0) {
        return res.status(400).json({ error: "Cannot delete career with associated students." });
    }

    careers.splice(index, 1);
    saveCareers(careers); // Guardar cambios

    return res.status(200).json({ message: "Career deleted successfully." });
});


//CRUD para categorías de carreras
app.post('/api/categories', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Missing required field: name." });
    }

    const existingCategory = categories.find(c => c.name.toLowerCase() === name.toLowerCase());

    if (existingCategory) {
        return res.status(409).json({ error: "Career category already exists." });
    }

    const newCategoryId = categories.length ? categories[categories.length - 1].id + 1 : 1;

    const newCategory = {
        id: newCategoryId,
        name
    };

    categories.push(newCategory);
    saveCategories(categories); // Guardar cambios

    return res.status(201).json({ message: "Career category registered successfully.", category: { name } });
});

// Consultar categoría de carrera por ID
app.get('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const category = categories.find(c => parseInt(c.id) === id); // Asegurar comparación numérica

    if (!category) {
        return res.status(404).json({ error: "Career category not found." });
    }

    return res.status(200).json(category);
});

// Consultar todas las categorías de carreras
app.get('/api/categories', (req, res) => {
    const categoryName = req.query.name;

    if (categoryName) {
        const filteredCategories = categories.filter(c => c.name.toLowerCase() === categoryName.toLowerCase());
        return res.status(200).json(filteredCategories);
    }
    return res.status(200).json(categories);
});
// PARA MODIFICAR FACULTAD CARGADA
app.put('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categories.findIndex(c => parseInt(c.id) === id); // Asegurar comparación numérica
    if (index === -1) {
        return res.status(404).json({ error: "Categoría no encontrada" });
    }
    categories[index] = { ...categories[index], ...req.body };
    saveCategories(categories); // <-- Debe recibir el array
    res.status(200).json(categories[index]);
});
// Borrar categoría de carrera por ID
app.delete('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categories.findIndex(c => parseInt(c.id) === id); // Asegurar comparación numérica

    if (index === -1) {
        return res.status(404).json({ error: "Career category not found for deletion." });
    }

    // Verificar si hay carreras asociadas a la categoría (usar category_id)
    const careersInCategory = careers.filter(c => parseInt(c.faculty_id) === id); // Asegurar comparación numérica
    if (careersInCategory.length > 0) {
        return res.status(400).json({ error: "Cannot delete category with associated careers." });
    }

    categories.splice(index, 1);
    saveCategories(categories); // Guardar cambios

    return res.status(200).json({ message: "Career category deleted successfully." });
});

// ============================
// Start server
// ============================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});