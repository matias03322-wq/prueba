# Documentación de Integración de Login (Implementación Gradual)

## 1) Objetivo
Integrar login real en SAIDEX 4.0 de forma progresiva, segura y sin romper la experiencia visual actual (animaciones, estilos, navegación).

## 2) Estado actual
- Existe botón `Login` en la interfaz.
- No existe autenticación real, backend de usuarios ni sesiones.
- No hay páginas privadas ni control de acceso.

## 3) Estrategia recomendada (por fases)

## Fase 0: Preparación UI (sin backend)
Objetivo: preparar la interfaz sin afectar la web actual.
- Crear modal o página dedicada `login.html` (manteniendo diseño SAIDEX).
- Crear formulario base:
  - Email
  - Password
  - Botón ingresar
  - Link “Crear cuenta” y “Olvidé contraseña”
- Reemplazar enlace placeholder `#login` por ruta real de login.

Resultado: login visual funcional, sin validación real todavía.

## Fase 1: Backend mínimo de autenticación
Objetivo: habilitar login real con seguridad básica.
- Stack sugerido backend:
  - Node.js + Express
  - Base de datos: PostgreSQL o MySQL
  - Hash de contraseñas: bcrypt
  - Sesión: JWT (httpOnly cookie) o sesión server-side
- Endpoints mínimos:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`

Resultado: usuarios pueden registrarse, iniciar sesión y cerrar sesión.

## Fase 2: Integración frontend + sesión
Objetivo: conectar el frontend actual con el backend.
- En login submit:
  - Enviar credenciales con `fetch`.
  - Mostrar estados de carga/error/success.
- Tras login exitoso:
  - Cambiar botón “Login” por “Mi cuenta / Cerrar sesión”.
  - Guardar sesión con cookie segura (recomendado) o token.
- En carga de página:
  - Consumir `/auth/me` para saber si el usuario está autenticado.

Resultado: sesión persistente entre páginas.

## Fase 3: Funciones ligadas al usuario
Objetivo: dar valor al login.
- Asociar carrito al usuario autenticado.
- Guardar historial de pedidos.
- Mostrar datos del usuario en checkout (nombre/dirección prellenados).

Resultado: experiencia personalizada y escalable.

## Fase 4: Seguridad y endurecimiento
Objetivo: pasar de funcional a producción.
- Validación de input en frontend y backend.
- Rate limit en `/auth/login`.
- Bloqueo temporal tras intentos fallidos.
- Protección CSRF (si se usan cookies de sesión).
- Política de contraseñas seguras.
- Logs de auditoría de acceso.

Resultado: autenticación más robusta y segura.

## 4) Flujo de login propuesto
1. Usuario abre login desde navbar.
2. Ingresa email/password.
3. Frontend envía `POST /auth/login`.
4. Backend valida credenciales y emite sesión.
5. Frontend actualiza UI (usuario autenticado).
6. Usuario navega, compra y su información queda asociada a su cuenta.

## 5) Flujo de registro propuesto
1. Usuario abre “Crear cuenta”.
2. Frontend envía `POST /auth/register`.
3. Backend valida, hashea password, crea usuario.
4. Opcional: inicio de sesión automático.

## 6) Estructura de datos mínima (tabla `users`)
Campos recomendados:
- `id` (UUID)
- `name`
- `email` (único)
- `password_hash`
- `phone` (opcional)
- `address` (opcional)
- `created_at`
- `updated_at`

## 7) Integración con la tienda actual
- Si usuario no autenticado:
  - Permitir compra como invitado (opcional), pero sugerir login.
- Si usuario autenticado:
  - Autocompletar checkout.
  - Guardar pedido en backend antes de enviar a WhatsApp.
  - Mantener lógica visual y de animación actual sin cambios.

## 8) Riesgos y cómo mitigarlos
- Riesgo: romper navegación actual.
  - Mitigación: introducir login como módulo aislado por fases.
- Riesgo: fallos en sesión entre páginas.
  - Mitigación: endpoint `/auth/me` en carga inicial de cada página.
- Riesgo: seguridad insuficiente.
  - Mitigación: hash bcrypt, rate limit, cookies seguras, validación estricta.

## 9) Checklist técnico de implementación
1. Crear `login.html` o modal login.
2. Crear backend auth (`register/login/logout/me`).
3. Conectar frontend con `fetch`.
4. Actualizar navbar según estado de sesión.
5. Guardar pedidos por usuario.
6. Probar flujos completos:
   - Registro
   - Login correcto
   - Login incorrecto
   - Logout
   - Compra autenticada

## 10) Criterios de éxito
- Login funciona en desktop/móvil.
- No se pierden animaciones ni identidad visual.
- Usuario autenticado mantiene sesión.
- Pedidos pueden asociarse a usuario.
- Seguridad mínima de producción cubierta.
