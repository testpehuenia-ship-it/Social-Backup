# PROMPT MAESTRO — SOCIAL BACKUP by ADNQN

Versión consolidada · 27 de octubre de 2026 · Idioma: español

Este documento está listo para copiarse en una IA de programación. Reúne el alcance acordado y añade especificaciones de implementación y aceptación. Los valores comerciales propuestos son configurables; las capacidades de terceros deben verificarse antes de implementarlas. No constituye una verificación de políticas de API ni asesoramiento jurídico vigente.

---

## INICIO DEL PROMPT

### 1. Rol, misión y forma de trabajo

Actúa con las competencias de arquitectura de software, desarrollo full stack, UX/UI, integraciones oficiales, seguridad, operaciones y producto SaaS. Diseña e implementa **Social Backup by ADNQN**, una plataforma comercializable para construir, administrar, proteger y recuperar la comunicación con comunidades de negocios.

Principio del producto: **«Tus redes pueden desaparecer. Tu comunidad debe permanecer».**

Identidad comercial:

- **Social Backup:** «Tu comunidad. Tus contactos. Tu futuro».
- **Powered by ADNQN:** «Tecnología que impulsa negocios».

Produce software funcional y documentación reproducible. Comienza por inspeccionar el repositorio y respetar sus instrucciones. Si no existe código, crea una estructura mantenible. Explicita los supuestos y resuelve decisiones reversibles sin frenar por detalles menores. Solicita información cuando falten credenciales, decisiones contractuales o datos imprescindibles.

Implementa por etapas, empezando por una primera versión completa de punta a punta. No declares operativo lo que esté simulado, sin credenciales o pendiente de revisión de un proveedor. Los datos de demostración deben estar identificados y separados de producción. No ejecutes envíos reales, cobros o publicaciones de producción como parte de pruebas sin autorización correspondiente.

### 2. Objetivo y dos funciones centrales

**Captación:** convertir progresivamente a seguidores y visitantes en contactos registrados voluntariamente, con canales verificables y preferencias de comunicación.

**Recuperación:** cuando un negocio pierda una cuenta social, permitirle comunicar su nueva presencia a los contactos que tengan un canal habilitado y autorización aplicable.

El producto también respalda los datos propios y la información de plataformas cuya consulta y conservación estén permitidas. No promete copiar toda una audiencia, recuperar contraseñas, restaurar cuentas sociales ni conservar información de terceros contra sus condiciones.

Ejemplo de referencia: un comercio con 1.000 seguidores en Facebook publica una invitación al registro. Quienes la completan y autorizan comunicaciones pasan a integrar su base. La conexión de Facebook por sí sola no convierte esos 1.000 seguidores en 1.000 contactos disponibles para enviar mensajes.

### 3. Modelo comercial y exclusividad ADNQN

Construye un núcleo SaaS multicliente compartido por estas modalidades:

1. **Social Backup Free independiente:** cuenta del negocio, página de captación alojada, formulario, widget básico para una web existente, contactos, exportación y rescate básico por correo dentro de cuotas.
2. **Social Backup Profesional:** capacidades avanzadas de gestión e integraciones habilitadas según contratación y permisos disponibles.
3. **Social Backup + Web ADNQN:** experiencia completa integrada en sitios desarrollados y gestionados por ADNQN, con personalización avanzada y Social Web.

La generación y provisión comercial de sitios completos con Social Web queda reservada a ADNQN. La disponibilidad de widget o plugin para sitios de terceros no concede acceso al constructor ni derecho a revender webs ADNQN. Implementa esta distinción mediante permisos y derechos de plan en el servidor.

Propuesta inicial configurable para Free: hasta 100 contactos activos, un formulario básico, una integración social compatible y cuotas reducidas de campañas y envíos. El MVP no requiere disponer de una integración social operativa: mostrar «próximamente» cuando corresponda. No inventar precios, costos incluidos ni compatibilidades comerciales.

Permite planes Inicial, Profesional y Empresa, además del paquete Web ADNQN. Administra límites de contactos, usuarios, formularios, integraciones, campañas, almacenamiento y consumo. Al alcanzar una cuota, informa el límite y ofrece una acción clara; no elimines datos ni cobres automáticamente excedentes sin acuerdo. Distingue suscripción de costos variables de correo, WhatsApp y SMS.

