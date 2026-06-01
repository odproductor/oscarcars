# Prueba Oscar

App para registrar y gestionar autos por usuario. Cada quien se crea su cuenta,
inicia sesión y administra sus propios autos (crear, listar, editar, borrar).

Backend en Spring Boot con JWT, frontend en React y la base en SQL Server.

## Qué necesitas

- Java 17
- Node 20+
- Docker (lo uso para levantar SQL Server sin tener que instalarlo)

## Cómo correrlo

Son tres cosas: base de datos, backend y frontend.

### Base de datos

Desde la raíz:

```bash
docker compose up -d
```

Eso arranca SQL Server y de paso corre los scripts de `database/`, que crean la
base `oscarcars`, las tablas y dejan un usuario de prueba con algunos autos.

Si ya tienes tu propio SQL Server y no quieres usar Docker, corre a mano
`database/01-schema.sql` y luego `database/02-seed.sql`, y apunta el backend a tu
instancia con las variables de entorno de más abajo.

Datos de conexión por defecto:

- Host: `localhost:1433`
- Usuario: `sa`
- Password: `Oscarcars!2024`
- Base: `oscarcars`

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Arranca en `http://localhost:8080`. La config por defecto ya apunta a la base de
Docker, así que normalmente no tienes que tocar nada. Si lo necesitas, puedes
sobreescribir con variables de entorno: `DB_URL`, `DB_USER`, `DB_PASSWORD`,
`JWT_SECRET`, `JWT_EXPIRATION` (en ms, por defecto 24h) y `CORS_ORIGINS`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Queda en `http://localhost:5173`. Si moviste el backend de puerto, cambia
`VITE_API_URL` en `frontend/.env`.

## Para probar rápido

Si levantaste la base con Docker ya hay un usuario listo:

- **oscardiaz@oscarcars.com** / **123456**

Trae 4 autos cargados. También puedes registrar una cuenta nueva desde la pantalla
de registro.

## Endpoints

La base de la API es `http://localhost:8080/api`.

Autenticación (no requieren token):

- `POST /auth/register` — crea la cuenta y te devuelve el token
- `POST /auth/login` — devuelve el token

```json
// register
{ "name": "Juan Perez", "email": "juan@email.com", "password": "secreto123" }

// respuesta
{ "token": "eyJhbGci...", "type": "Bearer", "user": { "id": 1, "name": "Juan Perez", "email": "juan@email.com" } }
```

Autos (mandar el header `Authorization: Bearer <token>`):

- `GET /cars` — los autos del usuario logueado
- `POST /cars` — crea uno
- `PUT /cars/{id}` — edita
- `DELETE /cars/{id}` — borra

```json
// crear/editar auto
{ "brand": "Toyota", "model": "Corolla", "year": 2020, "plate": "ABC-123", "color": "Rojo", "photoUrl": null }
```

Y `GET /users/me` devuelve los datos del usuario actual (lo usa la pantalla de perfil).

Un usuario solo ve y toca sus propios autos; si pides un id que no es tuyo, responde 404.

## Validaciones

Tanto el front como el back validan lo mismo, para no depender solo del cliente:

- El año no puede ser futuro ni anterior a 1900.
- La placa tiene que cumplir `^[A-Za-z]{3}-?[0-9]{3,4}$` (tipo `ABC-123`).
- Marca, modelo y color son obligatorios; el correo único y con formato válido.

Cuando algo falla, la API responde con un JSON con el mensaje y, en el caso de
validaciones, el detalle por campo:

```json
{
  "status": 400,
  "error": "Datos invalidos",
  "message": "Revisa los campos enviados",
  "fields": { "plate": "La placa debe tener un formato valido (ej: ABC-123)" }
}
```

## Sobre el frontend

La parte de React tiene login/registro, el dashboard con un resumen, y la tabla de
autos con sus modales para agregar, editar y confirmar borrado. Además quedó con
búsqueda (por placa, modelo o marca), filtros por marca y año, un campo de foto por
URL (simulado, como pedía la prueba) y es responsive.

El token se guarda en localStorage y las rutas privadas están protegidas: si no hay
sesión te manda al login, y si el token expira (401) cierra sesión solo.

## Estructura

```
backend/     API en Spring Boot
frontend/    app de React (Vite)
database/    scripts de creación y datos de ejemplo
postman/     colección para probar la API
docker-compose.yml
```

## Postman

En `postman/` está la colección. Empieza por el request de login (o registro):
guarda el token solo y los demás requests ya lo reutilizan, así no tienes que
copiarlo a mano.
