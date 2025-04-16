# AssureShop
# AssureShop

cp ecommerce_schema.sql /tmp/

sudo -u postgres psql -f /tmp/ecommerce_schema.sql

rm /tmp/ecommerce_schema.sql

# DBeaver:

En la pantalla de Nueva Conexión, los campos deberían verse así:
Host: localhost
Puerto: 5432
Base de datos: ecommerce
Usuario: [tu_usuario]
Contraseña: [tu_contraseña]


# Backend
cd backend
# No necesitas ejecutar npm init porque ya creamos el package.json completo
# Instalar las dependencias
npm install
# Inicializar Prisma con la base de datos existente
npx prisma init
# Generar los tipos de Prisma Client
npx prisma generate
# Correr el server
npm run build
npm run dev

Pruebas más avanzadas
Puedes intentar agregar un producto usando una solicitud POST:
En Postman:

Cambia el método a POST
Mantén la URL: http://localhost:3000/api/products
Ve a la pestaña "Body", selecciona "raw" y "JSON"
Ingresa los datos de un producto de prueba:

json{
  "name": "Teclado Mecánico Gamer",
  "description": "Teclado mecánico RGB con switches Cherry MX Blue",
  "price": 89.99,
  "categoryId": 1,
  "imageUrl": "https://example.com/teclado.jpg",
  "sku": "TEC-MEC-001",
  "weight": 0.95,
  "dimensions": "45x15x4 cm",
  "isActive": true
}
Nota importante: Para que esta prueba funcione, debes tener al menos una categoría en la tabla categories con id=1. Si tu base de datos está vacía, primero deberías insertar una categoría:
sqlINSERT INTO categories (name, description) VALUES ('Periféricos', 'Accesorios para computadoras');
Después de ejecutar esta consulta SQL en tu base de datos, intenta nuevamente la solicitud POST.