La exportación de contactos y la gestión de bajas y derechos deben seguir disponibles en Free. Define un procedimiento transparente de cancelación, exportación y retención. No retengas la base como mecanismo de cautividad.

Conserva marca blanca y gestión de agencias/distribuidores en el alcance futuro, bajo habilitación comercial de ADNQN. No deben abrir por defecto la reventa del constructor exclusivo.

### 4. Módulo Social Capture

Implementa:

- Página de registro por negocio con marca, colores, textos y URL propios.
- Nombre y apellido opcionales según campaña; correo y/o teléfono según el canal elegido. Minimiza los datos solicitados.
- Formularios personalizados, campos permitidos, validación y protección contra abuso.
- Consentimiento claro por finalidad y canal, con enlace a privacidad y sin casillas premarcadas.
- Verificación por correo mediante enlace de un solo uso. Teléfono/WhatsApp mediante proveedor habilitado en una fase posterior.
- Enlaces de campaña para biografías, publicaciones, historias, anuncios y descripciones.
- Códigos QR descargables que apunten a esos enlaces.
- Atribución mediante UTM y origen declarado; diferencia atribución observada de estimada.
- Widget JavaScript adaptable, accesible y personalizable, sin exponer secretos ni permitir consultar contactos.
- Página de agradecimiento, estados de verificación, preferencias y baja.
- Deduplicación dentro de cada negocio y conservación de múltiples orígenes.

Ejemplo de texto: «¡Queremos seguir conectados con vos! Registrate en nuestra comunidad para recibir las novedades que elijas, aunque cambiemos de redes sociales».

Asistente inicial: crear negocio → configurar marca y privacidad → publicar formulario → generar enlaces y QR → instalar widget → recibir y verificar un registro → consultar consentimientos → comprobar respaldo. Conectar redes será opcional y dependerá de disponibilidad real.

Automatizaciones previstas:

- Interacción por palabra clave, por ejemplo «QUIERO», en comentarios compatibles.
- Respuesta o invitación privada únicamente cuando la API y los permisos permitan esa interacción concreta.
- Respuestas a conversaciones iniciadas por la persona dentro de las condiciones vigentes.
- Integración con formularios publicitarios cuando exista acceso autorizado.

Comentar o iniciar una conversación no equivale a autorizar campañas externas. El enlace llevará a un registro que recoja las autorizaciones necesarias. Si una automatización no está disponible, ofrecer enlace, QR y texto listo para publicación manual.

### 5. Módulo Social Rescue

Construye un asistente de Modo Rescate:

1. Seleccionar la plataforma afectada e informar el incidente.
2. Introducir la nueva cuenta o URL oficial, con validación de formato y dominio.
3. Reautenticar al administrador y verificar sus permisos para iniciar una campaña sensible.
4. Seleccionar destinatarios propios elegibles por canal, finalidad, verificación y estado de baja.
5. Mostrar incluidos, excluidos y motivos, costos estimados y cuotas disponibles.
6. Preparar mensaje y vista previa; enviar una prueba al administrador.
7. Confirmar expresamente la audiencia y el envío.
8. Procesar en cola y mostrar resultados, errores, pausas y reintentos.

Correo electrónico será el canal inicial. WhatsApp Business Platform, SMS y notificaciones push web serán ampliaciones condicionadas a permisos, suscripciones, plantillas y proveedores aplicables. Tener un teléfono no implica consentimiento de WhatsApp ni de SMS. El permiso del navegador para push tampoco sustituye todas las decisiones de privacidad del producto.

Incluye una página pública de continuidad en un dominio controlado por el negocio o ADNQN. Rescate debe seguir funcionando aunque se desconecte la red afectada. El acceso administrativo no puede depender exclusivamente de iniciar sesión con esa red.

Evita duplicados mediante claves de idempotencia. Comprueba bajas y elegibilidad otra vez justo antes de enviar cada mensaje. Una cancelación o restauración nunca debe reactivar envíos ni permisos revocados.

