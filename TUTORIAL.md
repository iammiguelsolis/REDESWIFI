# 📡 Simulador de Resiliencia de Red — Tutorial Completo

> **Autor:** Tutorial generado para el proyecto educativo de Redes de Computadoras.
> **Stack Tecnológico:** React 19 + Vite 8 + Tailwind CSS 4 + Framer Motion + Lucide React

---

## Tabla de Contenidos

1. [Contexto Teórico: ¿Qué es y por qué existe?](#1-contexto-teórico-qué-es-y-por-qué-existe)
2. [Manual de Usuario: ¿Cómo usar el simulador?](#2-manual-de-usuario-cómo-usar-el-simulador)
3. [Guía de Ejecución Local (Vite + React)](#3-guía-de-ejecución-local-vite--react)

---

## 1. Contexto Teórico: ¿Qué es y por qué existe?

### 1.1 El Problema Original: ¿Cómo comunicar computadoras de manera confiable?

A mediados del siglo XX, las telecomunicaciones dependían completamente de la **conmutación de circuitos**, un modelo heredado de las redes telefónicas. En este modelo, cuando dos personas querían comunicarse, se establecía un **canal físico dedicado** entre ambos extremos. Ese canal permanecía reservado durante toda la conversación, sin importar si alguien hablaba o estaba en silencio.

Este enfoque tiene un problema fundamental: **un solo punto de fallo destruye toda la comunicación.** Si un nodo intermedio (una central telefónica, un cable) se daña, la línea se corta inmediatamente y no hay forma de recuperar la conexión hasta que se repare.

### 1.2 Conmutación de Circuitos vs. Conmutación de Paquetes

| Característica | Conmutación de Circuitos | Conmutación de Paquetes |
|---|---|---|
| **Reserva de recursos** | Canal dedicado durante toda la transmisión | Sin reserva; los recursos se comparten |
| **Ruta** | Fija, se establece antes de transmitir | Dinámica, cada paquete puede tomar una ruta distinta |
| **Tolerancia a fallos** | ❌ Si un nodo cae, la comunicación se pierde | ✅ Los paquetes se reencaminan automáticamente |
| **Eficiencia** | Baja (el canal está ocupado aunque no se transmita) | Alta (los recursos solo se usan cuando hay datos) |
| **Ejemplo real** | Red telefónica tradicional (PSTN) | Internet (TCP/IP) |

### 1.3 ¿Por qué se inventó la Conmutación de Paquetes?

La respuesta está en el contexto de la **Guerra Fría (años 1960)**. El Departamento de Defensa de los Estados Unidos necesitaba una red de comunicaciones que pudiera sobrevivir a un ataque nuclear. La premisa era simple pero revolucionaria:

> *"Si un enemigo destruye un nodo de la red, los mensajes deben encontrar automáticamente otro camino para llegar a su destino."*

El investigador **Paul Baran** de la RAND Corporation propuso en 1964 la idea de una **red distribuida** donde los mensajes se dividirían en pequeños bloques independientes — **paquetes** — que viajarían cada uno por su propia ruta. Si una parte de la red era destruida, los paquetes simplemente tomarían otro camino.

Esta idea fue la base de **ARPANET** (1969), la red precursora de Internet. El protocolo **TCP/IP**, diseñado por **Vint Cerf** y **Bob Kahn** en los años 70, formalizó y perfeccionó este modelo.

### 1.4 ¿Cómo es esto la base de Internet hoy?

Cada vez que envías un mensaje en WhatsApp, cargas una página web o haces una videollamada, tu información se divide en paquetes que viajan independientemente por la red global. Si un servidor en Europa se cae, tus paquetes se reencaminan por Asia o por otro nodo disponible. **Tú nunca lo notas**, pero la red está constantemente tomando decisiones de enrutamiento para garantizar que tus datos lleguen.

Este es el principio de **resiliencia** que este simulador te permite experimentar de primera mano.

---

## 2. Manual de Usuario: ¿Cómo usar el simulador?

### 2.1 Descripción General de la Interfaz

El simulador presenta una interfaz a pantalla completa dividida en tres zonas:

```
┌─────────────────────────────────────────────────────────┐
│  BARRA SUPERIOR (Header)                                │
│  Título · Estado · Contadores (Modo/Nodos/En Destino)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              LIENZO DE RED (Canvas)                     │
│                                                         │
│    [ORIGEN] ──── [B] ──── [E] ──── [DESTINO]           │
│        │  ╲      │╲      │╱       ╱  │                  │
│        │   ╲     │ ╲     │╱     ╱    │                  │
│        │    ╲    [D]    ╱      │                         │
│        │     ╲   │╱  ╱        │                          │
│    [ORIGEN] ──── [C] ──── [F] ──── [DESTINO]            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  BARRA INFERIOR (Footer)                                │
│  [Circuitos | Paquetes]     [Enviar Mensaje] [Reiniciar]│
└─────────────────────────────────────────────────────────┘
```

### 2.2 Elementos de la Red

La topología consta de **7 nodos** y **10 conexiones**:

| Nodo | Icono | Rol | ¿Se puede desactivar? |
|------|-------|-----|----------------------|
| **ORIGEN** | 💻 Laptop | Emisor del mensaje | No |
| **B** | 📡 Router | Enrutador superior-izquierdo | ✅ Sí |
| **C** | 📡 Router | Enrutador inferior-izquierdo | ✅ Sí |
| **D** | 📡 Router | Enrutador central | ✅ Sí |
| **E** | 📡 Router | Enrutador superior-derecho | ✅ Sí |
| **F** | 📡 Router | Enrutador inferior-derecho | ✅ Sí |
| **DESTINO** | 🖥️ Servidor | Receptor del mensaje | No |

### 2.3 Paso a Paso: Simulación Básica

#### Paso 1: Seleccionar el Modo

En la barra inferior, elige entre:

- **⚡ Circuitos:** Simula la conmutación de circuitos. Se establece una única ruta fija.
- **📦 Paquetes:** Simula la conmutación de paquetes. Se envían 4 paquetes independientes.

#### Paso 2: (Opcional) Desactivar Nodos

Haz **clic** en cualquier router (B, C, D, E o F) para **desactivarlo**. Esto simula una falla física en ese punto de la red. Observarás que:

- El nodo se atenúa y su borde cambia a **rojo**.
- Las líneas de conexión que pasan por ese nodo se oscurecen a rojo tenue.
- El contador "NODOS ACTIVOS" se actualiza automáticamente.

> 💡 **Tip:** Puedes hacer clic de nuevo para reactivar el nodo.

#### Paso 3: Enviar el Mensaje

Presiona el botón **"Enviar Mensaje"**. Observa qué sucede según el modo seleccionado.

#### Paso 4: Observar los Resultados

Lee el mensaje de estado en la barra superior para ver el resultado de la simulación.

#### Paso 5: Reiniciar

Presiona **"Reiniciar Red"** para devolver todos los nodos a su estado activo y limpiar la simulación.

### 2.4 Comportamiento por Modo

#### Modo Circuitos (⚡)

1. Al presionar "Enviar Mensaje", el sistema calcula **una única ruta** desde ORIGEN hasta DESTINO usando el algoritmo BFS (Búsqueda en Anchura).
2. Un solo punto luminoso azul viaja a lo largo de esa ruta.
3. **Si desactivas un nodo que está en la ruta activa mientras el dato viaja:**
   - La animación se **detiene en seco**.
   - El estado muestra: *"⚠ Error: Falla de conexión en circuito"*.
   - El dato se pierde. No hay recuperación.
4. **Si la ruta está libre:** El dato llega al destino y el estado muestra: *"✓ Mensaje transmitido exitosamente por el circuito"*.

> Esta es la debilidad fundamental del modelo de circuitos: **cero tolerancia a fallos**.

#### Modo Paquetes (📦)

1. Al presionar "Enviar Mensaje", se generan **4 paquetes** (puntos luminosos de colores: azul, verde, amarillo y rojo).
2. Cada paquete sale del ORIGEN con un ligero retardo escalonado.
3. Cada uno toma una **ruta distinta** (unos por arriba vía B/E, otros por abajo vía C/F, otros por el centro vía D).
4. **Si desactivas un nodo mientras los paquetes viajan:**
   - Los paquetes que iban hacia ese nodo **recalculan su ruta dinámicamente** (BFS en tiempo real).
   - Buscan una alternativa y continúan hacia el destino.
5. **Cuando todos los paquetes llegan:** el estado muestra: *"✓ ¡Todos los paquetes llegaron y se reensamblaron!"*.

> Este es el poder de la conmutación de paquetes: **resiliencia automática frente a fallos**.

### 2.5 Experimentos Sugeridos

| # | Experimento | Qué observar |
|---|------------|--------------|
| 1 | Envía un mensaje en modo Circuitos con todos los nodos activos | El dato viaja por una ruta directa sin problemas |
| 2 | Desactiva el nodo **D** y envía en modo Circuitos | Si la ruta pasaba por D, la transmisión falla |
| 3 | Envía en modo Paquetes con todos los nodos activos | Los 4 paquetes toman rutas distintas y todos llegan |
| 4 | Desactiva **B** y **E** (toda la ruta superior) en modo Paquetes | Los paquetes se reencaminan por C, D y F |
| 5 | Desactiva **B**, **C** y **D** en modo Paquetes | Los paquetes no tienen ruta viable (experimento de fallo total) |
| 6 | En modo Circuitos, envía y **desactiva un nodo durante el viaje** | Observa cómo el circuito se rompe en tiempo real |
| 7 | En modo Paquetes, envía y **desactiva un nodo durante el viaje** | Observa el reencaminamiento dinámico en acción |

---

## 3. Guía de Ejecución Local (Vite + React)

### 3.1 Requisitos Previos

- **Node.js** versión 18 o superior (verifica con `node -v`).
- **npm** versión 9 o superior (viene incluido con Node.js).
- Un navegador web moderno (Chrome, Firefox, Edge).

### 3.2 Instalación Paso a Paso

#### 1. Abrir una terminal

En Windows: `PowerShell` o `Símbolo del sistema`.
En macOS/Linux: `Terminal`.

#### 2. Navegar al directorio del proyecto

```bash
cd ruta/al/proyecto/nombre-de-tu-proyecto
```

#### 3. Instalar las dependencias

```bash
npm install
```

Este comando lee el archivo `package.json` e instala las siguientes dependencias principales:

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^19.x | Librería de UI |
| `react-dom` | ^19.x | Renderizado en el DOM |
| `framer-motion` | ^12.x | Animaciones de los paquetes de datos |
| `lucide-react` | ^1.x | Íconos SVG (Laptop, Router, Server, etc.) |
| `tailwindcss` | ^4.x | Framework de utilidades CSS |
| `@tailwindcss/vite` | latest | Plugin de integración Tailwind + Vite |
| `vite` | ^8.x | Bundler y servidor de desarrollo |
| `@vitejs/plugin-react` | ^6.x | Soporte de React para Vite |

#### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Deberías ver una salida similar a:

```
VITE v8.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 5. Abrir el simulador

Abre tu navegador y ve a:

```
http://localhost:5173/
```

El simulador se cargará a pantalla completa, listo para usar.

### 3.3 Estructura del Proyecto

```
nombre-de-tu-proyecto/
├── index.html                    ← Punto de entrada HTML
├── package.json                  ← Dependencias y scripts
├── vite.config.js                ← Configuración de Vite + Tailwind
└── src/
    ├── main.jsx                  ← Punto de entrada React
    ├── index.css                 ← Estilos globales + Tailwind v4
    ├── App.jsx                   ← Componente raíz (wrapper)
    ├── utils/
    │   └── graph.js              ← Topología de red, BFS, pathfinding
    ├── hooks/
    │   └── useSimulation.js      ← Hook con toda la lógica de simulación
    └── components/
        └── NetworkSimulator.jsx  ← Componente principal de la UI
```

### 3.4 Descripción de Archivos Clave

- **`graph.js`**: Define los 7 nodos, las 10 aristas, la lista de adyacencia, y los algoritmos BFS para encontrar rutas. Exporta una función `findPath()` para ruta única y `findDiversePaths()` para múltiples rutas.

- **`useSimulation.js`**: Hook personalizado que gestiona todo el estado reactivo (nodos activos, modo, paquetes en tránsito) y el **bucle de animación** con `requestAnimationFrame`. Controla la lógica de reencaminamiento dinámico.

- **`NetworkSimulator.jsx`**: Renderiza la interfaz completa: header con estadísticas, canvas SVG con nodos/aristas, paquetes animados con Framer Motion, y footer con controles.

### 3.5 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:5173` |
| `npm run build` | Genera una build de producción en la carpeta `dist/` |
| `npm run preview` | Sirve la build de producción localmente para verificación |
| `npm run lint` | Ejecuta ESLint para verificar calidad del código |

---

## Créditos y Referencias

- **Paul Baran** (1964) — *"On Distributed Communications"*, RAND Corporation.
- **Vint Cerf & Bob Kahn** (1974) — Diseño del protocolo TCP/IP.
- **ARPANET** (1969) — Primera red basada en conmutación de paquetes.
- **RFC 791** — Especificación del Protocolo de Internet (IP).

---

> *"La fortaleza de la red no está en la resistencia de sus nodos, sino en su capacidad de encontrar caminos alternativos cuando un nodo falla."*
> — Principio fundamental del diseño de Internet.
