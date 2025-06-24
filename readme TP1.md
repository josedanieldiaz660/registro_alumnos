# AL FINAL DESARROLLADO FLUJO Y IA UTILIZADAS ( NO SE SI BORRAR ESTO QUE ESTA A CONTINUACION)

---

## 📍 Introduction

This is an educational REST API for managing a simple database of students. It allows you to:

- Register new students.
- Query students by ID.
- Query students by career.
- Delete students.

Student data is persisted using a local JSON file (`students.json`) to simulate a database.

---

## 🔍 Base URL

```bash
http://localhost:5001/api/students
```

The server must be running on port `5001`.

---

## 🔒 Authentication

All requests must include an **API Key** in the Authorization header:

```text
Authorization: Bearer 12345ABCDEF
```

If the key is missing or incorrect, the server will respond with `401 Unauthorized`.

---

## 🔍 Endpoints

### 1. Register New Student

- **URL**: `/api/students`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer 12345ABCDEF`
- **Body**:

```json
{
  "name": "John Doe",
  "career": "Engineering"
}
```

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:

```json
{
  "message": "Student registered successfully.",
  "student": {
    "id": 51,
    "name": "John Doe",
    "career": "Engineering"
  }
}
```

### 2. Get Student by ID

- **URL**: `/api/students/:id`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "career": "Engineering"
}
```

- **Error Response**:
  - **Code**: `404 Not Found`

```json
{
  "error": "Student not found."
}
```

### 3. Get Students by Career

- **URL**: `/api/students?career=CareerName`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Example**:

```bash
GET /api/students?career=Engineering
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content** (array of matching students):

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "career": "Engineering"
  },
  {
    "id": 6,
    "name": "Fiona Miller",
    "career": "Engineering"
  }
]
```

- **Error Response**:
  - **Code**: `400 Bad Request` if `career` is missing.

```json
{
  "error": "Career filter is required."
}
```

### 4. Delete Student by ID