Ejemplo: «¡Seguimos conectados! Nuestra cuenta anterior de Instagram ya no está disponible. Encontranos en nuestra nueva cuenta oficial: [enlace]. Podés cambiar tus preferencias o darte de baja aquí: [enlace]».

### 6. Módulo Social Manager

Panel responsive para personas sin conocimientos técnicos:

- Resumen de contactos propios, verificados y habilitados por canal.
- Nuevos registros, crecimiento, campañas y conversiones con denominadores explícitos.
- Seguidores reportados por plataforma, fuente y fecha de actualización.
- Estado de integraciones, cuotas y último respaldo verificado.
- Búsqueda, filtros, etiquetas, segmentos, edición, fusión y eliminación de contactos.
- Historial de consentimientos, verificaciones y comunicaciones.
- Importación CSV con mapeo, previsualización, deduplicación y evidencia de procedencia; importar no concede permiso para enviar.
- Exportación CSV, Excel y JSON por negocio y rol autorizado.
- Campañas con borrador, vista previa, prueba, programación, confirmación, pausa y resultados.
- Usuarios, roles, seguridad, auditoría y preferencias.

Contabiliza por separado solicitados, en cola, aceptados por proveedor, entregados cuando haya evidencia, fallidos y bajas. No confundir aceptación del proveedor con entrega. Aperturas y clics tendrán límites de fiabilidad y privacidad claramente indicados.

**Índice de Independencia Digital (IID):** indicador orientativo con metodología visible. Mostrar contactos únicos verificados y contactos habilitados. Si el denominador es la suma de seguidores reportados, aclarar que incluye posibles duplicados entre redes y que no mide personas únicas ni recuperación garantizada. No estimar audiencia única sin evidencia. Con datos faltantes o denominador cero, mostrar «sin datos suficientes». No ocultar resultados superiores al 100 % mediante recortes: revisar y explicar el alcance distinto de numerador y denominador. Separar conversión de una campaña del IID general.

### 7. Módulo Social Web

Desarrollar en una etapa posterior un constructor de sitios profesionales reservado a ADNQN, conectado al mismo núcleo SaaS.

Páginas y bloques: inicio, nosotros, productos, servicios, contacto, blog, redes, comunidad, formulario, widget, privacidad, preferencias y continuidad ante incidentes.

Incluir plantillas, borrador, previsualización, publicación, versiones, SEO básico, accesibilidad, optimización móvil, imágenes optimizadas y dominio personalizado con comprobación de titularidad. Sanear el contenido editable y evitar código arbitrario por defecto.

Permite que ADNQN administre sitios y que el cliente edite únicamente lo habilitado. El MVP usa una página de captación funcional; no requiere construir desde el inicio un editor visual completo.

**WordPress:** crear posteriormente un plugin delgado para conectar una instalación a su negocio, configurar e insertar formularios/widgets y mostrar el estado. El SaaS central mantiene contactos, cuotas, actualizaciones de negocio y reglas de comunicación. No introducir secretos en el navegador ni copiar toda la base a WordPress por defecto. Documentar instalación, desconexión, compatibilidad, permisos y actualizaciones.

### 8. Integraciones oficiales y límites de privacidad

Redes candidatas: Facebook, Instagram, TikTok, YouTube, LinkedIn, X y otras con integraciones oficiales adecuadas. Son objetivos de evaluación, no promesas de acceso.

Antes de implementar cada conector, consulta documentación oficial vigente y entrega una ficha con fecha, enlaces, versión, tipo de cuenta requerido, permisos, revisión de aplicación, cuotas, costos, webhooks, datos consultables, retención, eliminación y capacidades de mensajería. Si no puedes comprobar una capacidad, márcala «por verificar» y mantenla desactivada.

Usa OAuth u otro mecanismo oficial documentado. Solicita permisos mínimos, cifra tokens, gestiona expiración y revocación y valida firmas de webhooks. No almacenes contraseñas sociales.

Prohibido utilizar scraping no autorizado, automatización evasiva, listas compradas o extracción de correos/teléfonos de seguidores. No prometer mensajes privados masivos a toda una audiencia por el hecho de seguir una cuenta.

Clasifica cada función como operativa, pendiente de configuración, pendiente de aprobación, por verificar o no disponible. La interfaz debe mostrar el estado real y ofrecer alternativas manuales útiles.

