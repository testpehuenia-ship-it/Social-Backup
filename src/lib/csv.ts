export interface CsvContactRow {
  id: string;
  nombre: string;
  email: string;
  estado: string;
  canal_verificado: string;
  fecha_verificacion: string;
  autoriza_rescate: string;
  autoriza_noticias: string;
  origen: string;
  fecha_registro: string;
}

export function sanitizeCsvField(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Anti Formula Injection (CWE-1236): Prevenir ejecución de macros al abrir en Excel/Sheets
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escapar comillas dobles
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function generateContactsCsv(rows: CsvContactRow[]): string {
  const headers = [
    "ID Contacto",
    "Nombre",
    "Email",
    "Estado",
    "Canal Verificado",
    "Fecha Verificación",
    "Autoriza Rescate",
    "Autoriza Novedades",
    "Origen",
    "Fecha Registro",
  ];

  const headerLine = headers.map(sanitizeCsvField).join(",");
  const dataLines = rows.map((row) =>
    [
      row.id,
      row.nombre,
      row.email,
      row.estado,
      row.canal_verificado,
      row.fecha_verificacion,
      row.autoriza_rescate,
      row.autoriza_noticias,
      row.origen,
      row.fecha_registro,
    ]
      .map(sanitizeCsvField)
      .join(",")
  );

  return [headerLine, ...dataLines].join("\r\n");
}
