/// URLs de la API
const API_BASE_URL = "http://localhost:5001/api";
const API_STUDENTS_URL = `${API_BASE_URL}/students`;
const API_CAREERS_URL = `${API_BASE_URL}/careers`;
const API_CATEGORIES_URL = `${API_BASE_URL}/categories`;

// Configuración de autenticación
const API_KEY = "12345ABCDEF";
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// ==============================================
// FUNCIONES DE UTILIDAD
// ==============================================

// Function to display results in a specified div
function showResult(divId, message, isError = false) {/// Esta funcion se usa para mostrar mensajes de exito o error en un div especifico
    const resultDiv = document.getElementById(divId);
    if (resultDiv) {
        resultDiv.innerHTML = message;
        resultDiv.className = `mt-3 alert ${isError ? 'alert-danger' : 'alert-success'}`;
        resultDiv.style.display = 'block';
    } else {
        console.warn(`Result div with ID '${divId}' not found.`);
    }
}

// ==============================================
// SERVICIOS PARA CARRERAS
// ==============================================

async function registerCareerService(careerData) {/// aca se remite desde el carreras.html cuando el usurio pone registrar carrera
    const response = await fetch(API_CAREERS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(careerData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }

    return await response.json();
}

async function getAllCareersService() {/// aca se remite desde el carreras.html cuando el usurio quiere ver todas las carreras
    const response = await fetch(API_CAREERS_URL, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

// Servicio para obtener una carrera por ID
/// cuando desde carreras.html se busca una carrera por ID viene aca
async function getCareerByIdService(id) {
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {//// aca se remite desde carreras.html cuando el usurio quiere ver una carrera por ID
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

// Servicio para eliminar una carrera por ID
async function deleteCareerService(id) {/// Cuando desde carreras.html se quiere eliminar una carrera por ID viene aca
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

async function updateCareerService(id, data) {/// Esta funcion se usa para actualizar una carrera por ID desde carreras.html
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {/// aca se remite desde carreras.html cuando el usurio pone actualizar carrera
        method: "PUT",
        headers,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

// ==============================================
// FUNCIONES PARA CARRERAS (manejo de UI)
// ==============================================

async function handleRegisterCareer(event) {/// Esta funcion se usa para registrar una carrera desde carreras.html
    event.preventDefault();

    const code = document.getElementById('careerCode').value.trim();
    const name = document.getElementById('careerName').value.trim();
    const faculty_id = document.getElementById('facultySelect').value;
    const level = document.getElementById('categorySelect').value.trim(); /// Ahora categorySelect tendrá opciones de nivel fijas
    const duration = document.getElementById('duration').value.trim();

    // Re-validación con los valores correctos
    if (!code || !name || !faculty_id || !level || !duration) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Todos los campos son obligatorios'
        });
        return;
    }

    const careerData = { code, name, faculty_id: Number(faculty_id), level, duration: Number(duration) }; // Ensure numbers
    try {
        const result = await registerCareerService(careerData); // Captura la respuesta
        Swal.fire({
            icon: 'success',
            title: '¡Carrera registrada correctamente!',
            text: `ID de la carrera: ${result.career.id}` // Muestra el ID de la carrera creada
        });
        document.getElementById('careerForm').reset();
        await loadCareersTable();
    } catch (error) {
        console.error("Error al registrar carrera:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al registrar carrera',
            text: error.message
        });
    }
}

function generateCareerCode() {/// Esta funcion genera un codigo unico para cada carrera
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `CARR-${dateStr}-${random}`;
}

async function handleSearchCareerById() {// Esta funcion se usa para buscar una carrera por ID desde carreras.html
    const id = document.getElementById('careerId').value.trim();
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'ID inválido',
            text: 'Por favor ingrese un ID de carrera válido para buscar.'
        });
        return;
    }

    try {
        const career = await getCareerByIdService(id);
        const faculty = await getCategoryByIdService(career.faculty_id); /// Obtiene la facultad por ID
        const resultHTML = `
            <strong>Carrera encontrada:</strong><br><br>
            <strong>ID:</strong> ${career.id}<br>
            <strong>Código:</strong> ${career.code}<br>
            <strong>Nombre:</strong> ${career.name}<br>
            <strong>Facultad:</strong> ${faculty ? faculty.name : 'Desconocida'}<br>
            <strong>Nivel:</strong> ${career.level}<br>
            <strong>Duración:</strong> ${career.duration} años
        `;
        showResult('getCareerResultDiv', resultHTML);
    } catch (error) {
        console.error("Error al buscar carrera por ID:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error buscando carrera',
            text: error.message || 'No se pudo encontrar la carrera con el ID proporcionado.'
        });
        showResult('getCareerResultDiv', 'Error: ' + (error.message || 'Carrera no encontrada.'), true);
    }
}