### 9. Arquitectura propuesta

Prioriza un monolito modular con procesos de trabajo separados; evita microservicios prematuros.

- Frontend: Next.js, React, TypeScript y Tailwind CSS.
- Backend: Node.js con NestJS o alternativa justificada de complejidad equivalente.
- Persistencia: PostgreSQL y Prisma, con migraciones versionadas.
- Colas: Redis y BullMQ o servicio gestionado equivalente.
- Archivos y respaldos: almacenamiento de objetos privado compatible con S3, cifrado y con política de ciclo de vida.
- Correo: adaptador de proveedor transaccional, webhooks y entorno de pruebas.
- Identidad: proveedor mantenido, sesiones seguras, MFA y recuperación de acceso independiente de redes.
- Operación: Docker, CI, tareas programadas, registros estructurados, métricas y alertas.

Comprueba compatibilidad y mantenimiento de versiones al comenzar. Documenta alternativas, costos y decisiones en registros de arquitectura. Proporciona `.env.example` sin secretos y configuración separada para desarrollo, pruebas y producción.

Diagrama esperado: web/panel/widget/plugin → API → módulos de negocio → PostgreSQL; API → cola → trabajadores → proveedores; proveedores → webhooks verificados → procesamiento idempotente; respaldo → almacenamiento independiente.

El widget usa un identificador público y permisos mínimos para altas. Nunca puede listar contactos ni aceptar un identificador de negocio como prueba de autorización. Validar origen ayuda a limitar abuso, pero no sustituye autenticación, validación ni controles del servidor.

### 10. Multicliente y modelo de datos

Cada negocio tiene usuarios, marca, contactos, integraciones, campañas, sitio y plan propios. «Base independiente» significa aislamiento efectivo; no exige una instancia física por cliente. Usa `tenant_id` en las entidades correspondientes, claves e índices compuestos y controles de acceso centralizados. Añade políticas de aislamiento en PostgreSQL cuando corresponda y prueba el contexto de conexiones del ORM. Evalúa bases dedicadas solo si un contrato o escala lo requieren.

Entidades mínimas:

- Tenant, User, Membership y Role.
- Plan, Entitlement, Subscription y UsageCounter.
- Contact y ContactChannel, con normalización y estado de verificación.
- ConsentEvent y Preference, con finalidad, canal, versión de texto, fecha y procedencia.
- VerificationToken, con hash, vencimiento y uso único.
- Form, CaptureCampaign, CaptureEvent y Attribution.
- Tag, ContactTag y Segment.
- SocialConnection, PlatformAccount, Capability y SyncRun.
- CommunicationCampaign, Recipient, Message, DeliveryEvent y Suppression.
- RescueIncident y RescueCampaign.
- BackupRun, RestoreJob, ExportJob y AuditEvent.
- Site, Page, PageVersion y Domain en Social Web.
- BillingEvent y ProviderWebhookEvent en facturación e integraciones.

No confundas contacto, seguidor, suscriptor de un canal y usuario administrador. Mantén identidad y consentimiento separados. La deduplicación será por negocio: no reveles que una misma persona está registrada en otra empresa. No fusiones solo por nombre ni alteres direcciones de correo mediante reglas que puedan confundir identidades. Para fusiones ambiguas, exige revisión.

Define restricciones, índices, retención, borrados y auditoría. Evita guardar datos personales completos en registros técnicos. Conserva solo evidencia necesaria y proporcionada del consentimiento.

### 11. API y procesos

Documenta con OpenAPI los contratos de autenticación, negocio, contactos, formularios públicos, verificaciones, preferencias, campañas, rescate, exportaciones, respaldos, integraciones, cuotas y sitios.

Incluye validación, paginación, códigos de error, autorización por recurso, límites de tasa e idempotencia donde corresponda. Genera exportaciones grandes de forma asíncrona con enlaces privados de corta duración. Protege contra fórmulas peligrosas al abrir CSV/Excel.

Trabajos en cola: verificación, envío, webhooks, sincronización, respaldo, exportación y restauración. Implementa reintentos limitados con espera progresiva, cola de fallos, trazabilidad y alertas. El reprocesamiento no puede duplicar mensajes, cargos ni cambios de consentimiento.

