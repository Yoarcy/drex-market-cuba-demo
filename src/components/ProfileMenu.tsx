"use client";

import { useState } from "react";

type ViewMode = "menu" | "login" | "register" | "profile";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("menu");
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Cliente",
    lastName: "Demo",
    whatsapp: "+53 5000 0000",
    email: "cliente@demo.local",
    photo: "",
  });

  const displayName = `${profile.firstName} ${profile.lastName}`.trim();

  function openPanel(nextView: ViewMode = loggedIn ? "profile" : "menu") {
    setView(nextView);
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
  }

  function login() {
    setLoggedIn(true);
    setView("profile");
  }

  function register() {
    setLoggedIn(true);
    setView("profile");
  }

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfile((current) => ({ ...current, photo: URL.createObjectURL(file) }));
  }

  return (
    <>
      <button
        type="button"
        className="header-icon-link profile-trigger"
        aria-label="Perfil"
        data-tooltip="Perfil"
        onClick={() => openPanel()}
      >
        {loggedIn && profile.photo ? <img src={profile.photo} alt="Perfil" className="profile-trigger-photo" /> : <img src="/icons/18_user_login.png" alt="Perfil" />}
      </button>

      <div className={`profile-popover-layer ${open ? "open" : ""}`} aria-hidden={!open}>
        <button type="button" className="profile-popover-backdrop" aria-label="Cerrar perfil" onClick={closePanel} />
        <section className="profile-popover" role="dialog" aria-modal="true" aria-label="Perfil de usuario">
          <button type="button" className="profile-popover-close" aria-label="Cerrar" onClick={closePanel}>×</button>

          {view === "menu" && !loggedIn && (
            <div className="profile-menu-view">
              <div className="profile-menu-icon"><img src="/icons/18_user_login.png" alt="" /></div>
              <h2>Tu perfil</h2>
              <p>Inicia sesión para comprar, usar el carrito, elegir destino y guardar tus datos.</p>
              <button type="button" className="btn-primary profile-full-button" onClick={() => setView("login")}>Iniciar sesión</button>
              <p className="profile-hot-question">¿No tienes cuenta? <button type="button" onClick={() => setView("register")}>Créala aquí</button></p>
            </div>
          )}

          {view === "login" && (
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); login(); }}>
              <h2>Iniciar sesión</h2>
              <label>Correo o usuario<input name="username" autoComplete="username" placeholder="cliente@demo.local" required /></label>
              <label>Contraseña<input name="password" type="password" autoComplete="current-password" placeholder="••••••••" required /></label>
              <button type="submit" className="btn-primary profile-full-button">Entrar</button>
              <p className="profile-hot-question">¿No tienes cuenta? <button type="button" onClick={() => setView("register")}>Créala aquí</button></p>
            </form>
          )}

          {view === "register" && (
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); register(); }}>
              <h2>Crear cuenta</h2>
              <div className="profile-two-cols">
                <label>Nombre<input autoComplete="given-name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required /></label>
                <label>Apellidos<input autoComplete="family-name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required /></label>
              </div>
              <label>Número de WhatsApp<input autoComplete="tel" value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} required /></label>
              <label>Correo<input type="email" autoComplete="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required /></label>
              <label>Foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} /></label>
              <button type="submit" className="btn-primary profile-full-button">Registrarse</button>
              <button type="button" className="profile-secondary-button" onClick={() => { closePanel(); window.location.href = "/"; }}>Volver al inicio</button>
            </form>
          )}

          {view === "profile" && loggedIn && (
            <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
              <div className="profile-user-head">
                <div className="profile-user-photo">{profile.photo ? <img src={profile.photo} alt={displayName} /> : "👤"}</div>
                <div><h2>{displayName}</h2><p>{profile.email}</p></div>
              </div>
              <div className="profile-two-cols">
                <label>Nombre<input value={profile.firstName} disabled /></label>
                <label>Apellidos<input value={profile.lastName} disabled /></label>
              </div>
              <label>Número de WhatsApp<input autoComplete="tel" value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} /></label>
              <label>Correo<input type="email" autoComplete="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
              <label>Cambiar foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} /></label>
              <button type="button" className="btn-primary profile-full-button" onClick={closePanel}>Guardar cambios</button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}