async function handleDeleteCareerById() {/// Esta funcion se usa para eliminar una carrera por ID desde carreras.html
    const id = document.getElementById('deleteCareerId').value.trim();
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'ID inválido',
            text: 'Por favor ingrese un ID de carrera válido para eliminar.'
        });
        return;
    }

    try {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: `Va a eliminar la carrera con ID ${id}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await deleteCareerService(id);
            Swal.fire({
                icon: 'success',
                title: 'Carrera eliminada',
                text: 'La carrera ha sido eliminada correctamente.'
            });
            document.getElementById('deleteCareerId').value = ''; // Limpiar el campo
            await loadCareersTable(); // Recargar la tabla
            showResult('deleteCareerResultDiv', 'Carrera eliminada correctamente.');
        }
    } catch (error) {
        console.error("Error al eliminar carrera:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al eliminar carrera',
            text: error.message || 'No se pudo eliminar la carrera.'
        });
        showResult('deleteCareerResultDiv', 'Error: ' + (error.message || 'No se pudo eliminar la carrera.'), true);
    }
}

async function editCareer(id) {/// Esta funcion se usa para editar una carrera por ID desde carreras.html
    try {
        const career = await getCareerByIdService(id); /// Obtiene la carrera por ID
        if (!career) {
            Swal.fire('Error', 'Carrera no encontrada para editar.', 'error');
            return;
        }
        const faculties = await getAllCategoriesService(); /// Obtiene todas las facultades para el dropdown (MENU DESPLEGABLE)
        const { value: formData } = await Swal.fire({
            title: 'Editar Carrera',
            html: `
                <div class="mb-3">
                    <label class="form-label">Código</label>
                    <input id="swal-input-code" class="form-control" value="${career.code}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input id="swal-input-name" class="form-control" value="${career.name}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Facultad</label>
                    <select id="swal-input-faculty" class="form-select" required>
                        ${faculties.map(f =>
                            `<option value="${f.id}" ${f.id == career.faculty_id ? 'selected' : ''}>${f.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nivel</label>
                    <input id="swal-input-level" class="form-control" value="${career.level || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Duración</label>
                    <input id="swal-input-duration" type="number" class="form-control" value="${career.duration || ''}">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const code = document.getElementById('swal-input-code').value.trim();
                const name = document.getElementById('swal-input-name').value.trim();
                const faculty_id = document.getElementById('swal-input-faculty').value;
                const level = document.getElementById('swal-input-level').value.trim();
                const duration = document.getElementById('swal-input-duration').value.trim();
                if (!code || !name || !faculty_id) {
                    Swal.showValidationMessage('Código, nombre y facultad son campos obligatorios');
                    return false;
                }
                return { code, name, faculty_id: Number(faculty_id), level, duration: Number(duration) };
            }
        });

        if (formData) {
            await updateCareerService(id, formData);
            Swal.fire('¡Actualizado!', 'La carrera fue actualizada.', 'success');
            await loadCareersTable();
        }
    } catch (error) {
        console.error("Error al editar carrera:", error);
        Swal.fire('Error', error.message || 'No se pudo editar la carrera', 'error');
    }
}

async function deleteCareer(id) {/// Esta funcion se usa para eliminar una carrera por ID desde carreras.html
    try {
        const result = await Swal.fire({// Esta funcion se usa para confirmar la eliminacion de una carrera por ID desde carreras.html
            title: '¿Está seguro?',
            text: `Va a eliminar la carrera con ID ${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {// Si el usuario confirma la eliminacion
            await deleteCareerService(id);
            Swal.fire('¡Eliminado!', 'La carrera fue eliminada.', 'success');
            await loadCareersTable();
        }
    } catch (error) {
        console.error("Error al eliminar carrera:", error);
        Swal.fire('Error', error.message || 'No se pudo eliminar la carrera', 'error');
    }
}


// ==============================================
// SERVICIOS PARA CATEGORÍAS (FACULTADES)
// ==============================================

async function getAllCategoriesService() {/// Esta funcion se usa para obtener todas las facultades desde categorias.html
    const response = await fetch(API_CATEGORIES_URL, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

async function registerCategoryService(categoryData) {/// Esta funcion se usa para registrar una facultad desde categorias.html
    const response = await fetch(API_CATEGORIES_URL, {/// aca se remite desde categorias.html cuando el usurio pone registrar facultad
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(categoryData)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

// Servicio para obtener una categoría por ID
async function getCategoryByIdService(id) {/// Esta funcion se usa para obtener una facultad por ID desde categorias.html
    const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

async function updateCategoryService(id, data) {/// Esta funcion se usa para actualizar una facultad por ID desde categorias.html
    const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {/// aca se remite desde categorias.html cuando el usurio pone actualizar facultad
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

async function deleteCategoryService(id) {/// Esta funcion se usa para eliminar una facultad por ID desde categorias.html
    const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {/// aca se remite desde categorias.html cuando el usurio pone eliminar facultad
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
    }
    return await response.json();
}

// ==============================================
// FUNCIONES PARA CATEGORÍAS (FACULTADES - manejo de UI)
// ==============================================

async function handleSearchCategoryById() {/// Esta funcion se usa para buscar una facultad por ID desde categorias.html
    const id = document.getElementById('categoryId').value.trim();
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'ID inválido',
            text: 'Por favor ingrese un ID válido'
        });
        return;
    }

    try {
        const category = await getCategoryByIdService(id);
        document.getElementById('categoryGetResult').style.display = 'block';
        document.getElementById('categoryGetResult').textContent = JSON.stringify(category, null, 2);
        showResult('categoryGetResultDiv', `
            <strong>Facultad encontrada:</strong><br>
            <strong>ID:</strong> ${category.id}<br>
            <strong>Nombre:</strong> ${category.name}
        `);
    } catch (error) {
        console.error("Error buscando facultad por ID:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error buscando facultad',
            text: error.message
        });
        document.getElementById('categoryGetResult').style.display = 'block';
        document.getElementById('categoryGetResult').textContent = 'Error: ' + error.message;
        showResult('categoryGetResultDiv', 'Error: ' + error.message, true);
    }
}

async function handleDeleteCategoryById() {/// Esta funcion se usa para eliminar una facultad por ID desde categorias.html
    const id = document.getElementById('deleteCategoryId').value.trim();
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'ID inválido',
            text: 'Por favor ingrese un ID válido'
        });
        return;
    }

    try {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: `Va a eliminar la facultad con ID ${id}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await deleteCategoryService(id);
            Swal.fire({
                icon: 'success',
                title: 'Facultad eliminada',
                text: 'La facultad ha sido eliminada correctamente.'
            });

            await loadCategoriesTable();
            document.getElementById('deleteCategoryId').value = '';
        }
    } catch (error) {
        console.error("Error al eliminar facultad:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al eliminar facultad',
            text: error.message
        });
    }
}

async function loadCategoriesTable() {/// Esta funcion se usa para cargar todas las facultades en la tabla de categorias.html
    try {
        const categories = await getAllCategoriesService();
        const tbody = document.querySelector('#categoriesTable tbody');
        if (!tbody) return; // Exit if not on the categories page

        tbody.innerHTML = categories.map(category => `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-category-btn" data-id="${category.id}" data-name="${category.name}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-category-btn" data-id="${category.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.edit-category-btn').forEach(btn => {
            btn.addEventListener('click', async () => { // Make event listener async
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                await editCategory(id, name); // Await the editCategory call
            });
        });

        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', async () => { // Make event listener async
                const id = btn.dataset.id;
                await deleteCategory(id); // Await the deleteCategory call
            });
        });

    } catch (error) {
        console.error("Error cargando facultades:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar facultades',
            text: error.message || 'Intente de nuevo.'
        });
    }
}