### 12. Seguridad, privacidad y continuidad

- Roles: propietario, administrador, operador, lector y administrador de plataforma con acceso restringido y auditado.
- MFA para acciones sensibles; recuperación de acceso y códigos de respaldo.
- Cifrado TLS, datos y copias cifradas, secretos fuera del repositorio y rotación.
- Protección contra XSS, CSRF, inyección, acceso entre negocios, abuso de formularios y exposición de archivos.
- Consentimiento verificable por canal/finalidad, preferencias, baja accesible, supresión y atención de acceso, rectificación, exportación y eliminación.
- Separar verificación de dirección de autorización comercial. Una comunicación de rescate no omite las reglas aplicables.
- Retención configurable, minimización de datos, plan de incidentes y documentación de proveedores/subencargados.
- Definir contractualmente el papel del negocio y ADNQN respecto de los datos, su portabilidad y el cierre del servicio.

Para lanzamiento en Argentina, revisar la Ley 25.326 y normativa y criterios aplicables, además de los mercados atendidos. Esa revisión debe hacerse con fuentes vigentes y asesoramiento apropiado antes de producción; no declarar cumplimiento por disponer de un checkbox.

### 13. Respaldos y restauración

Implementa copias automáticas diarias como punto de partida, cifradas y con una copia independiente. Documenta frecuencia, retención, ubicación, costos y objetivos RPO/RTO propuestos y medidos. La frecuencia diaria por sí sola no garantiza un RPO contractual.

Incluye historial, alertas, comprobación de integridad, simulacros periódicos y evidencia de restauración. Distingue exportación por cliente de respaldo operativo completo.

Restaura primero en un entorno aislado. Una recuperación de un negocio no debe sobrescribir a otros. Reaplica bajas, eliminaciones y restricciones posteriores al respaldo; no reutilices tokens vencidos ni reproduzcas campañas ya ejecutadas. Registra quién autorizó y ejecutó cada restauración.

### 14. Diseño de experiencia y pantallas

Interfaz profesional, clara y accesible, con español como idioma inicial y preparación para traducciones. Prioriza celular, navegación por teclado, etiquetas comprensibles, foco visible y contraste adecuado. Usa estados reales de carga, vacío, error, éxito, cuota y desconexión.

Pantallas mínimas: acceso y recuperación; alta de negocio; asistente inicial; dashboard; contactos y detalle; formularios y previsualización; enlaces/QR/widget; campañas; Modo Rescate; respaldos/exportaciones; integraciones; marca; usuarios/seguridad; plan y consumo; panel interno ADNQN. Las páginas públicas incluyen registro, verificación, agradecimiento, preferencias, baja y continuidad.

El panel interno de ADNQN administra planes, sitios y salud del servicio sin habilitar acceso indiscriminado a los contactos de clientes.

### 15. Desarrollo por etapas

**Etapa 0 — Diseño ejecutable:** requisitos trazables, decisiones de arquitectura, modelo de datos, flujos, permisos, amenazas principales, costos estimados y matriz de capacidades por proveedor. Identifica los bloqueos externos.

**Etapa 1 — MVP funcional:** registro de negocios y usuarios, aislamiento multicliente, formulario público, widget, página alojada, enlaces y QR, verificación de correo, consentimientos, contactos, filtros básicos, exportación CSV, cuotas Free, respaldo automático y restauración probada, rescate por correo con vista previa, confirmación, bajas y resultados reales. Incluir panel básico ADNQN y documentación de instalación.

El primer recorrido debe funcionar completo: crear negocio → publicar formulario → registrar contacto → verificar correo y consentimiento → verlo en el panel → exportarlo → enviar prueba y campaña de rescate autorizada → procesar baja → comprobar exclusión de siguientes envíos.

**Etapa 2 — Integraciones y gestión avanzada:** primer conector oficial viable, estadísticas, captación autorizada por interacción, formularios publicitarios, segmentación avanzada, importación con procedencia, Excel/JSON, WhatsApp, push y SMS según validación. Completar IID con fuentes reales.

**Etapa 3 — Plataforma comercial:** suscripciones, pagos y facturación según mercado, plugin WordPress, Social Web exclusivo ADNQN, dominios, marca blanca y agencias habilitadas, soporte, observabilidad y endurecimiento de producción.

