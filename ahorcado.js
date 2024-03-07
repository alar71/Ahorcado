// ### VARIABLES ###

// Array de palabras
var palabras = []; // Array para almacenar las palabras y descripciones
// Palabra a averiguar
var palabra = "";
// Nº aleatorio
var rand;
// Palabra oculta
var oculta = [];
// Elemento html de la palabra
var hueco = document.getElementById("palabra");
// Contador de intentos
var cont = 6;
// Botones de letras
var buttons = document.getElementsByClassName('letra');
// Boton de reset
var btnInicio = document.getElementById("reset");

var filaSeleccionada = null; // Variable global para almacenar la fila seleccionada



// ### FUNCIONES ###

// Escoger palabra al azar
function generaPalabra() {
    // Generar un número aleatorio entre 0 y palabras.length - 1
    rand = Math.floor(Math.random() * palabras.length);
    palabra = palabras[rand].palabra.toUpperCase(); // Acceder a la palabra buscada y la converte en mayúsculas
    console.log(palabra);
    pintarGuiones(palabra.length);
}

// Funcion para pintar los guiones de la palabra
function pintarGuiones(num) {
    hueco.innerHTML = "";
    for (var i = 0; i < num; i++) {
        oculta[i] = "_";
    }
    hueco.innerHTML = oculta.join("");
}

//Generar abecedario
function generaABC(a, z) {
    document.getElementById("abcdario").innerHTML = "";
    var i = a.charCodeAt(0), j = z.charCodeAt(0);
    var letra = "";
    for (; i <= j; i++) {
        letra = String.fromCharCode(i).toUpperCase();
        document.getElementById("abcdario").innerHTML += "<button value='" + letra + "' onclick='intento(\"" + letra + "\")' class='letra' id='" + letra + "'>" + letra + "</button>";
        if (i == 110) {
            //document.getElementById("abcdario").innerHTML += "<button value='Ñ' onclick='intento(\"Ñ\")' class='letra' id='" + letra + "'>Ñ</button>";
            document.getElementById("abcdario").innerHTML += "<button value='Ñ' onclick='intento(\"Ñ\")' class='letra' id='Ñ'>Ñ</button>";
        }
    }
}

// Chequear intento
function intento(letra) {
    console.log(letra);
    document.getElementById(letra).disabled = true;
    if (palabra.indexOf(letra) != -1) {
        for (var i = 0; i < palabra.length; i++) {
            if (palabra[i] == letra) oculta[i] = letra;
        }
        hueco.innerHTML = oculta.join("");
        document.getElementById("acierto").innerHTML = "Bien!";
        document.getElementById("acierto").className += "acierto verde";
    } else {
        cont--;
        document.getElementById("intentos").innerHTML = cont;
        document.getElementById("acierto").innerHTML = "Fallo!";
        document.getElementById("acierto").className += "acierto rojo";
        //document.getElementById("image" + cont).className += "fade-in";
        document.getElementById("horca").src = "img/ahorcado_" + cont + ".png";

    }
    compruebaFin();
    setTimeout(function () {
        document.getElementById("acierto").className = "";
    }, 800);
}

// Obtener pista
function pista() {
    document.getElementById("hueco-pista").innerHTML = palabras[rand].descripcion;
}

// Compruba si ha finalizado
function compruebaFin() {
    if (oculta.indexOf("_") == -1) {
        document.getElementById("msg-final").innerHTML = "Felicidades !!";
        document.getElementById("msg-final").className += "zoom-in";
        document.getElementById("palabra").className += " encuadre";
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        document.getElementById("reset").innerHTML = "Empezar";
        //btnInicio.onclick = function () { location.reload() };
        btnInicio.onclick = function () { jugar_ahorcado() };
    } else if (cont == 0) {
        document.getElementById("msg-final").innerHTML = "Game Over";
        document.getElementById("msg-final").className += "zoom-in";
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        document.getElementById("reset").innerHTML = "Empezar";
        //btnInicio.onclick = function () { location.reload() };
        btnInicio.onclick = function () { jugar_ahorcado() };
    }
}

// Restablecer juego
function inicio() {
    generaPalabra();
    //pintarGuiones(palabra.length);
    generaABC("a", "z");
    cont = 6;
    document.getElementById("intentos").innerHTML = cont;
}

// Jugar al horcado con la lista cargada
function jugar_ahorcado() {
    oculta = []; // hay que reiniciar el array para que pinte bien las lineas azules
    document.getElementById("msg-final").innerHTML = "";
    document.getElementById("hueco-pista").innerText = "";
    document.getElementById("horca").src = "img/ahorcado_6.png";
    document.getElementById("msg-final").classList.remove("zoom-in");
    document.getElementById("palabra").classList.remove("encuadre");
    if (palabras.length > 0) {
        generaPalabra();
        generaABC("a", "z");
        cont = 6;
        document.getElementById("intentos").innerHTML = cont;
        document.getElementById("cierre_modal").click();
    } else {
        console.error("No hay palabras cargadas.");
    }
}