async function editCategory(id, currentName) {/// Esta funcion se usa para editar una facultad por ID desde categorias.html
    try {
        const { value: newName } = await Swal.fire({
            title: 'Editar nombre de la facultad',
            input: 'text',
            inputValue: currentName,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: (name) => {
                if (!name || !name.trim()) {
                    Swal.showValidationMessage('El nombre no puede estar vacío');
                    return false;
                }
                return name.trim();
            }
        });

        if (newName) { // Si el usuario ingresa un nuevo nombre
            await updateCategoryService(id, { name: newName });
            Swal.fire({
                icon: 'success',
                title: '¡Facultad modificada!',
                text: 'La modificación fue guardada correctamente.'
            });
            await loadCategoriesTable(); // Recargar tabla después de la actualización
        }
    } catch (error) {
        console.error("Error al editar facultad:", error);
        Swal.fire('Error', error.message || 'Error al editar facultad', 'error');
    }
}

async function deleteCategory(id) {// Esta funcion se usa para eliminar una facultad por ID desde categorias.html
    try {
        const result = await Swal.fire({
            title: '¿Seguro que deseas eliminar esta facultad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await deleteCategoryService(id);
            Swal.fire({
                icon: 'success',
                title: '¡Facultad eliminada!',
                text: 'La facultad ha sido eliminada correctamente.'
            });
            await loadCategoriesTable(); // Recargar tabla después de la eliminación
        }
    } catch (error) {
        console.error("Error al eliminar facultad:", error);
        Swal.fire('Error', error.message || 'Error al eliminar facultad', 'error');
    }
}

async function handleRegisterCategory(event) {/// Esta funcion se usa para registrar una facultad desde categorias.html
    event.preventDefault();
    const name = document.getElementById('categoryName').value.trim();

    if (!name) {
        Swal.fire({
            icon: 'warning',
            title: 'El nombre es obligatorio'
        });
        return;
    }

    try {
        await registerCategoryService({ name });
        Swal.fire({
            icon: 'success',
            title: '¡Facultad registrada correctamente!'
        });
        document.getElementById('categoryForm').reset();
        await loadCategoriesTable(); // Await the table reload
    } catch (error) {
        console.error("Error al registrar facultad:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al registrar facultad',
            text: error.message || 'Intente de nuevo.'
        });
    }
}

