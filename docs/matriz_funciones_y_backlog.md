# Social Backup by ADNQN — Matriz de Funcionalidades, API y Backlog

Versión: MVP Etapa 1 · Fecha de verificación: 27 de octubre de 2026 · ADNQN

---

## 1. Matriz de Funcionalidades (Estado del MVP)

| Módulo / Capacidad | Prioridad | Estado Actual | Dependencia Externa | Criterio de Aceptación Verificado |
| :--- | :--- | :--- | :--- | :--- |
| **Aislamiento Multitenant** | P0 (Crítico) | **Operativo** | Ninguna (SQLite/PostgreSQL) | Consultas filtradas por `tenant_id`; verificación cruzada de IDs probada en tests. |
| **Captación Pública Hosted** | P0 (Crítico) | **Operativo** | Ninguna (Next.js) | Formulario responsivo `/c/[slug]` con marca y consentimiento sin casillas premarcadas. |
| **Widget Web Embebible** | P0 (Crítico) | **Operativo** | Navegador del cliente | Script `public/widget.js` ligero, solo inserción, cero exposición de secretos ni base. |
| **Códigos QR & Enlaces UTM** | P1 (Alto) | **Operativo** | Canvas / PNG | Generador con marca, descarga PNG en alta resolución y enlaces con parámetros UTM. |
| **Doble Opt-In & Tokens** | P0 (Crítico) | **Operativo** | Criptografía Node.js | Tokens SHA-256 de un solo uso con caducidad a las 24 hs. Reutilización rechazada. |
| **Gestión de Consentimientos** | P0 (Crítico) | **Operativo** | Ninguna | Registro inmutable de IP hash, user agent, fecha, origen y finalidad. |
| **Bajas y Opt-out Voluntario** | P0 (Crítico) | **Operativo** | Ninguna | Página `/c/[slug]/preferences` con baja en 1 clic y exclusión inmediata de envíos. |
| **Modo Rescate (Social Rescue)** | P0 (Crítico) | **Operativo** | Adaptador de correo | Wizard de 5 pasos, validación de nueva URL, re-chequeo de bajas y prueba al admin. |
| **Claves de Idempotencia** | P0 (Crítico) | **Operativo** | Base de Datos (Unique Key) | Despacho repetido con la misma clave no duplica envíos ni mensajes. |
| **Página de Continuidad** | P1 (Alto) | **Operativo** | Dominio neutral | Enlace `/c/[slug]/continuity` activo y accesible aun con redes sociales caídas. |
| **Exportación CSV Segura** | P1 (Alto) | **Operativo** | Ninguna | Descarga aislada por tenant con saneamiento anti-fórmulas maliciosas (CWE-1236). |
| **Índice IID** | P1 (Alto) | **Operativo** | Ninguna | Relación contactos verificados / seguidores brutos con metodología visible y notas >100%. |
| **Respaldos (Snapshots)** | P1 (Alto) | **Operativo** | Algoritmo SHA-256 | Exportación íntegra JSON con checksum de integridad y protocolo *Safe Restore*. |
| **Adaptador de Correo** | P0 (Crítico) | **Sandbox Activo** | Resend / SMTP | Modo sandbox para pruebas locales y trazabilidad clara sin costos ni riesgos. |

---

## 2. Matriz de Integraciones Sociales (Límites Oficiales Reales)

> **Regla de Producto:** Prohibido el scraping invasivo, bots automatizados o extracción masiva no autorizada de correos de seguidores. Toda integración debe emplear APIs oficiales documentadas y permisos mínimos aprobados.

| Plataforma | Tipo de API Oficial | Permisos Requeridos | Estado Real | Capacidades Verificadas y Limitaciones |
| :--- | :--- | :--- | :--- | :--- |
| **Instagram** | Meta Graph API (Instagram Graph) | `instagram_basic`, `pages_show_list` | **Por verificar / Próximamente** | Requiere cuenta profesional/creador y App Review de Meta. Permite consultar métricas de cuenta y seguidores reportados. **No permite** obtener correos personales de seguidores. |
| **Facebook** | Meta Graph API | `pages_read_engagement` | **Por verificar / Próximamente** | Permite leer contadores públicos de la página oficial. No permite mensajería masiva no solicitada. |
| **TikTok** | TikTok for Business API | `user.info.basic` | **Por verificar / Próximamente** | Acceso a métricas de perfil previa aprobación de Developer App. Mensajería directa sujeta a aprobación comercial estricta. |
| **YouTube** | YouTube Data API v3 | `youtube.readonly` | **Por verificar / Próximamente** | Lectura de suscriptores del canal con cuotas diarias de Google Cloud. |
| **WhatsApp** | WhatsApp Business Platform (Cloud API) | `whatsapp_business_messaging` | **Backlog Etapa 2** | Requiere plantillas pre-aprobadas por Meta y número de teléfono verificado. Cada plantilla tiene costo variable por conversación. |

---

## 3. Backlog de Etapas Posteriores

### Etapa 2 — Integraciones y Gestión Avanzada
- Conexión OAuth 2.0 oficial con Meta Graph API para sincronización automática de seguidores reportados.
- Adaptador para WhatsApp Cloud API con verificación de números y plantillas de rescate de emergencia.
- Integración de Webhooks transaccionales para rebotes (*bounces*) y quejas de spam.
- Segmentación por etiquetas dinámicas y campañas de captación contextuales.

### Etapa 3 — Plataforma Comercial & Social Web ADNQN
- Módulo **Social Web**: constructor de páginas web profesionales exclusivo de ADNQN integrado nativamente con el núcleo SaaS.
- Plugin delgado para **WordPress** para inserción de formularios y widgets sin transferir bases ni exponer secretos.
- Pasarela de cobros y facturación recurrente (Mercado Pago / Stripe) para planes Inicial, Profesional y Empresa.
- Sistema de marca blanca (*White-label*) reservado para agencias autorizadas por ADNQN.
