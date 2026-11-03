export interface IIDCalculationResult {
  hasSufficientData: boolean;
  scorePercentage: number | null;
  verifiedContactsCount: number;
  enabledContactsCount: number;
  totalReportedFollowers: number;
  breakdown: {
    instagram: number;
    facebook: number;
    tiktok: number;
    youtube: number;
    linkedIn: number;
    x: number;
  };
  methodologyNote: string;
  isOverHundredPercent: boolean;
  explanation?: string;
}

export function calculateIID(
  verifiedContacts: number,
  enabledContacts: number,
  followers: {
    instagram?: number;
    facebook?: number;
    tiktok?: number;
    youtube?: number;
    linkedIn?: number;
    x?: number;
  }
): IIDCalculationResult {
  const ig = followers.instagram || 0;
  const fb = followers.facebook || 0;
  const tt = followers.tiktok || 0;
  const yt = followers.youtube || 0;
  const li = followers.linkedIn || 0;
  const x = followers.x || 0;

  const totalFollowers = ig + fb + tt + yt + li + x;

  if (totalFollowers <= 0) {
    return {
      hasSufficientData: false,
      scorePercentage: null,
      verifiedContactsCount: verifiedContacts,
      enabledContactsCount: enabledContacts,
      totalReportedFollowers: 0,
      breakdown: { instagram: ig, facebook: fb, tiktok: tt, youtube: yt, linkedIn: li, x },
      methodologyNote:
        "Sin datos suficientes: Ingresa los seguidores de tus redes sociales para calcular la relación con tus contactos verificados.",
      isOverHundredPercent: false,
    };
  }

  // Denominador: suma directa de seguidores reportados
  const rawRatio = (verifiedContacts / totalFollowers) * 100;
  const score = Math.round(rawRatio * 10) / 10;
  const isOverHundred = score > 100;

  let explanation: string | undefined = undefined;
  if (isOverHundred) {
    explanation =
      "El índice supera el 100% porque la base de contactos propios verificados es mayor que la suma de seguidores declarados en redes, o existen contactos captados fuera de las redes ingresadas.";
  }

  return {
    hasSufficientData: true,
    scorePercentage: score,
    verifiedContactsCount: verifiedContacts,
    enabledContactsCount: enabledContacts,
    totalReportedFollowers: totalFollowers,
    breakdown: { instagram: ig, facebook: fb, tiktok: tt, youtube: yt, linkedIn: li, x },
    isOverHundredPercent: isOverHundred,
    explanation,
    methodologyNote:
      "Metodología transparente: Compara contactos propios verificados con la suma bruta de seguidores reportados en plataformas. Nota: Los seguidores en redes contienen duplicados entre plataformas y no garantizan entrega de mensajes ni personas únicas.",
  };
}