- **URL**: `/api/students/:id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Success Response**:
  - **Code**: `200 OK`

```json
{
  "message": "Student deleted successfully."
}
```

- **Error Response**:
  - **Code**: `404 Not Found`

```json
{
  "error": "Student not found for deletion."
}
```

---

## 💡 Notes

- All responses are in JSON format.
- If you modify the students (add/delete), changes are saved automatically to `students.json`.
- Restarting the server preserves the updated list thanks to JSON persistence.

---

## 💼 Example Authorization Header

```text
Authorization: Bearer 12345ABCDEF
```

This must be included in every request.

---

# 📖 Educational Objectives

- Practice sending requests to a REST API.
- Learn about HTTP methods: `GET`, `POST`, `DELETE`.
- Understand JSON data format.
- Experience basic server-side persistence.
- Manage authentication with API keys.

---

**Happy coding! 🚀**


ara la elaboración de la pagina 

INTELIGENCIAS ARTIFICIALES UTILIZADAS:

Para la elaboración de la presente pagina Web se utilizaron las siguientes inteligencias artificiales:

•	CHAT.DEEPSEEK: Esta inteligencia artificial, fue la primera que se utilizó, no solo para programar, sino que es la utilizada por primera inteligencia artificial. Por ser la primera herramienta, y al no conocer cómo se utilizaba ninguna, tomaba al pie de la letra cada una de las sugerencias que me daba como respuesta. Luego, comencé a entender y a diferenciar cada una de las necesidades que tenía, que parte del lenguaje estaba trabajando. Es así que comencé a entender que para que se ajustara a lo que realmente quería como resultado tres cuestiones muy importantes:
		Mayor claridad de parte mía de lo que realmente necesitaba hacer.
		En función de lo anterior, debía limitar dando un contexto mas acotado con palabras mas exactas y definidas para que no 		ampliara mas allá de lo que realmente estaba necesitando.
		Debía controlar cada resultado antes de copiar y pegar, comprobando posteriormente el resultado. Por ejemplo me agregaba 		elementos del css al código html cuando no se lo había pedido.
Al utilizar comando muy extensos y pedirles que me los corrija, esta inteligencia no da repuesta, se queda como colgada y hay que volver a cargar la página, no funcionando igualmente. Lo mismo cuando le subía los archivos completos. En mi caso no resulto. 
Por todo esto, es que esta inteligencia artificial la utilizo para comando especifico o cuestiones muy puntuales.

•	CHAT. GPT: esta seria la segunda inteligencia que comencé a utilizar, a pesar de que fue la primera que tenía conocimiento que existía. Para lo que es programación, me sirvió en partes. No logre comprender las explicaciones que me daban ante las consultas en la mayoría de los casos. La forma en que me presentaba los resultados no era muy comprensible para mí. Entiendo que puede tener otras funcionalidades pero para programación no me resultó muy útil.


•	COPILOTO GITHUB: esta la empecé a utilizar debido a que la otras dos anteriores no me estaban dando resultado con las instrucciones que le estaba dando, y lo que estaba necesitando. Es en ese contexto, donde pude comenzar a reparar errores muy finos o que requerían de la utilización más específica de los códigos, como ser para “ELEMINAR “algún estudiante, carrera, o facultad, donde  ya no solo debía trabajar o realizar modificación en los .html, o en app.js, si no en la api index.js. Al realizar modificaciones que necesariamente debía relacionar al menos 3 archivos, esta inteligencia enfocada en programación y al estar dentro del visual studio code, resulto ser la mas productiva y facil de seguir. 
Con esta inteligencia me anime a realizar cambios puntuales, sin temor a que se rompiera el código, debido a que me daba los parámetros para poder hacerlo sin problemas. Es la que más útil me resultó y pude avanzar, pudiendo solucionar problemas o errores que iban surgiendo. Tuve que dejar usarla (justo cuando mas la necesitaba para finalizar) debido a que la licencia de 30 días se había vencido, teniendo que volver a utilizar las anteriores y probar Gimini IA


•	GIMINI IA: Esta inteligencia fue la última de las que utilice en este periodo. Existe una diferencia importante en la forma que presenta los resultados cuando se utiliza la opción gratuita o la Pro que se puede utilizar por momentos limitados. Cuando se utiliza la Pro 2.5, la forma de diagramar la respuesta es mucho mas clara y comprensible, pudiendo pedirles cuadros comparativos que son amplios en el desarrollo, sin plantear parámetros específicos. En cambio, la gratuita, la forma en que presenta los resultados en lo que tiene que ver con la programación, es muy línea y menos comprensible. Para que esta sea mas clara se le debe dar un contexto mas especifico con los pasos necesario y la forma en que se necesita. Por lo que noto una diferencia para lo que es en programación entre la versión gratuita y la versión Pro (siendo esta ultima mucho mas aplicable). 




Se procede a explicar el flujo acorde al diagrama del tp elaborado (con ayuda de la IA)

PARA ESTUDIANTES:
•	REGISTRAR: Cuando el usuario quiera registrar o actualizar un estudiante al presionar el botón de registrar (index.html) esta funcion recolecta los valores del formulario y los envía al servicio studentname si el id del estudiante existe, se actualiza, llama a registerstudentservice (studendata). Este valor va al endpoint en app.post ('api/students', studentdata) el que recibe la petición. luego valida los datos y los guarda en la base de datos. si el id no existe, se crea un nuevo estudiante. también busca la carrera por id para asegurarse que existe. si todo es correcto, muestra un mensaje de éxito y actualiza la tabla de estudiantes. Si hay un error, muestra un mensaje de error// El nuevo estudiante se agrega en el array Students y lo guarda en el Student.json usando save student. Devuelve una 201 si se creó correctamente y los mensajes del estudiante creado.

•	PARA LEER: Cuando el usuario carga la página y se leen todos los estudiantes, se ejecuta el código DOMContenLoaded  para inicializar los eventos y cargar los datos necesarios. El comando DOM se activa. Este llama a initStudentPage, que a su vez ejecuta loadStudentsTable. loadStudentsService llama al servicio getAllStudents. este servicio envia una GET  a http://localhost:5001/api/students. el archivo Index.js. El endpoint app.get ('/api/students'...) recibe la petición y lee todo el contenido del archio students.json usando loadStudent. Devuelve  una respuesta 200 ok con el array completo en formato Json.

•	PARA MODIFICAR:Cuando el usuario presiona el botón de editStudent (id) para modificr un registro que ya esta guardado ejecuta editStudent (id) esta función obtiene los datos del estudiante a editar y las carreras disponibles (getStudentByIdService, getAllCareersService). muestra un modal de SweetAlert2 con un formulario pre llenado con los datos actuales. Cuando el ususario gurda se llama  updateStudentService (id, formaData) que envia una peticion de Put a http://localhost:5001/api/students/:id. En el Endpoin app.put( /api/students/:id) recibe la petición y edita  el estudiante. Si lo encuentra, actualiza sus propiedades (name, career_id) con con los datos del cuerpo de la petición guarda el array Students actualizado en students.json con saveStudents. Devuelve una respuesta 200 OK con el estudiante actualizado en formato JSON. Si no lo encuentra, devuelve un error 404 Not Found. la Función editStuden recibe la respuesta extito y muestr la la alerta de actualizada. llama a loadStudenTable para refrescar la tabla en index.html con los datos ya actualizados.

•	PARA ELIMINAR: cuando el usuario quiere eliminar un estudiante presiona el botón de eliminar, se ejecuta esta función.(cornfirmDeleteStudent).  La función muestra el diálogo de confirmación de SweetAlert2.Si el usuario confirma, se llama a deleteStudentService (id)que envia una petición delete a http://localhost:5001/api/students/:id.El endpoint app.delete ('/api/students/:id') recibe la petición y busca en el array student por su  ID.Si lo encuentra, lo elimina del array y guarda el array actualizado en students.json . Devuelve una respuesta 200 ok con un mensaje de éxito. Si no lo encuentra, devuelve un error 404 Not Found. La cuncion confirmaDeleteStudent en app.js recibe la respuesta exitosa. Muestra una alerta de "eliminado. Llama a loadStudentsTable para refescar la tabla y este ya no aparecerá en la tabla de estudiantes.

PARA CARRERAS

•	REGISTRAR: Cuando el usuario presióna el boton "Registrar" en la carreras.html, se activa esta función handleRegisterCareer. Esta recopila los valores de los campos del formulario de carrera, incluyendo los generados careerCode nombre, facultad Id de facultad, nivel y duración. Luego registerCareerService(careerData), llama a la función y pasa la información de carrera recopilada. Este servicio envía una POST solicitud al punto final de la API /api/careers.El backend  app.post('/api/careers', ...) en el endpoint en index.js, recibe esta solicitud. Este endpoint valida si el nombre se proporciona el campo. También comprueba si ya existe una carrera con el mismo nombre para evitar duplicados.Se genera un nuevo para la carrera. Los datos de la id nueva carrera (incluidos id, code, name, , y ) se añaden a la matriz. Esta se guarda en el archivo en careers.json Si la carrera se crea correctamente, el backend genera código de estado junto con un mensaje de éxito y los detalles de la carrera recién creada. Si hay algún error (por ejemplo, falta un nombre o el nombre de la carrera está duplicado), se devuelve el estado y el mensaje de error correspondientes. tras una respuesta correcta de [número registerCareerServicefaltante], se muestra el mensaje "¡Carrera registrada correctamente!" mediante SweetAlert2. Se restablece el formulario de carreras y loadCareersTable()se llama a la función para actualizar la lista de carreras mostrada. Si se produce un error durante el proceso de registro, se muestra un mensaje de error mediante SweetAlert2.

•	PARA LEER: Cuando el usuario desee ver el listado de carreras en carreras.html, se activa la función loadCareersTable ( app.js) Llamar a la función de servicio getAllCareersService(). Este envía una solicitud GET al endpoint /api/careers. El backend, a través de app.get('/api/careers', ...)en index.js, recibe esta solicitud. Este punto final:Cargue las carreras existentes desde el archivo careers.json utilizando la función loadCareers(); Cargue las categorías (facultades) desde el archivo categories.jsonutilizando la función loadCategories(). Asocie cada carrera con el nombre de su facultad correspondiente para una visualización más amigable. Devuelve un código de estado 200junto con el array de todas las carreras (incluyendo el nombre de la facultad). En app.js, después de una respuesta correcta de getAllCareersService(), la función loadCareersTable()itera sobre la lista de carreras recibidas y las agrega dinámicamente a la tabla con el id="careersTable"en carreras.html. Para cada carrera, se crea una fila y se insertan las celdas con la información de la carrera (ID, Código, Nombre, Facultad, Nivel, Duración) y los botones de acciones (Editar y Eliminar). Si ocurre un error durante el proceso, se muestra un mensaje de error mediante SweetAlert2.

•	PARA ACTUALIZAR /MODIFICAR Cuando el usuario presiona el botón "Actualizar Carrera" en carreras.html(asociado al formulario de actualización), se activa la función (la función específica no se proporciona en los snippets, pero asumimos que es similar a registerCareerServicey updateCareerServiceen app.js). Esta función se encarga de: Recopilar los valores de los campos del formulario de actualización de carrera, incluyendo el idde la carrera a actualizar, el careerCode, nombre, faculty_id, nively duracion. Llama a la función de servicio updateCareerService(id, careerData). Este servicio (definido en app.js) envía una solicitud PUTal endpoint /api/careers/:id, donde :ides el ID de la carrera que se desea actualizar, y careerDatacontiene los nuevos datos de la carrera. El backend, a través de app.put('/api/careers/:id', ...)en index.js, recibe esta solicitud. Este punto final: Obtiene el idde la carrera de los parámetros de la URL;Busca la carrera con ese iden el array de carreras cargadas desde careers.json; Si la carrera no se encuentra, devuelve un error con código de estado 404; Si la carrera se encuentra, actualiza sus propiedades con los datos proporcionados en el cuerpo de la solicitud ( req.body); Valida que el nombrede la carrera no esté vacío y que no exista otra carrera con el mismo nombre (excepto la que se está actualizando) para evitar duplicados. Guarde los cambios en el archivo careers.jsonutilizando la función saveCareers(); Si la actualización es exitosa, el backend devuelve un código de estado 200junto con un mensaje de éxito y los detalles de la carrera actualizados. Si hay algún error (por ejemplo, datos faltantes o nombre duplicado), se devuelve el estado y el mensaje de error correspondiente. En app.js, después de una respuesta correcta de updateCareerService(), se muestra el mensaje "¡Carrera actualizada correctamente!" mediante SweetAlert2. Se restablece el formulario de carreras y se llama a la función loadCareersTable()para actualizar la lista de carreras mostrada. Si se produce un error durante el proceso de actualización, se mostrará un mensaje de error mediante SweetAlert2.

•	ELIMINAR CARRERA: Cuando el usuario presiona el botón "Eliminar Carrera" en carreras.html(asociado al campo de entrada deleteCareerId), se activa la función handleDeleteCareer()(ubicada en app.js).Esta función handleDeleteCareer()se encarga de:Obtener el id de la carrera a eliminar desde el campo de entrada deleteCareerId; Mostrar un cuadro de diálogo de confirmación (SweetAlert2) para asegurarse de que el usuario realmente desea eliminar la carrera; Si el usuario confirma, llama a la función de servicio deleteCareerService(id). Este servicio (definido en app.js) envía una solicitud DELETE al endpoint /api/careers/:id, donde :ides el ID de la carrera que se desea eliminar; El backend, a través de app.delete('/api/careers/:id', ...)en index.js, recibe esta solicitud. Este punto final;Obtiene el id de la carrera de los parámetros de la URL;Busca la carrera con ese iden el array de carreras cargadas desde careers.json; Si la carrera no se encuentra, devuelve un error con código de estado 404y el mensaje "Carrera no encontrada para eliminar"; Si la carrera se encuentra, la elimina del conjunto de carreras utilizando splice(); Guarde los cambios en el archivo careers.jsonutilizando la función saveCareers(); Si la eliminación es exitosa, el backend devuelve un código de estado 200junto con un mensaje de éxito.En app.js, después de una respuesta correcta de deleteCareerService(), se muestra el mensaje "¡Carrera eliminada exitosamente!" mediante SweetAlert2. Luego, se llama a la función loadCareersTable()para actualizar la lista de carreras mostradas, eliminando la carrera que ha sido borrada. Si se produce un error durante el proceso de eliminación (por ejemplo, si la carrera no se encuentra en el backend), se muestra un mensaje de error mediante SweetAlert2.

PARA FACULTAD
•	PARA CREAR: Cuando el usuario presiona el botón "Registrar Facultad" en categorias.html(asociado al formulario de registro de facultad), se activa la función (la función específica para registrar categorías no está directamente nombrada como registerCategoryServiceen el snippet, pero se infiere su existencia y funcionamiento a partir del patrón de servicios y manejo de formularios en app.js). Esta función (que asumimos maneja el registro de categorías) se encarga de: Recopilar el valor del campo del formulario de registro de facultad, que es el namede la facultad; Llama a la función de servicio registerCategoryService(categoryData). Este servicio (definido app.jspero no visible en el snippet provisto para la creación de categorías, se infiere por los demás servicios) envía una solicitud POSTal endpoint /api/categories. El backend, a través de app.post('/api/categories', ...)en index.js, recibe esta solicitud. Este punto final: Valida si el namede la categoría se proporciona en el cuerpo de la solicitud ( req.body); Comprueba si ya existe una categoría con el mismo namepara evitar duplicados; Si no hay duplicados y el namees válido, genera un nuevo idpara la categoría; Los datos de la nueva categoría (incluidos idy name) se añaden al array de categorías; Esta información se guarda en el archivo categories.jsonmediante la función saveCategories(); Si la categoría se crea correctamente, el backend devuelve un código de estado 201(creado) junto con un mensaje de éxito y los detalles de la categoría recién creada. Si hay algún error (por ejemplo, falta un nombre o el nombre de la categoría está duplicado), se devuelve el estado y el mensaje de error correspondientes. En app.js(aunque el código específico para el manejo de la respuesta de registro de categorías no está visible, se infiere del patrón general), tras una respuesta correcta de registerCategoryService(), se muestra un mensaje de éxito, como "¡Facultad registrada correctamente!" mediante SweetAlert2. Se restablece el formulario de categorías y se llama a la función loadCategoriesTable()para actualizar la lista de facultades mostradas en categorias.html. Si se produce un error durante el proceso de registro, se muestra un mensaje de error mediante SweetAlert2.

•	PARA LEER:Cuando el usuario desee ver el listado de facultades en categorias.html, se activa la función loadCategoriesTable()(ubicada en app.js). Esta función loadCategoriesTable()se encarga de: Limpiar el contenido actual de la tabla de facultades en categorias.htmlpara evitar duplicados al recargar; Llamar a la función de servicio getAllCategoriesService(). Este servicio (definido en app.js) envía una solicitud GETal endpoint /api/categories. El backend, a través de app.get('/api/categories', ...)en index.js, recibe esta solicitud. Este punto final: Cargue las categorías existentes desde el archivo categories.jsonutilizando la función loadCategories(). Devuelve un código de estado 200junto con el array de todas las categorías. En app.js, después de una respuesta correcta de getAllCategoriesService(), la función loadCategoriesTable()itera sobre la lista de facultades recibidas y las agrega dinámicamente a la tabla con el id="categoriesTable"en categorias.html. Para cada facultad, se crea una fila ( <tr>) y se insertan las celdas ( <td>) con la información de la facultad (ID y Nombre) y los botones de acciones (Editar y Eliminar). Si ocurre un error durante el proceso, se muestra un mensaje de error mediante SweetAlert2.

•	PARA ACTUALIZAR/MODIFICAR: Cuando el usuario presiona el botón "Actualizar Facultad" en categorias.html(asociado al formulario de actualización de facultad), se activa la función (la función específica no se proporciona en los snippets, pero asumimos que es similar a handleUpdateCategory()en app.js). Esta función se encarga de; Recopilar los valores de los campos del formulario de actualización de facultad, incluyendo el id de la facultad a actualizar y el nuevo namede la facultad; Llama a la función de servicio updateCategoryService(id, categoryData). Este servicio (definido en app.js) envía una solicitud PUTal endpoint /api/categories/:id, donde :ides el ID de la facultad que se desea actualizar, y categoryDatacontiene el nuevo nombre de la facultad. El backend, a través de app.put('/api/categories/:id', ...)en index.js, recibe esta solicitud. Este punto final: Obtiene el id de la facultad de los parámetros de la URL; Busque la facultad con esa iden el conjunto de categorías cargadas desde categories.json; Si la facultad no se encuentra, devuelve un error con código de estado 404y el mensaje "Categoría no encontrada"; Si la facultad se encuentra, actualiza su propiedad name con el valor proporcionado en el cuerpo de la solicitud ( req.body); Valida que el name de la facultad no esté vacío y que no exista otra facultad con el mismo nombre (excepto la que se está actualizando) para evitar duplicados; Guarde los cambios en el archivo categories.jsonutilizando la función saveCategories(); Si la actualización es exitosa, el backend devuelve un código de estado 200junto con un mensaje de éxito y los detalles de la facultad actualizados. Si hay algún error (por ejemplo, datos faltantes o nombre duplicado), se devuelve el estado y el mensaje de error correspondiente. En app.js, después de una respuesta correcta de updateCategoryService(), se muestra el mensaje "¡Facultad actualizada correctamente!" mediante SweetAlert2. Se restablece el formulario de categorías y se llama a la función loadCategoriesTable()para actualizar la lista de facultades mostradas. Si se produce un error durante el proceso de actualización, se mostrará un mensaje de error mediante SweetAlert2.

1.	ELIMINAR: Categorias.html(asociado al campo de entrada deleteCategoryId), se activa la función handleDeleteCategory()(ubicada en app.js). Esta función handleDeleteCategory()se encarga de: Obtener el idde la facultad a eliminar desde el campo de entrada deleteCategoryId; Mostrar un cuadro de diálogo de confirmación (SweetAlert2) para asegurarse de que el usuario realmente desea eliminar la facultad; Si el usuario confirma, llama a la función de servicio deleteCategoryService(id). Este servicio (definido en app.js) envía una solicitud DELETEal endpoint /api/categories/:id, donde :ides el ID de la facultad que se desea eliminar. El backend, a través de app.delete('/api/categories/:id', ...)en index.js, recibe esta solicitud. Este punto final: Obtiene el idde la facultad de los parámetros de la URL; Busque la facultad con esa iden el conjunto de categorías cargadas desde categories.json; Si la facultad no se encuentra, devuelve un error con código de estado 404y el mensaje "Categoría de carrera no encontrada para eliminación". (Categoría de carrera no encontrada para eliminación);Importante: Antes de eliminar, verifique si hay carreras asociadas a esta facultad (utilizando careers.filter(c => parseInt(c.faculty_id) === id)). Si existen carreras asociadas ( careersInCategory.length > 0), el backend devuelve un error con código de estado 400y el mensaje "No se puede eliminar la categoría con carreras asociadas". (No se puede eliminar la categoría con carreras asociadas), evitando la eliminación de una facultad que tenga carreras registradas bajo ella; Si no hay carreras asociadas, la facultad se elimina del conjunto de categorías que utiliza splice(); Guarde los cambios en el archivo categories.jsonutilizando la función saveCategories(); Si la eliminación es exitosa, el backend devuelve un código de estado 200junto con un mensaje de éxito ("Categoría eliminada exitosamente"). En app.js, después de una respuesta correcta de deleteCategoryService(), se muestra el mensaje "¡Facultad eliminada exitosamente!" mediante SweetAlert2. Luego, se llama a la función loadCategoriesTable()para actualizar la lista de facultades mostradas, eliminando la facultad que ha sido borrada. Si se produce un error durante el proceso de eliminación (por ejemplo, si la facultad no se encuentra o si tiene carreras asociadas), se muestra un mensaje de error mediante SweetAlert2.