// ==============================================
// FUNCIONES PARA CARRERAS Y FACULTADES EN carreras.html
// ==============================================

// Cargar facultades en el select
async function loadFacultiesDropdown() {/// Esta funcion se usa para cargar las facultades en el dropdown de carreras.html
    try {
        const faculties = await getAllCategoriesService();/// Obtiene todas las facultades
        const facultySelect = document.getElementById('facultySelect');/// /// Obtiene el elemento select del DOM (busca el elemento con el ID 'facultySelect' para mostrarlo como un desplegable)
        if (!facultySelect) return;
        facultySelect.innerHTML = '<option value="">Seleccione una facultad</option>';
        faculties.forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty.id;
            option.textContent = faculty.name;
            facultySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando facultades en dropdown:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar facultades para formulario'
        });
    }
}

// Cargar carreras en la tabla
async function loadCareersTable() {/// Esta funcion se usa para cargar todas las carreras en la tabla de carreras.html
    try {
        const [careers, faculties] = await Promise.all([///
            getAllCareersService(),
            getAllCategoriesService()
        ]);
        const tbody = document.querySelector('#careersTable tbody');
        if (!tbody) return; // Exit if not on the careers page

        tbody.innerHTML = careers.map(career => {
            const faculty = faculties.find(f => f.id == career.faculty_id);
            return `
                <tr>
                    <td>${career.id}</td>
                    <td>${career.code}</td>
                    <td>${career.name}</td>
                    <td>${faculty ? faculty.name : 'Sin facultad'}</td>
                    <td>${career.level}</td>
                    <td>${career.duration}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-career-btn" data-id="${career.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-career-btn" data-id="${career.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        document.querySelectorAll('.edit-career-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await editCareer(id);
            });
        });

        document.querySelectorAll('.delete-career-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await deleteCareer(id);
            });
        });

    } catch (error) {
        console.error("Error cargando carreras:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar carreras',
            text: error.message || 'Intente de nuevo.'
        });
    }
}

// ==============================================
// SERVICIOS PARA ESTUDIANTES
// ==============================================

async function registerStudentService(studentData) {/// Esta funcion se usa para registrar un estudiante desde estudiantes.html
    try {
        console.log("Datos enviados a la API (estudiante):", studentData);///   Esta linea es para depurar y ver los datos que se envian a la API   
        const response = await fetch(API_STUDENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en registerStudentService:", error);
        throw error;
    }
}

async function getAllStudentsService() {/// Esta funcion se usa para obtener todos los estudiantes desde estudiantes.html
    try {
        const response = await fetch(API_STUDENTS_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getAllStudentsService:", error);
        throw error;
    }
}

async function getStudentByIdService(id) {/// Esta funcion se usa para obtener un estudiante por ID desde estudiantes.html
    try {
        const response = await fetch(`${API_STUDENTS_URL}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getStudentByIdService:", error);
        throw error;
    }
}

async function updateStudentService(id, studentData) {/// Esta funcion se usa para actualizar un estudiante por ID desde estudiantes.html
    try {
        const response = await fetch(`${API_STUDENTS_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en updateStudentService:", error);
        throw error;
    }
}

async function deleteStudentService(id) {/// Esta funcion se usa para eliminar un estudiante por ID desde estudiantes.html
    try {
        const response = await fetch(`${API_STUDENTS_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en deleteStudentService:", error);
        throw error;
    }
}

// ==============================================
// FUNCIONES PARA ESTUDIANTES (manejo de UI)
// ==============================================

async function handleRegisterStudent(event) {/// Esta funcion se usa para registrar o actualizar un estudiante desde estudiantes.html
    event.preventDefault();

    const form = event.target;
    const studentId = form.dataset.editId;

    const name = document.getElementById('studentName').value.trim();
    const careerSelect = document.getElementById('studentCareer');
    const career_id = Number(careerSelect.value);

    if (!name || !career_id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Nombre y carrera son campos obligatorios'
        });
        return;
    }

    try {
        let result;
        if (studentId) {
            result = await updateStudentService(studentId, { name, career_id });
            Swal.fire({
                icon: 'success',
                title: 'Estudiante actualizado exitosamente'
            });
            form.removeAttribute('data-editId');
            form.querySelector('button[type="submit"]').textContent = 'Registrar';
        } else {
            result = await registerStudentService({ name, career_id });
            Swal.fire({
                icon: 'success',
                title: 'Estudiante registrado exitosamente'
            });
        }

        const careerObjForDisplay = await getCareerByIdService(career_id);
        const resultHTML = `
            <strong>Registro/Actualización exitosa!</strong><br><br>
            <strong>ID:</strong> ${result.student.id || studentId}<br>
            <strong>Nombre:</strong> ${result.student.name || name}<br>
            <strong>Carrera:</strong> ${careerObjForDisplay ? careerObjForDisplay.name : 'Desconocida'}
        `;
        showResult('registerResultDiv', resultHTML);

        document.getElementById('studentForm').reset();
        await loadStudentsTable(); // Await the table reload
    } catch (error) {
        console.error("Error al registrar/actualizar estudiante:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al procesar estudiante',
            text: error.message
        });
        showResult('registerResultDiv', 'Error: ' + error.message, true);
    }
}

async function searchStudentById() {/// Esta funcion se usa para buscar un estudiante por ID desde estudiantes.html
    const id = document.getElementById('studentId').value.trim();
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'ID inválido',
            text: 'Por favor, ingrese un ID de estudiante válido para buscar.'
        });
        return;
    }

    try {
        const student = await getStudentByIdService(id);
        const careerObjForDisplay = await getCareerByIdService(student.career_id);
        const resultHTML = `
            <strong>Estudiante encontrado:</strong><br><br>
            <strong>ID:</strong> ${student.id}<br>
            <strong>Nombre:</strong> ${student.name}<br>
            <strong>Carrera:</strong> ${careerObjForDisplay ? careerObjForDisplay.name : 'Desconocida'}
        `;
        showResult('getResultDiv', resultHTML);
    } catch (error) {
        console.error("Error al buscar estudiante por ID:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error buscando estudiante',
            text: error.message || 'No se pudo encontrar al estudiante con el ID proporcionado.'
        });
        showResult('getResultDiv', 'Error: ' + (error.message || 'Estudiante no encontrado.'), true);
    }
}

