🛒 AssureShop – Backend
Backend del sistema de comercio electrónico AssureShop, desarrollado con Node.js, Express y PostgreSQL. Este servicio gestiona productos, categorías y operaciones CRUD, incluyendo eliminaciones suaves (soft delete) y completas (hard delete), utilizando Prisma como ORM.

📦 Tecnologías
Node.js + Express

PostgreSQL + Prisma ORM

TypeScript

Jest para pruebas

Postman para pruebas de API

⚙️ Instalación
Clonar el repositorio:

bash
Copiar código
git clone https://github.com/tu_usuario/assureshop.git
cd assureshop/backend
Instalar dependencias:

bash
Copiar código
npm install
Configurar la base de datos:

Copiar y ejecutar el script SQL:

bash
Copiar código
cp ecommerce_schema.sql /tmp/
sudo -u postgres psql -f /tmp/ecommerce_schema.sql
rm /tmp/ecommerce_schema.sql
O crear manualmente la base de datos ecommerce y aplicar el esquema.

Inicializar Prisma:

bash
Copiar código
npx prisma init
npx prisma generate
Compilar y ejecutar el servidor:

bash
Copiar código
npm run build
npm run dev
🧪 Pruebas
Ejecutar las pruebas unitarias con:

bash
Copiar código
npm test
📬 Prueba rápida con Postman
Agregar una categoría:

Ejecutar en PostgreSQL:

sql
Copiar código
INSERT INTO categories (name, description) VALUES ('Periféricos', 'Accesorios para computadoras');
Agregar un producto:

Método: POST

URL: http://localhost:3000/api/products

Body (JSON):

json
Copiar código
{
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
🧰 Scripts útiles
Comando	Descripción
npm run dev	Inicia el servidor en modo desarrollo
npm run build	Compila el proyecto TypeScript
npm test	Ejecuta las pruebas unitarias
npx prisma studio	Abre el panel visual de Prisma
🛡️ Seguridad
Validación de datos con DTOs

Manejo de errores con logs (logger)

Eliminación suave (isActive: false) y completa (DELETE)

📁 Estructura del proyecto
pgsql
Copiar código
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── __tests__/
├── prisma/
│   └── schema.prisma
├── package.json
└── tsconfig.json
📄 Licencia
Este proyecto está bajo la licencia de nosotros mismos.