# Documentación General del Proyecto SAIDEX 4.0

## 1) Resumen
SAIDEX 4.0 es un sitio web estático multi-página orientado a domótica y automatización, con experiencia visual premium (animaciones, efectos neon, carrusel, partículas, reveal on scroll) y una tienda con flujo de carrito + envío de pedido por WhatsApp.

## 2) Estructura del proyecto
- `index.html`: landing principal (hero, soluciones, proyectos, estadísticas, CTA, footer).
- `sistemas.html`: detalle de sistemas inteligentes.
- `integraciones.html`: detalle de integraciones y protocolos.
- `servicios.html`: detalle de servicios.
- `proyectos.html`: galería/proyectos destacados.
- `tienda.html`: catálogo, filtros, carrito lateral y checkout a WhatsApp.
- `css/style.css`: estilos globales y animaciones.
- `js/script.js`: lógica global de navegación, animaciones, tienda, modales y WhatsApp.
- `assets/`: imágenes, logo y recursos visuales.

## 3) Tecnologías
- HTML5
- CSS3 (animaciones, layouts responsivos, efectos visuales)
- JavaScript Vanilla (DOM, eventos, IntersectionObserver, canvas)
- Font Awesome (iconos)
- Google Fonts (Inter)

## 4) Funcionalidades principales
- Navbar responsive con menú móvil.
- Hero con carrusel automático (fade/slide visual vía clases CSS).
- Partículas animadas en canvas (landing).
- Reveal on scroll con `IntersectionObserver`.
- Contadores animados en estadísticas.
- Tienda:
  - Filtro por categorías.
  - Carrito en memoria (array en frontend).
  - Cálculo de total y cantidad.
  - Eliminación de ítems.
  - Checkout y redirección a WhatsApp con mensaje preformateado.
- Formulario de visita técnica (cuando existe en la página) con envío a WhatsApp.

## 5) Flujo de JavaScript (`js/script.js`)
- Inicialización al `DOMContentLoaded`.
- Módulos lógicos dentro del mismo archivo:
  - Navbar / menú móvil.
  - Tienda (filtros, carrito, checkout).
  - Carrusel hero.
  - Partículas canvas.
  - Modal de visita técnica.
  - Contadores + reveal.

## 6) Correcciones de bugs aplicadas (sin tocar diseño ni animaciones)
Se corrigieron errores de robustez para evitar que el JS se rompa en páginas donde ciertos elementos no existen:
- Validación de existencia de `header/navbar` antes de aplicar clases en scroll.
- Validación de `navLinks` y `navActions` antes de alternar menú móvil.
- Validación de `navLinks/navActions` al cerrar menú móvil en links.
- Validación de `cartOverlay` dentro de `toggleCart()`.
- Validación de `closeVisitBtn` antes de registrar listener.
- Validaciones en checkout:
  - `checkoutModal` obligatorio antes de abrir.
  - `cartSidebar/cartOverlay` opcionales al cerrar.
  - `closeCheckoutBtn` validado antes de listener.
- Corrección del parseo del contador para asegurar valores numéricos robustos.
- Eliminación de la inicialización duplicada de contadores que impedía la animación progresiva real.

## 7) Estado del login actual
- El botón `Login` existe visualmente en navegación, pero no hay módulo de autenticación implementado todavía.
- Actualmente funciona como placeholder/enlace de UI.

## 8) Recomendaciones de mantenimiento
- Mantener `js/script.js` modularizado por bloques y agregar nuevas validaciones null-safe en futuras secciones.
- Si el proyecto crece, separar lógica por archivos (`navbar.js`, `store.js`, `animations.js`, etc.).
- Centralizar constantes (WhatsApp, textos, endpoints futuros) para facilitar escalado.

## 9) Pruebas manuales sugeridas
- Desktop y móvil:
  - Menú hamburguesa abre/cierra correctamente.
  - Carrusel hero cambia slides cada 5s.
  - Partículas visibles y fluidas en `index.html`.
  - Animaciones de scroll activan una vez al entrar en viewport.
  - Contadores suben progresivamente al hacer scroll.
- Tienda:
  - Filtros muestran/ocultan productos por categoría.
  - Carrito suma cantidades y calcula total.
  - Eliminar ítems actualiza total y contador.
  - Checkout abre modal y genera mensaje WhatsApp.

## 10) Limitaciones actuales
- Carrito no persistente (se pierde al recargar).
- No existe backend ni gestión de usuarios.
- No existe historial de pedidos en base de datos.

## 11) Próximos pasos técnicos recomendados
1. Implementar autenticación real (ver `DOCUMENTACION_LOGIN.md`).
2. Persistir carrito por usuario (localStorage o backend).
3. Agregar panel básico de administración de pedidos.
4. Incorporar validaciones más fuertes de formularios (frontend + backend).