async function searchStudentsByCareer() {/// Esta funcion se usa para buscar estudiantes por carrera desde estudiantes.html
    const careerId = document.getElementById('careerFilter').value;///  Obtiene el ID de la carrera seleccionada en el dropdown
    const studentsTableBody = document.querySelector('#studentsTable tbody');

    try {
        const [allStudents, allCareers] = await Promise.all([
            getAllStudentsService(),
            getAllCareersService()
        ]);

        let filteredStudents = allStudents;
        if (careerId) {
            filteredStudents = allStudents.filter(student => student.career_id == careerId);
        }

        if (filteredStudents.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No se encontraron estudiantes',
                text: 'No hay estudiantes para la carrera seleccionada.'
            });
            if (studentsTableBody) {
                studentsTableBody.innerHTML = '<tr><td colspan="4">No se encontraron estudiantes para esta carrera.</td></tr>';
            }
            return;
        }

        if (studentsTableBody) {
            studentsTableBody.innerHTML = filteredStudents.map(student => {
                const careerObj = allCareers.find(c => c.id === student.career_id);
                const careerName = careerObj ? careerObj.name : 'Desconocida';
                return `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${careerName}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-student-btn" data-id="${student.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-student-btn" data-id="${student.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            }).join('');

            // Re-attach event listeners for dynamically added buttons
            document.querySelectorAll('.edit-student-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    await editStudent(id);
                });
            });

            document.querySelectorAll('.delete-student-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    await confirmDeleteStudent(id);
                });
            });
        }


        Swal.fire({
            icon: 'success',
            title: 'Búsqueda completada',
            text: `Se encontraron ${filteredStudents.length} estudiantes.`
        });

    } catch (error) {
        console.error("Error al buscar estudiantes por carrera:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al buscar estudiantes',
            text: error.message || 'Intente de nuevo.'
        });
    }
}

async function editStudent(id) {///// Esta funcion se usa para editar un estudiante por ID desde estudiantes.html
    try {
        const student = await getStudentByIdService(id);
        const careers = await getAllCareersService(); // Fetch all careers for the dropdown

        const { value: formValues } = await Swal.fire({
            title: 'Editar Estudiante',
            html: `
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input id="swal-input-student-name" class="form-control" value="${student.name}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Carrera</label>
                    <select id="swal-input-student-career" class="form-select" required>
                        ${careers.map(c => `<option value="${c.id}" ${c.id === student.career_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const name = document.getElementById('swal-input-student-name').value.trim();
                const career_id = document.getElementById('swal-input-student-career').value;
                if (!name || !career_id) {
                    Swal.showValidationMessage('Nombre y carrera son obligatorios');
                    return false;
                }
                return { name, career_id: Number(career_id) };
            }
        });

        if (formValues) {
            await updateStudentService(id, formValues);
            Swal.fire('¡Actualizado!', 'El estudiante fue actualizado correctamente.', 'success');
            await loadStudentsTable(); // Reload table after update
        }
    } catch (error) {
        console.error("Error al editar estudiante:", error);
        Swal.fire('Error', error.message || 'No se pudo editar el estudiante', 'error');
    }
}

async function confirmDeleteStudent(id) { ///esta función se reutiliza en deleteStudentById esta función se encarga de confirmar la eliminación de un estudiante
    try {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: `Va a eliminar al estudiante con ID ${id}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await deleteStudentService(id);
            Swal.fire('¡Eliminado!', 'El estudiante ha sido eliminado correctamente.', 'success');
            await loadStudentsTable(); // Reload table after deletion
        }
    } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        Swal.fire('Error', error.message || 'No se pudo eliminar al estudiante.', 'error');
    }
}

async function deleteStudentById() {/// Esta funcion se usa para eliminar un estudiante por ID desde estudiantes.html
    const id = document.getElementById('deleteId').value.trim();
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'ID inválido',
            text: 'Por favor, ingrese un ID de estudiante válido para eliminar.'
        });
        return;
    }
    await confirmDeleteStudent(id); // Reusing the confirmDeleteStudent logic
    document.getElementById('deleteId').value = ''; // Clear input field
}