No eliminar del alcance global las funciones posteriores. Mantener un backlog donde cada una tenga prioridad, dependencia, criterio de aceptación y estado.

### 16. Pruebas y criterios de aceptación

Comprueba al menos:

1. Un negocio no puede leer ni modificar recursos de otro, incluidos archivos, trabajos, webhooks y rutas con identificadores manipulados.
2. Un formulario crea o actualiza un contacto del negocio correcto y conserva procedencia y evidencia de consentimiento.
3. Verificar correo no habilita por sí solo marketing u otros canales.
4. Tokens caducados, usados o inválidos se rechazan sin exponer datos.
5. Un contacto dado de baja queda excluido incluso si la campaña ya estaba en cola.
6. Un reintento o webhook duplicado no duplica envíos ni eventos relevantes.
7. El dashboard separa seguidores, contactos, verificados y habilitados, con fuentes y fechas.
8. Alcanzar la cuota Free impide excedentes según política sin borrar datos y mantiene exportación y bajas.
9. Rescate funciona con la red afectada desconectada y requiere confirmación del administrador.
10. Exportaciones incluyen solo datos autorizados del negocio y archivos privados.
11. Una restauración comprobada preserva aislamiento y no resucita consentimientos revocados ni envíos.
12. Integraciones sin credenciales o aprobación muestran su estado real.
13. Formularios y flujo principal funcionan en móvil y con teclado.
14. En producción, el envío pasa por un proveedor configurado; en pruebas se utiliza un entorno seguro claramente identificado.

Entrega pruebas unitarias de reglas críticas, integración de aislamiento/consentimientos/idempotencia y pruebas de punta a punta del recorrido MVP. No sustituyas evidencia de funcionamiento por capturas con datos ficticios.

### 17. Entregables obligatorios

1. Resumen de producto, supuestos y alcance por fase.
2. Matriz de funciones con prioridad, estado y dependencias externas.
3. Arquitectura y diagramas de componentes y flujos.
4. Modelo entidad-relación, migraciones y estrategia multicliente.
5. Mapa de pantallas y diseño responsive.
6. Repositorio con código funcional del MVP y datos de ejemplo identificados.
7. API OpenAPI y ejemplos de uso.
8. Autenticación, roles, MFA cuando corresponda y recuperación.
9. Widget y documentación de inserción.
10. Formularios, panel, contactos, consentimientos y exportación.
11. Modo Rescate por correo y adaptadores de proveedores.
12. Respaldos, procedimiento de restauración y evidencia de ensayo.
13. Pruebas automatizadas, resultados y limitaciones pendientes.
14. Docker/configuración local, `.env.example`, guía de instalación y CI.
15. Guías de despliegue, monitoreo, incidentes y operación.
16. Matriz de API oficiales con enlaces y fecha de comprobación.
17. Estimación de costos por infraestructura, almacenamiento y canal, con supuestos.
18. Backlog de integraciones, WordPress, Social Web, pagos, facturación y marca blanca.
19. Manual breve del negocio y manual administrativo ADNQN.

Para cada entrega informa qué funciona, cómo se verificó, qué necesita configuración y qué queda pendiente. No declares el producto apto para producción mientras falten controles críticos, proveedor de envío, pruebas de restauración o revisión de requisitos aplicables.

### 18. Primera respuesta y ejecución esperadas

Comienza por presentar brevemente la arquitectura elegida, el alcance concreto del MVP, sus supuestos y el orden de construcción. Después crea la estructura e implementa el primer recorrido funcional. Mantén un registro de avances y pendientes verificables y continúa por las etapas autorizadas.

Si falta una credencial, desarrolla y prueba el adaptador con un entorno de pruebas identificado; documenta la configuración restante. No inventes respuestas reales de proveedores ni números de contactos recuperados.

**Resultado final:** una plataforma SaaS independiente con versión freemium y una experiencia profesional integrada en webs exclusivas de ADNQN, que permita captar contactos voluntarios, gestionarlos, respaldarlos y recuperar la comunicación por canales autorizados cuando una red social deje de estar disponible.

## FIN DEL PROMPT
