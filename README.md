FIFA X Academy - Panel de Rendimiento y Administración

Proyecto integrador desarrollado para la gestión avanzada, filtrado, análisis predictivo y edición en lote de jugadores de la academia FIFA X.

---

## Decisiones Técnicas y Arquitectura

Para cumplir con los requisitos obligatorios y los puntos extra de rendimiento, se optó por la siguiente infraestructura tecnológica:

### Frontend: Angular (v17+) + Chart.js
* **Componentes Standalone:** Se utilizó la arquitectura moderna de Angular sin módulos para agilizar la carga y mantener el código limpio.
* **Control de SSR (Server-Side Rendering):** Dado que las nuevas versiones de Angular renderizan componentes en el servidor por defecto, se implementaron validaciones estructurales (`typeof window !== 'undefined'`) para el uso seguro de variables globales como `localStorage`, previniendo errores de compilación en Node.js al validar la sesión.
* **Formularios Reactivos (`ReactiveFormsModule`):** Se implementó para el sistema de filtros, permitiendo búsquedas predictivas en tiempo real mediante suscripciones al evento `valueChanges`.
* **Visualización Dinámica (Chart.js):** Se integró la librería mediante importaciones dinámicas (`import('chart.js/auto')`) para optimizar el bundle. Se renderizan dos gráficos clave por jugador:
  1. *Radar Chart:* Para la comparativa visual de atributos actuales (Requerimiento Base).
  2. *Line Chart:* Para trazar la línea de tiempo histórica del jugador (Punto Extra).

### Backend: NestJS + LangChain IA
* **Seguridad (Guards):** Los endpoints de consulta, creación e importación están protegidos del lado del servidor para bloquear peticiones no autenticadas según lo solicitado.
* **Integración con Inteligencia Artificial (Punto Extra):** Se diseñó el flujo del endpoint de análisis narrativo acoplado a **LangChain**, enviando el set de datos históricos (2015-2023) a un modelo LLM para devolver una evaluación técnica automatizada en un párrafo resumen.

---

## Decisiones Funcionales

1. **Flujo de Autenticación Unificado:** Para proteger los datos, la interfaz utiliza bloques condicionales `@if (isLoggedIn)`. Si el usuario no está autenticado, el sistema solo expone el prompt de Login (`admin` / `1234`), persistiendo la sesión de manera segura.
2. **Paginación del Lado del Cliente (Performance):** Se procesa un listado completo filtrado en memoria y se segmenta dinámicamente mediante un *Getter* matemático (`pagedPlayers`), garantizando transiciones instantáneas de página de 5 en 5 registros.
3. **Manejo de Datos en Lote (CSV):**
   * *Exportación (Requerimiento Base):* Generación de blobs nativos con codificación UTF-8 BOM (`\ufeff`) para asegurar la compatibilidad de caracteres especiales (acentos/eñes) en Microsoft Excel al descargar el listado filtrado.
   * *Importación masiva (Punto Extra):* Mecanismo de carga mediante `FormData` directo al endpoint de procesamiento masivo del backend para subir nuevos archivos CSV.

---

## Cómo Ejecutar el Proyecto

### Requisitos previos
* Node.js (v18 o superior)
* Angular CLI instalado de forma global (`npm install -g @angular/cli`)

### Instalación y despliegue
1. Clonar o descargar este repositorio.
2. Entrar a la carpeta deseada (`frontend` o `backend`).
3. Instalar dependencias: `npm install`
4. Para el frontend, iniciar con: `ng serve` (abrir en `http://localhost:4200`).

* **Credenciales de acceso de prueba:** Usuario: `admin` | Contraseña: `1234`
