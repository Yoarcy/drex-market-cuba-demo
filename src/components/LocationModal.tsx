"use client";

import { useState } from "react";

const availableMunicipalities = new Set(["Bauta"]);

const municipalitiesByProvince: Record<string, string[]> = {
  Artemisa: ["Bauta", "Artemisa", "Guanajay", "Caimito", "Bahía Honda", "San Cristóbal"],
  "La Habana": ["Playa", "Plaza de la Revolución", "Centro Habana", "Habana Vieja", "Diez de Octubre", "Boyeros"],
  Mayabeque: ["San José de las Lajas", "Güines", "Santa Cruz del Norte", "Madruga", "Jaruco", "Bejucal"],
};

export function LocationModal() {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Destino");
  const [invalidProvince, setInvalidProvince] = useState(false);
  const [invalidMunicipality, setInvalidMunicipality] = useState(false);

  function flashProvince() {
    setInvalidProvince(true);
    window.setTimeout(() => setInvalidProvince(false), 400);
  }

  function flashMunicipality() {
    setInvalidMunicipality(true);
    window.setTimeout(() => setInvalidMunicipality(false), 400);
  }

  function acceptLocation() {
    if (!province) {
      flashProvince();
      return;
    }
    if (!municipality) {
      flashMunicipality();
      return;
    }
    if (!availableMunicipalities.has(municipality)) {
      setAlertOpen(true);
      return;
    }
    setSelectedLabel("Destino");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="header-icon-link"
        aria-label={`Destino: ${selectedLabel}`}
        data-tooltip={selectedLabel}
        onClick={() => setOpen(true)}
      >
        <img src="/icons/06_ubicacion.png" alt="Ubicación" />
      </button>

      <div className={`location-modal ${open ? "open" : ""}`} aria-hidden={!open}>
        <button type="button" className="location-modal-backdrop" aria-label="Cerrar" onClick={() => setOpen(false)} />
        <section className="location-modal-card" role="dialog" aria-modal="true" aria-labelledby="locationTitle">
          <button type="button" className="location-close" aria-label="Cerrar" onClick={() => setOpen(false)}>×</button>
          <span className="badge-demo">Destino del pedido</span>
          <h2 id="locationTitle" className="mt-3 text-2xl font-black text-slate-950">¿Hacia dónde va la compra?</h2>
          <p className="mt-2 text-slate-600">Selecciona provincia y municipio del beneficiario. La tienda usará esta ubicación para mostrar productos disponibles en esa zona.</p>
          <div className="location-form">
            <label>
              Provincia
              <select
                className={invalidProvince ? "invalid" : ""}
                value={province}
                onChange={(event) => {
                  setProvince(event.target.value);
                  setMunicipality("");
                }}
              >
                <option value="">Selecciona provincia</option>
                <option value="Artemisa">Artemisa</option>
                <option value="La Habana">La Habana</option>
                <option value="Mayabeque">Mayabeque</option>
              </select>
            </label>
            <label>
              Municipio
              <select className={invalidMunicipality ? "invalid" : ""} value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
                <option value="">Selecciona municipio</option>
                {(municipalitiesByProvince[province] ?? []).map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className="btn-primary location-accept" onClick={acceptLocation}>Aceptar</button>
        </section>
      </div>

      <div className={`location-alert ${alertOpen ? "open" : ""}`} aria-hidden={!alertOpen}>
        <button type="button" className="location-modal-backdrop" aria-label="Cerrar aviso" onClick={() => setAlertOpen(false)} />
        <section className="location-alert-card" role="alertdialog" aria-modal="true" aria-labelledby="locationAlertTitle">
          <h2 id="locationAlertTitle">Municipio no disponible todavía</h2>
          <p>Disculpa, todavía estamos trabajando para llegar a ese municipio. Por favor selecciona otro municipio disponible.</p>
          <button type="button" className="btn-primary location-accept" onClick={() => setAlertOpen(false)}>Aceptar</button>
        </section>
      </div>
    </>
  );
}
