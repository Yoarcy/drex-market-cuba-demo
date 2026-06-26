"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ViewMode = "menu" | "login" | "register" | "recover" | "profile";

const avatarOptions = Array.from({ length: 10 }, (_, index) => `/assets/avatares/avatar-${String(index + 1).padStart(2, "0")}.png`);

export function ProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("menu");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    whatsapp: "",
    email: "",
    photo: "",
  });

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || "Cliente DREX";

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
    closePanel();
    router.push("/");
  }

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfile((current) => ({ ...current, photo: URL.createObjectURL(file) }));
    setPhotoPickerOpen(false);
    event.target.value = "";
  }

  function selectAvatar(src: string) {
    setProfile((current) => ({ ...current, photo: src }));
    setPhotoPickerOpen(false);
  }

  function openFileSelector() {
    fileInputRef.current?.click();
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
        {loggedIn && profile.photo ? <img src={profile.photo} alt="Perfil" className="profile-trigger-photo" /> : <img src="/assets/icons/18_user_login.png" alt="Perfil" />}
      </button>

      <div className={`profile-popover-layer ${open ? "open" : ""}`} aria-hidden={!open}>
        <button type="button" className="profile-popover-backdrop" aria-label="Cerrar perfil" onClick={closePanel} />
        <section className="profile-popover" role="dialog" aria-modal="true" aria-label="Perfil de usuario">
          <button type="button" className="profile-popover-close" aria-label="Cerrar" onClick={closePanel}>×</button>

          {view === "menu" && !loggedIn && (
            <div className="profile-menu-view">
              <div className="profile-menu-icon"><img src="/assets/icons/18_user_login.png" alt="" /></div>
              <h2>Tu perfil</h2>
              <p>Inicia sesión para comprar, usar el carrito, elegir destino y guardar tus datos.</p>
              <button type="button" className="btn-primary profile-full-button" onClick={() => setView("login")}>Iniciar sesión</button>
              <p className="profile-hot-question">¿No tienes cuenta? <button type="button" onClick={() => setView("register")}>Créala aquí</button></p>
            </div>
          )}

          {view === "login" && (
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); login(); }}>
              <h2>Iniciar sesión</h2>
              <label>Correo o usuario<input name="username" autoComplete="username" placeholder="cliente@demo.local" value={loginData.username} onChange={(event) => setLoginData((current) => ({ ...current, username: event.target.value }))} required /></label>
              <label>Contraseña
                <span className="password-input-wrap">
                  <input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" value={loginData.password} onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))} required />
                  <button type="button" className="password-eye-button" aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"} onMouseDown={(event) => event.preventDefault()} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setShowPassword((value) => !value); }}>{showPassword ? "🙈" : "👁️"}</button>
                </span>
              </label>
              <button type="submit" className="btn-primary profile-full-button">Entrar</button>
              <button type="button" className="forgot-password-link" onClick={() => setView("recover")}>¿Olvidaste la contraseña?</button>
              <p className="profile-hot-question">¿No tienes cuenta? <button type="button" onClick={() => setView("register")}>Créala aquí</button></p>
            </form>
          )}


          {view === "recover" && (
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); setView("login"); }}>
              <h2>Recuperar contraseña</h2>
              <p>Escribe tu correo y te enviaremos instrucciones para recuperar el acceso. En esta demo no se envían correos reales.</p>
              <label>Correo<input type="email" autoComplete="email" placeholder="cliente@demo.local" required /></label>
              <button type="submit" className="btn-primary profile-full-button">Enviar recuperación</button>
              <button type="button" className="profile-secondary-button" onClick={() => setView("login")}>Volver al login</button>
            </form>
          )}

          {view === "register" && (
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); register(); }}>
              <h2>Crear cuenta</h2>
              <div className="profile-register-layout">
                <div className="profile-register-left">
                  <label>Nombre<input autoComplete="given-name" placeholder="Nombre" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required /></label>
                  <label>Apellidos<input autoComplete="family-name" placeholder="Apellidos" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required /></label>
                  <label>WhatsApp<input autoComplete="tel" placeholder="+53 5000 0000" value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} required /></label>
                </div>
                <button type="button" className="profile-photo-box" onClick={() => setPhotoPickerOpen(true)}>
                  {profile.photo ? <img src={profile.photo} alt="Foto del usuario" /> : <span>imagen</span>}
                </button>
              </div>
              <label>Correo<input type="email" autoComplete="email" placeholder="cliente@correo.com" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required /></label>
              <button type="submit" className="btn-primary profile-full-button">Registrarse</button>
              <button type="button" className="profile-secondary-button" onClick={() => { closePanel(); router.push("/"); }}>Volver al inicio</button>
            </form>
          )}

          {view === "profile" && loggedIn && (
            <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
              <div className="profile-user-head">
                <div className="profile-user-photo">{profile.photo ? <img src={profile.photo} alt={displayName} /> : "👤"}</div>
                <div><h2>{displayName}</h2><p>{profile.email || "correo pendiente"}</p></div>
              </div>
              <div className="profile-two-cols">
                <label>Nombre<input value={profile.firstName} disabled /></label>
                <label>Apellidos<input value={profile.lastName} disabled /></label>
              </div>
              <label>Número de WhatsApp<input autoComplete="tel" value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} /></label>
              <label>Correo<input type="email" autoComplete="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
              <button type="button" className="profile-photo-box profile-photo-box-wide" onClick={() => setPhotoPickerOpen(true)}>
                {profile.photo ? <img src={profile.photo} alt="Foto del usuario" /> : <span>Cambiar foto</span>}
              </button>
              <button type="button" className="btn-primary profile-full-button" onClick={closePanel}>Guardar cambios</button>
            </form>
          )}

          <input ref={fileInputRef} className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} />
          {photoPickerOpen && (
            <div className="avatar-picker-layer">
              <div className="avatar-picker-card">
                <button type="button" className="avatar-picker-close" aria-label="Cerrar selector de imagen" onClick={() => setPhotoPickerOpen(false)}>×</button>
                <h3>Foto de perfil</h3>
                <p>Escoge un avatar DREX o sube una imagen desde tu equipo.</p>
                <div className="avatar-picker-actions">
                  <button type="button" className="profile-secondary-button" onClick={openFileSelector}>Imagen de archivo</button>
                </div>
                <div className="avatar-grid">
                  {avatarOptions.map((avatar) => (
                    <button type="button" key={avatar} className="avatar-option" onClick={() => selectAvatar(avatar)}>
                      <img src={avatar} alt="Avatar DREX" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
