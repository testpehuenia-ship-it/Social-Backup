# Social Backup by ADNQN

> **«Tus redes pueden desaparecer. Tu comunidad debe permanecer».**  
> *Social Backup*: «Tu comunidad. Tus contactos. Tu futuro» · *Powered by ADNQN*: «Tecnología que impulsa negocios».

Plataforma SaaS multicliente comercializable diseñada para construir, administrar, proteger y recuperar la comunicación directa con comunidades de clientes y seguidores.

---

## 🎯 Pilares del Producto

1. **Social Capture (Captación Voluntaria):**
   - Página de registro alojada y personalizable por negocio (`/c/[slug]`).
   - Consentimiento granular explícito sin casillas premarcadas (cumplimiento Ley 25.326 y estándares internacionales).
   - Verificación de correo electrónico mediante enlaces criptográficos de un solo uso.
   - Generación de enlaces con parámetros UTM y códigos QR descargables en alta resolución.
   - Widget embebible en Vanilla JS (`public/widget.js`) con permisos mínimos (solo inserción, cero exposición de secretos ni listado de contactos).

2. **Social Manager (Panel de Control Soberano):**
   - Métricas transparentes en tiempo real: Contactos propios vs. Canales verificados vs. Contactos habilitados para rescate.
   - **Índice de Independencia Digital (IID):** indicador metodológico transparente que compara contactos verificados con la suma bruta de seguidores declarados.
   - Búsqueda, filtros por estado (Todos, Verificados, Pendientes, Bajas).
   - Historial y evidencia probatoria de consentimientos (IP hash, fecha, origen, finalidad).
   - Exportación segura a CSV con saneamiento estricto contra inyección de fórmulas (CWE-1236).
   - Gestión de límites del Plan Free (hasta 100 contactos sin pérdida destructiva de datos).

3. **Social Rescue (Modo Rescate ante Incidentes):**
   - Asistente guiado paso a paso para declarar incidentes de redes sociales (bloqueo, hackeo, pérdida de cuenta).
   - Validación estricta de formato y dominio de la nueva presencia oficial.
   - Filtro de destinatarios elegibles con exclusión automática de bajas voluntarias y contactos no verificados.
   - Vista previa en tiempo real y envío de correo de prueba al administrador del negocio.
   - Despacho en cola con claves de **idempotencia** para evitar envíos duplicados.
   - Publicación automática de la **Página Oficial de Continuidad** (`/c/[slug]/continuity`).

4. **Soberanía & Respaldo de Datos:**
   - Aislamiento lógico estricto por `tenant_id` en todas las consultas y entidades.
   - Generación de respaldos completos (snapshots) en formato estándar JSON con cálculo de integridad SHA-256.
   - Protocolo de restauración segura (*Safe Restore*) que previene sobreescrituras cruzadas y respeta bajas posteriores.

---

## 🚀 Inicio Rápido en Desarrollo Local

### Requisitos
- Node.js v18+ (recomendado v20+)
- npm v9+

### Instalación y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos (SQLite local cero fricción):**
   ```bash
   npx prisma db push
   ```

3. **Cargar datos iniciales y cuentas de demostración:**
   ```bash
   npm run seed
   ```

4. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Pruebas Automatizadas de Aceptación

El proyecto incluye una suite completa que valida los criterios críticos de la especificación:
```bash
npx tsx --test tests/acceptance.test.js
```

### Criterios Verificados:
- [x] **Aislamiento Multitenant:** Un negocio no puede leer ni modificar contactos de otro negocio.
- [x] **Captura y Consentimientos:** Registro inmutable de finalidades y estado no verificado por defecto.
- [x] **Tokens de Un Solo Uso:** Rechazo de reutilización de tokens consumidos.
- [x] **Expiración de Enlaces:** Rechazo automático de tokens caducados.
- [x] **Exclusión Estricta de Bajas:** Los contactos dados de baja quedan permanentemente bloqueados de cualquier campaña de rescate.
- [x] **Idempotencia:** Prevención de duplicación de campañas con la misma clave.
- [x] **Anti-Fórmula CSV (CWE-1236):** Neutralización de comandos maliciosos al exportar.
- [x] **Metodología Transparente del IID:** Cálculo correcto y avisos explícitos ante valores > 100%.

---

## 📂 Credenciales de Demostración (Entorno Local)

- **Negocio Principal:** ADNQN Coffee Roasters (`adnqn-coffee`)
  - **Administrador:** `admin@adnqncoffee.com` / `admin123`
  - **Página de Captura:** `/c/adnqn-coffee`
  - **Página de Continuidad:** `/c/adnqn-coffee/continuity`
- **Negocio Aislado (Multi-tenant):** Patagonia Crossfit (`patagonia-crossfit`)
- **SuperAdmin ADNQN:** `soporte@adnqn.com` / `adnqn2026!`

---

## 📦 Adaptador de Correo (Modo Sandbox)

Para facilitar el desarrollo y pruebas locales sin requerir credenciales externas:
- `EMAIL_PROVIDER="mock"` registra todos los envíos en memoria.
- Los enlaces de confirmación y prueba de rescate se imprimen en consola y se muestran en pantalla para verificación inmediata.
- En producción, basta con configurar `EMAIL_PROVIDER="resend"` y `RESEND_API_KEY="..."`.