// Cargar carreras en el dropdown de estudiantes
async function loadCareersDropdown() {/// Cargar facultades en el select
    try {
        const careers = await getAllCareersService();
        const studentCareerSelect = document.getElementById('studentCareer');
        const careerFilterSelect = document.getElementById('careerFilter');

        if (studentCareerSelect) {
            studentCareerSelect.innerHTML = '<option value="">Seleccione una carrera</option>';
            careers.forEach(career => {
                const option = document.createElement('option');
                option.value = career.id;
                option.textContent = career.name;
                studentCareerSelect.appendChild(option);
            });
        }

        if (careerFilterSelect) {
            careerFilterSelect.innerHTML = '<option value="">Todas las carreras</option>';
            careers.forEach(career => {
                const option = document.createElement('option');
                option.value = career.id;
                option.textContent = career.name;
                careerFilterSelect.appendChild(option);
            });
        }

    } catch (error) {
        console.error("Error cargando carreras en dropdown:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar carreras para formulario'
        });
    }
}

// Cargar estudiantes en la tabla
async function loadStudentsTable() {/// Esta funcion se usa para cargar todos los estudiantes en la tabla de estudiantes.html
    try {
        const [students, careers] = await Promise.all([
            getAllStudentsService(),
            getAllCareersService()
        ]);
        const tbody = document.querySelector('#studentsTable tbody');
        if (!tbody) return; // Exit if not on the students page

        tbody.innerHTML = students.map(student => {
            const career = careers.find(c => c.id === student.career_id);
            const careerName = career ? career.name : 'Desconocida';
            return `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${careerName}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-student-btn" data-id="${student.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-student-btn" data-id="${student.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Re-attach event listeners for dynamically added buttons
        document.querySelectorAll('.edit-student-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await editStudent(id);
            });
        });

        document.querySelectorAll('.delete-student-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await confirmDeleteStudent(id);
            });
        });

    } catch (error) {
        console.error("Error cargando estudiantes:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar estudiantes',
            text: error.message || 'Intente de nuevo.'
        });
    }
}


// ==============================================
// INICIALIZACIÓN DE LA APLICACIÓN (PARA CADA PÁGINA)
// ==============================================

document.addEventListener('DOMContentLoaded', async () => {/// Esta funcion se usa para inicializar la aplicacion y cargar los datos necesarios al cargar cada pagina
    // Logic for index.html (Students page)
    if (document.getElementById('studentForm')) {
        console.log("Initializing Student Page...");
        await loadCareersDropdown(); // Load careers for the student form dropdown
        await loadStudentsTable(); // Load students into the table

        // Set up event listeners for student page
        document.getElementById('studentForm').addEventListener('submit', handleRegisterStudent);
        const searchByIdBtn = document.getElementById('searchByIdBtn');
        if (searchByIdBtn) searchByIdBtn.addEventListener('click', searchStudentById);
        const searchByCareerBtn = document.getElementById('searchByCareerBtn');
        if (searchByCareerBtn) searchByCareerBtn.addEventListener('click', searchStudentsByCareer);
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) deleteBtn.addEventListener('click', deleteStudentById);
    }

    // Logic for carreras.html (Careers page)
    if (document.getElementById('careerForm')) {
        console.log("Initializing Careers Page...");
        await loadFacultiesDropdown(); // Load faculties for career registration/edit dropdown
        await loadCareersTable(); // Load existing careers into the table

        // Set up event listeners for career page
        document.getElementById('careerForm').addEventListener('submit', handleRegisterCareer);
        const generateCodeBtn = document.getElementById('generateCodeBtn');
        if (generateCodeBtn) {
            generateCodeBtn.addEventListener('click', () => {
                document.getElementById('careerCode').value = generateCareerCode();
            });
        }
        const searchCareerBtn = document.getElementById('searchCareerBtn');
        if (searchCareerBtn) searchCareerBtn.addEventListener('click', handleSearchCareerById);
        const deleteCareerBtn = document.getElementById('deleteCareerBtn');
        if (deleteCareerBtn) deleteCareerBtn.addEventListener('click', handleDeleteCareerById);
    }

    // Logic for categorias.html (Faculties/Categories page)
    if (document.getElementById('categoryForm')) {
        console.log("Initializing Categories Page...");
        await loadCategoriesTable(); // Load existing categories into the table

        // Set up event listeners for category page
        document.getElementById('categoryForm').addEventListener('submit', handleRegisterCategory);
        const searchCategoryBtn = document.getElementById('searchCategoryBtn');
        if (searchCategoryBtn) searchCategoryBtn.addEventListener('click', handleSearchCategoryById);
        const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');
        if (deleteCategoryBtn) deleteCategoryBtn.addEventListener('click', handleDeleteCategoryById);
    }
});
/// PROFESOR:

/// TUVE INCONVENIENTE (UNOS MINUTOS ANTES DE SUBIR EL TRABAJO) DESPUES DE HABER AGREGADO LA EXPLICACION EN CADA UNA DE LAS LINEAS DONDE SE ENCONTRABAN LAS FUNCIONES.
// ESTE APP. JS NO TIENE NADA POR QUE LLEGO UN PUNTO QUE DEJO DE FUNCIONARME, NO PUDIENDO ENCONTRAR DONDE ESTABA EL ERROR.
// SE LO PASE A LA IA Y ME MARCO QUE SE HABIA MODIFICADO EN VARIAS LINEAS. ES POR ELLO QUE SE LO COLOCO AL FINAL.
/// TAMBIEN ME CUESTA PODER EXPLICAR CADA UNA DE LAS FUNCIONES, PORQUE NO TENGO NINGUNA EXPERIENCIA EN JAVASCRIPT, ME
/// CUESTA MUCHICIMO PODER UTILIZAR LOS TERMINOS ESPECIFICOS. SI BIEN PUEDO ENTEDER A RAZGOS GENERALES QUE PUEDE 
// CADA FUNCION, EL MOMENTO DE EXPRESARLO Y PODER PLANTEARLO RELACIONANDO EL HTML EL APPS Y LA API POR CADA FUNCION ES AHI
// DONDE SE COMPLICA. NO OBSTANTE, ME ESFUERZO POR PODER ENTENDER Y EXPLICAR CADA UNA DE LAS FUNCIONES Y COMO SE RELACIONAN ENTRE SI.
//
// POR LO QUE LA EXPLICACION SE LO VOY A COLOCAR EN EL ARCHIVO  README TP1.MD==
