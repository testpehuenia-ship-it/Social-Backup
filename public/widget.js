/**
 * Social Backup by ADNQN — Embeddable Capture Widget
 * Light, responsive, zero-dependency, secure (write-only).
 * Usage:
 * <div id="social-backup-widget" data-tenant="adnqn-coffee"></div>
 * <script src="https://socialbackup.adnqn.com/widget.js" async defer></script>
 */
(function () {
  if (window.SocialBackupWidgetLoaded) return;
  window.SocialBackupWidgetLoaded = true;

  function initWidget() {
    var containers = document.querySelectorAll("[data-social-backup], #social-backup-widget");
    if (!containers || containers.length === 0) return;

    containers.forEach(function (container) {
      if (container.dataset.initialized) return;
      container.dataset.initialized = "true";

      var tenantSlug = container.getAttribute("data-tenant") || "adnqn-coffee";
      var brandColor = container.getAttribute("data-brand-color") || "#059669";
      var title = container.getAttribute("data-title") || "Unite a nuestra comunidad";
      var desc = container.getAttribute("data-desc") || "Tus redes pueden desaparecer, nuestra comunidad permanece.";
      var baseUrl = container.getAttribute("data-api-url") || window.location.origin;

      var html = [
        '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 12px; padding: 24px; max-width: 440px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); box-sizing: border-box;">',
        '  <div style="margin-bottom: 16px;">',
        '    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">',
        '      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ' + brandColor + ';"></span>',
        '      <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">' + title + '</h3>',
        '    </div>',
        '    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.4;">' + desc + '</p>',
        '  </div>',
        '  <form id="sb-form-' + tenantSlug + '" style="display: flex; flex-direction: column; gap: 12px;">',
        '    <div>',
        '      <label style="display: block; font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 4px;">Tu Nombre (opcional)</label>',
        '      <input type="text" name="name" placeholder="Ej: Valentina" style="width: 100%; box-sizing: border-box; background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 10px 12px; font-size: 14px; color: #fff; outline: none;" />',
        '    </div>',
        '    <div>',
        '      <label style="display: block; font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 4px;">Tu Correo Electrónico *</label>',
        '      <input type="email" name="email" required placeholder="tu@email.com" style="width: 100%; box-sizing: border-box; background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 10px 12px; font-size: 14px; color: #fff; outline: none;" />',
        '    </div>',
        '    <div style="background: rgba(30, 41, 59, 0.7); border-radius: 6px; padding: 10px; border: 1px solid #334155; margin-top: 4px;">',
        '      <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #cbd5e1; cursor: pointer;">',
        '        <input type="checkbox" name="consentRescue" required style="margin-top: 2px; accent-color: ' + brandColor + ';" />',
        '        <span>Autorizo recibir avisos de continuidad y nueva presencia si cambian las redes sociales de este negocio. *</span>',
        '      </label>',
        '    </div>',
        '    <div style="background: rgba(30, 41, 59, 0.7); border-radius: 6px; padding: 10px; border: 1px solid #334155;">',
        '      <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #cbd5e1; cursor: pointer;">',
        '        <input type="checkbox" name="consentNews" style="margin-top: 2px; accent-color: ' + brandColor + ';" />',
        '        <span>Quiero recibir novedades, promociones y lanzamientos exclusivos.</span>',
        '      </label>',
        '    </div>',
        '    <div id="sb-status-' + tenantSlug + '" style="display: none; padding: 10px; border-radius: 6px; font-size: 13px;"></div>',
        '    <button type="submit" style="cursor: pointer; background: ' + brandColor + '; color: #ffffff; border: none; border-radius: 6px; padding: 12px; font-size: 14px; font-weight: 600; transition: opacity 0.2s;">Registrarme en la Comunidad</button>',
        '    <div style="text-align: center; font-size: 11px; color: #64748b; margin-top: 4px;">',
        '      Protegido por <strong>Social Backup</strong> · Powered by ADNQN',
        '    </div>',
        '  </form>',
        '</div>'
      ].join("\n");

      container.innerHTML = html;

      var form = document.getElementById("sb-form-" + tenantSlug);
      var statusBox = document.getElementById("sb-status-" + tenantSlug);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;
        submitBtn.innerText = "Registrando...";

        var email = form.querySelector("input[name=email]").value.trim();
        var name = form.querySelector("input[name=name]").value.trim();
        var consentRescue = form.querySelector("input[name=consentRescue]").checked;
        var consentNews = form.querySelector("input[name=consentNews]").checked;

        fetch(baseUrl + "/api/capture/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantSlug: tenantSlug,
            email: email,
            name: name,
            consentRescue: consentRescue,
            consentNews: consentNews,
            source: "WIDGET",
            originUrl: window.location.href,
          }),
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Registrarme en la Comunidad";
            if (data.success) {
              form.style.display = "none";
              statusBox.style.display = "block";
              statusBox.style.background = "rgba(16, 185, 129, 0.15)";
              statusBox.style.color = "#34d399";
              statusBox.style.border = "1px solid #059669";
              statusBox.innerHTML = "<strong>¡Registro exitoso!</strong> " + (data.message || "Revisá tu correo para confirmar tu suscripción.");
            } else {
              statusBox.style.display = "block";
              statusBox.style.background = "rgba(239, 68, 68, 0.15)";
              statusBox.style.color = "#f87171";
              statusBox.style.border = "1px solid #b91c1c";
              statusBox.innerText = data.error || "Ocurrió un error al procesar el registro.";
            }
          })
          .catch(function () {
            submitBtn.disabled = false;
            submitBtn.innerText = "Registrarme en la Comunidad";
            statusBox.style.display = "block";
            statusBox.style.background = "rgba(239, 68, 68, 0.15)";
            statusBox.style.color = "#f87171";
            statusBox.innerText = "Error de conexión con el servidor.";
          });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
