"use client";

import { useState } from "react";

const availableMunicipalities = new Set(["Bauta"]);

const municipalitiesByProvince: Record<string, string[]> = {
  "Pinar del Río": ["Pinar del Río", "Consolación del Sur", "Guane", "La Palma", "Los Palacios", "Mantua", "Minas de Matahambre", "San Juan y Martínez", "San Luis", "Sandino", "Viñales"],
  "Artemisa": ["Artemisa", "Alquízar", "Bahía Honda", "Bauta", "Caimito", "Candelaria", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "San Cristóbal"],
  "La Habana": ["Arroyo Naranjo", "Boyeros", "Centro Habana", "Cerro", "Cotorro", "Diez de Octubre", "Guanabacoa", "Habana del Este", "Habana Vieja", "La Lisa", "Marianao", "Playa", "Plaza de la Revolución", "Regla", "San Miguel del Padrón"],
  "Mayabeque": ["Batabanó", "Bejucal", "Güines", "Jaruco", "Madruga", "Melena del Sur", "Nueva Paz", "Quivicán", "San José de las Lajas", "San Nicolás", "Santa Cruz del Norte"],
  "Matanzas": ["Matanzas", "Calimete", "Cárdenas", "Ciénaga de Zapata", "Colón", "Jagüey Grande", "Jovellanos", "Limonar", "Los Arabos", "Martí", "Pedro Betancourt", "Perico", "Unión de Reyes"],
  "Cienfuegos": ["Cienfuegos", "Abreus", "Aguada de Pasajeros", "Cruces", "Cumanayagua", "Lajas", "Palmira", "Rodas"],
  "Villa Clara": ["Santa Clara", "Caibarién", "Camajuaní", "Cifuentes", "Corralillo", "Encrucijada", "Manicaragua", "Placetas", "Quemado de Güines", "Ranchuelo", "Remedios", "Sagua la Grande", "Santo Domingo"],
  "Sancti Spíritus": ["Sancti Spíritus", "Cabaiguán", "Fomento", "Jatibonico", "La Sierpe", "Taguasco", "Trinidad", "Yaguajay"],
  "Ciego de Ávila": ["Ciego de Ávila", "Baraguá", "Bolivia", "Chambas", "Ciro Redondo", "Florencia", "Majagua", "Morón", "Primero de Enero", "Venezuela"],
  "Camagüey": ["Camagüey", "Carlos Manuel de Céspedes", "Esmeralda", "Florida", "Guáimaro", "Jimaguayú", "Minas", "Najasa", "Nuevitas", "Santa Cruz del Sur", "Sibanicú", "Sierra de Cubitas", "Vertientes"],
  "Las Tunas": ["Las Tunas", "Amancio", "Colombia", "Jesús Menéndez", "Jobabo", "Majibacoa", "Manatí", "Puerto Padre"],
  "Holguín": ["Holguín", "Antilla", "Báguanos", "Banes", "Cacocum", "Calixto García", "Cueto", "Frank País", "Gibara", "Mayarí", "Moa", "Rafael Freyre", "Sagua de Tánamo", "Urbano Noris"],
  "Granma": ["Bayamo", "Bartolomé Masó", "Buey Arriba", "Campechuela", "Cauto Cristo", "Guisa", "Jiguaní", "Manzanillo", "Media Luna", "Niquero", "Pilón", "Río Cauto", "Yara"],
  "Santiago de Cuba": ["Santiago de Cuba", "Contramaestre", "Guamá", "Mella", "Palma Soriano", "San Luis", "Segundo Frente", "Songo-La Maya", "Tercer Frente"],
  "Guantánamo": ["Guantánamo", "Baracoa", "Caimanera", "El Salvador", "Imías", "Maisí", "Manuel Tames", "Niceto Pérez", "San Antonio del Sur", "Yateras"],
  "Isla de la Juventud": ["Isla de la Juventud"],
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
        <img src="/assets/icons/06_ubicacion.png" alt="Ubicación" />
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
                <option value="Pinar del Río">Pinar del Río</option>
                <option value="Artemisa">Artemisa</option>
                <option value="La Habana">La Habana</option>
                <option value="Mayabeque">Mayabeque</option>
                <option value="Matanzas">Matanzas</option>
                <option value="Cienfuegos">Cienfuegos</option>
                <option value="Villa Clara">Villa Clara</option>
                <option value="Sancti Spíritus">Sancti Spíritus</option>
                <option value="Ciego de Ávila">Ciego de Ávila</option>
                <option value="Camagüey">Camagüey</option>
                <option value="Las Tunas">Las Tunas</option>
                <option value="Holguín">Holguín</option>
                <option value="Granma">Granma</option>
                <option value="Santiago de Cuba">Santiago de Cuba</option>
                <option value="Guantánamo">Guantánamo</option>
                <option value="Isla de la Juventud">Isla de la Juventud</option>
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
