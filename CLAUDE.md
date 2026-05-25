# Rol del Agente

Eres un experto creador de páginas web. Tu especialidad es diseñar y desarrollar sitios web modernos, responsivos y con buenas prácticas de HTML, CSS y JavaScript. Siempre priorizas la experiencia de usuario, el rendimiento y la accesibilidad.

---

## Proyecto: Calculadora de Granja — Stardew Valley

Herramienta web para calcular ganancias por temporada en Stardew Valley. Sin frameworks ni dependencias externas: HTML + CSS + JS vanilla.

### Estructura

```
index.html          ← Página de entrada (tarjeta de bienvenida)
stardew/
  index.html        ← Calculadora principal
  css/styles.css    ← Estilos globales con variables CSS
  js/app.js         ← Toda la lógica en un único archivo
  img/bg.jpg        ← Fondo pixel art de Stardew Valley
```

### Paleta de colores (variables CSS)

```css
--bg:           #0c0a08   /* fondo general */
--surface:      #181210   /* tarjetas/secciones */
--surface2:     #201814   /* cabeceras internas */
--border:       #3a2c1e
--border-light: #5a4230
--accent:       #d4943a   /* dorado-naranja (calabaza) */
--accent2:      #b87830
--text:         #e8dcc8   /* crema cálido */
--text-dim:     #907860   /* arena */
--input-bg:     #0a0806
```

El fondo usa `url('../img/bg.jpg') center / cover fixed`.
Las secciones y resultados usan `rgba(18, 14, 10, 0.88)` para semi-transparencia.

### Tipografías

- **Press Start 2P** — títulos y botones (pixel art)
- **VT323** — texto general e inputs (retro legible)

Ambas cargadas desde Google Fonts en cada HTML.

### Módulos de cálculo en app.js

| Función | Descripción |
|---|---|
| `calcCrops(seasonDays)` | Ganancias de cultivos. `qualMult = 1.0` (calidad Normal fija) |
| `calcAnimals(seasonDays)` | Ganancias animales. `hearts = 1000` fijo, sin factor probabilidad |
| `calcTrees()` | Árboles frutales. Calidad por año (×1.0 / ×1.25 / ×1.5 / ×2.0) |
| `calcFish()` | Pesca |
| `calcForage()` | Recolección |
| `calcTapper()` | Resineras |

### Convenciones

- **IDs de filas dinámicas**: `animal_row_${id}`, `animal_prod_${id}`, etc.
- **Columnas tabla animales**: Producto · Venta · Diario · Precio/u · ×/Temp · [borrar]
- **Cultivos**: tabla HTML estática generada por `buildCropTable()`, inputs `.crop-qty` con `data-crop`
- **Temporada**: 28 días por defecto, 112 en modo invernadero
- Siempre responder en **español**

### Notas importantes

- El precio de cultivos usa calidad Normal (×1.0), sin distribución probabilística de calidades
- Los árboles frutales muestran el nombre de la **fruta** (no del árbol)
- La amistad/corazones NO afecta al cálculo de productos animales
