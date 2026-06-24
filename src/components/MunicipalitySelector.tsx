"use client";

import { useState } from "react";
import Link from "next/link";
import { municipalities } from "@/lib/demo-data";

export function MunicipalitySelector() {
  const [message, setMessage] = useState("");

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Cobertura demo</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Provincia Artemisa</h2>
          <p className="mt-1 text-slate-600">Todos los municipios están visibles. Solo Bauta está activo en este MVP.</p>
        </div>
        <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">Demo sin pagos reales</span>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-medium text-orange-800">
          {message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {municipalities.map((municipality) =>
          municipality.available ? (
            <Link
              key={municipality.name}
              href="/catalogo"
              className="group rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-950">{municipality.name}</h3>
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">Disponible</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Entrar al catálogo local de Bauta.</p>
            </Link>
          ) : (
            <button
              key={municipality.name}
              onClick={() => setMessage("Servicio no disponible aún en este municipio. Estamos trabajando para llegar pronto.")}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-700">{municipality.name}</h3>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">Próximamente</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Municipio preparado para activarse después.</p>
            </button>
          ),
        )}
      </div>
    </section>
  );
}