// Iniciar
//window.onload = inicio();
window.onload = iniciaVar();

function iniciaVar() {
    document.getElementById("hueco-pista").innerHTML = '&nbsp';
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    comoEsta();
}



// Apartado de la configuracion

document.getElementById('archivoInput').addEventListener('change', function (event) {
    var archivo = event.target.files[0];

    if (!archivo) {
        console.error('No se seleccionó ningún archivo');
        return;
    }

    // Se pasa el nombre del archivo al label de grabación.
    document.getElementById("nombreFichero").value = archivo.name;

    var lector = new FileReader();

    lector.onload = function (evento) {
        var contenido = evento.target.result;
        var lineas = contenido.split('\n');

        palabras = []; // Reiniciar el array de palabras y descripciones

        lineas.forEach(function (linea) {
            var datos = linea.split(',');
            palabras.push({
                palabra: datos[0].trim(),
                descripcion: datos[1].trim()
            });
        });
        // Ordenar palabras al cargar
        ordenarPalabras();
        mostrarPalabras();
        console.log(palabras);
    };

    lector.onerror = function (error) {
        console.error('Error al leer el archivo:', error);
    };

    lector.readAsText(archivo);
});

function mostrarPalabras() {
    var tbody = document.getElementById("tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de mostrar nuevas palabras

    palabras.forEach(function (palabra) {
        var nuevaFila = document.createElement("tr");
        var tdPalabra = document.createElement("td");
        var tdDescripcion = document.createElement("td");

        tdPalabra.textContent = palabra.palabra;
        tdDescripcion.textContent = palabra.descripcion;

        nuevaFila.appendChild(tdPalabra);
        nuevaFila.appendChild(tdDescripcion);

        tbody.appendChild(nuevaFila);

        // Asociar la función seleccionarFila al evento de clic en cada fila
        nuevaFila.addEventListener("click", function () {
            seleccionarFila(this);
        });
    });

    // Limpiar los campos de entrada después de cargar las palabras
    document.getElementById("inputPalabra").value = "";
    document.getElementById("inputDescripcion").value = "";
}

function agregarElemento() {
    var palabra = document.getElementById("inputPalabra").value;
    var descripcion = document.getElementById("inputDescripcion").value;

    if (palabra.trim() === "" || descripcion.trim() === "") {
        alert("Por favor ingrese una palabra y su descripción.");
        return;
    }

    palabras.push({
        palabra: palabra.trim(),
        descripcion: descripcion.trim()
    });


    ordenarPalabras();
    mostrarPalabras();
    document.getElementById('inputPalabra').focus(); // Poner el foco en el inputPalabra
}

function borrarElemento() {
    if (!filaSeleccionada) {
        console.error("No se ha seleccionado ninguna fila para borrar.");
        return;
    }

    var index = filaSeleccionada.rowIndex - 1; // Restar 1 para compensar el encabezado de la tabla
    palabras.splice(index, 1); // Eliminar la palabra del array

    mostrarPalabras();
    document.getElementById('inputPalabra').focus(); // Poner el foco en el inputPalabra
}

// Función para seleccionar una fila al hacer clic
function seleccionarFila(fila) {
    if (filaSeleccionada) {
        filaSeleccionada.classList.remove('table-active'); // Remover la clase de selección de la fila anterior
    }
    filaSeleccionada = fila;
    filaSeleccionada.classList.add('table-active'); // Agregar la clase de selección a la fila actual

    var palabra = fila.cells[0].textContent;
    var descripcion = fila.cells[1].textContent;

    document.getElementById("inputPalabra").value = palabra;
    document.getElementById("inputDescripcion").value = descripcion;
}

// Función para grabar un documento nuevo 
function grabarCategoria() {
    console.log("pulsado");
    const link = document.createElement("a");
    const content = palabras.map(function (palabra) {
        return palabra.palabra + ', ' + palabra.descripcion; // Concatenar la palabra y la descripción
    }).join('\n');
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = document.getElementById("nombreFichero").value;
    link.click();
    URL.revokeObjectURL(link.href);
}

function ordenarPalabras() {
    palabras.sort(function (a, b) {
        return a.palabra.localeCompare(b.palabra); // Ordenar alfabéticamente por palabra
    });
}

function reiniciar() {
    // Recargar la página para reiniciar todo
    location.reload();
}

function comoEsta() {
    alert("Copyright 2024 MIT Licensed \n\n" + "Por la presente se concede permiso, libre de cargos, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados(el 'Software'), a utilizar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y / o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones: \n\n" +

        "EL SOFTWARE SE PROPORCIONA 'COMO ESTÁ', SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR E INCUMPLIMIENTO.EN NINGÚN CASO LOS AUTORES O PROPIETARIOS DE LOS DERECHOS DE AUTOR SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, DERIVADAS DE, FUERA DE O EN CONEXIÓN CON EL SOFTWARE O SU USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.")
}