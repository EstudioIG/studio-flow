import { useState } from "react";

const STATUS_FLOW = [
  { key: "lead", label: "Lead", color: "#6B7FD7", bg: "#EEF0FD", icon: "✦" },
  { key: "agendado", label: "Ensaio Agendado", color: "#E09B3D", bg: "#FDF5E8", icon: "📅" },
  { key: "ensaio_feito", label: "Ensaio Realizado", color: "#5BA4CF", bg: "#EAF4FB", icon: "📷" },
  { key: "em_edicao", label: "Em Edição", color: "#C96FBF", bg: "#FAF0FA", icon: "✏️" },
  { key: "editado", label: "Editado — Aguard. Envio", color: "#E05C5C", bg: "#FDF0F0", icon: "⚡" },
  { key: "enviado", label: "Fotos Enviadas", color: "#3DAE7B", bg: "#EBF8F3", icon: "📤" },
  { key: "pos_venda", label: "Pós-venda", color: "#8B7EC8", bg: "#F3F1FC", icon: "💬" },
  { key: "concluido", label: "Concluído", color: "#4A7C59", bg: "#EEF6F1", icon: "✅" },
];

const DEFAULT_TEAM = ["Ana", "Bruno", "Carla", "Diego", "Elas"];
const DEFAULT_PRAZO = 3;

const initialClients = [
  { id: 1, name: "Mariana Costa", phone: "(11) 98765-4321", status: "em_edicao", responsavel: "Ana", createdAt: "2025-06-10", ensaioDate: "2025-06-12", editadoAt: null, enviadoAt: null, notes: "Ensaio família. Urgente.", editor: "Bruno" },
  { id: 2, name: "Fernanda Lima", phone: "(11) 91234-5678", status: "editado", responsavel: "Carla", createdAt: "2025-06-08", ensaioDate: "2025-06-10", editadoAt: "2025-06-18", enviadoAt: null, notes: "Ensaio gestante.", editor: "Diego" },
  { id: 3, name: "Rafael Souza", phone: "(11) 94567-8901", status: "enviado", responsavel: "Ana", createdAt: "2025-06-05", ensaioDate: "2025-06-07", editadoAt: "2025-06-14", enviadoAt: "2025-06-16", notes: "Ensaio corporativo.", editor: "Ana" },
  { id: 4, name: "Juliana Pereira", phone: "(11) 99876-5432", status: "agendado", responsavel: "Bruno", createdAt: "2025-06-19", ensaioDate: "2025-06-25", editadoAt: null, enviadoAt: null, notes: "Ensaio de 15 anos.", editor: "" },
  { id: 5, name: "Carlos Mendes", phone: "(11) 92345-6789", status: "lead", responsavel: "Carla", createdAt: "2025-06-21", ensaioDate: null, editadoAt: null, enviadoAt: null, notes: "Interessado em ensaio casal.", editor: "" },
  { id: 6, name: "Beatriz Alves", phone: "(11) 97654-3210", status: "concluido", responsavel: "Diego", createdAt: "2025-05-20", ensaioDate: "2025-05-25", editadoAt: "2025-06-01", enviadoAt: "2025-06-03", notes: "Adorou as fotos!", editor: "Carla" },
];

function daysDiff(dateStr) {
  if (!dateStr) return null;
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

const inputStyle = { width: "100%", border: "2px solid #E8E7EF", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" };
const labelStyle = { fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 4, textTransform: "uppercase", display: "block" };

export default function StudioManager() {
  const [clients, setClients] = useState(initialClients);
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM);
  const [prazoEnvio, setPrazoEnvio] = useState(DEFAULT_PRAZO);
  const [studioName, setStudioName] = useState("Meu Estúdio");
  const [view, setView] = useState("kanban");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterResp, setFilterResp] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", status: "lead", responsavel: "", ensaioDate: "", notes: "", editor: "" });

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ studioName, prazoEnvio, teamMembers: [...teamMembers] });
  const [newMember, setNewMember] = useState("");

  const alertas = clients.filter(c => c.status === "editado" && c.editadoAt && daysDiff(c.editadoAt) >= prazoEnvio);

  function openSettings() {
    setSettingsForm({ studioName, prazoEnvio, teamMembers: [...teamMembers] });
    setNewMember("");
    setShowSettings(true);
  }

  function saveSettings() {
    if (!settingsForm.studioName.trim()) return;
    if (settingsForm.prazoEnvio < 1) return;
    setStudioName(settingsForm.studioName);
    setPrazoEnvio(Number(settingsForm.prazoEnvio));
    setTeamMembers(settingsForm.teamMembers.filter(m => m.trim()));
    setShowSettings(false);
  }

  function addMember() {
    const name = newMember.trim();
    if (!name || settingsForm.teamMembers.includes(name)) return;
    setSettingsForm(f => ({ ...f, teamMembers: [...f.teamMembers, name] }));
    setNewMember("");
  }

  function removeMember(name) {
    setSettingsForm(f => ({ ...f, teamMembers: f.teamMembers.filter(m => m !== name) }));
  }

  function openNew() {
    setEditingClient(null);
    setForm({ name: "", phone: "", status: "lead", responsavel: "", ensaioDate: "", notes: "", editor: "" });
    setShowModal(true);
  }

  function openEdit(client) {
    setEditingClient(client);
    setForm({ ...client });
    setShowModal(true);
  }

  function saveClient() {
    if (!form.name.trim()) return;
    if (editingClient) {
      setClients(cs => cs.map(c => c.id === editingClient.id ? { ...c, ...form } : c));
    } else {
      const now = new Date().toISOString().split("T")[0];
      setClients(cs => [...cs, { ...form, id: Date.now(), createdAt: now, editadoAt: null, enviadoAt: null }]);
    }
    setShowModal(false);
  }

  function advanceStatus(id) {
    setClients(cs => cs.map(c => {
      if (c.id !== id) return c;
      const idx = STATUS_FLOW.findIndex(s => s.key === c.status);
      if (idx >= STATUS_FLOW.length - 1) return c;
      const nextStatus = STATUS_FLOW[idx + 1].key;
      const now = new Date().toISOString().split("T")[0];
      return { ...c, status: nextStatus, editadoAt: nextStatus === "editado" ? now : c.editadoAt, enviadoAt: nextStatus === "enviado" ? now : c.enviadoAt };
    }));
  }

  function deleteClient(id) {
    if (confirm("Remover este cliente?")) { setClients(cs => cs.filter(c => c.id !== id)); setShowModal(false); }
  }

  const filtered = clients.filter(c => {
    const matchStatus = filterStatus === "todos" || c.status === filterStatus;
    const matchResp = filterResp === "todos" || c.responsavel === filterResp;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchResp && matchSearch;
  });

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#F7F6F9", minHeight: "100vh", color: "#1A1A2E" }}>

      {/* HEADER */}
      <div style={{ background: "#1A1A2E", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📸</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>Studio Flow</div>
            <div style={{ fontSize: 11, color: "#8B8BAA", marginTop: 1 }}>{studioName}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {alertas.length > 0 && (
            <button onClick={() => setView("alertas")} style={{ background: "#E05C5C", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ⚠ {alertas.length} alerta{alertas.length > 1 ? "s" : ""}
            </button>
          )}
          <button onClick={openSettings} style={{ background: "#2E2E4A", color: "#aaa", border: "1.5px solid #3E3E5A", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ⚙ Configurações
          </button>
          <button onClick={openNew} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ display: "flex", gap: 10, padding: "16px 28px", overflowX: "auto" }}>
        {STATUS_FLOW.map(s => (
          <div key={s.key} onClick={() => setFilterStatus(filterStatus === s.key ? "todos" : s.key)}
            style={{ background: filterStatus === s.key ? s.color : "#fff", color: filterStatus === s.key ? "#fff" : "#1A1A2E", border: `2px solid ${filterStatus === s.key ? s.color : "#E8E7EF"}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", minWidth: 110, textAlign: "center", transition: "all 0.15s" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{clients.filter(c => c.status === s.key).length}</div>
            <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2, opacity: 0.85, lineHeight: 1.2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div style={{ padding: "0 28px 14px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ border: "2px solid #E8E7EF", borderRadius: 8, padding: "7px 12px", fontSize: 13, outline: "none", minWidth: 180, background: "#fff" }} />
        <select value={filterResp} onChange={e => setFilterResp(e.target.value)} style={{ border: "2px solid #E8E7EF", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "#fff" }}>
          <option value="todos">Todos responsáveis</option>
          {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {["kanban", "lista"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#1A1A2E" : "#fff", color: view === v ? "#fff" : "#666", border: "2px solid #E8E7EF", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {v === "kanban" ? "⬛ Kanban" : "☰ Lista"}
            </button>
          ))}
        </div>
      </div>

      {/* ALERTAS VIEW */}
      {view === "alertas" && (
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#FDF0F0", border: "2px solid #E05C5C", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#E05C5C", marginBottom: 12 }}>⚠ Fotos editadas aguardando envio há mais de {prazoEnvio} dia{prazoEnvio > 1 ? "s" : ""}</div>
            {alertas.length === 0 && <div style={{ color: "#999", fontSize: 13 }}>Nenhum atraso no momento.</div>}
            {alertas.map(c => (
              <div key={c.id} style={{ background: "#fff", borderRadius: 10, padding: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f5c6c6" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Editado em {formatDate(c.editadoAt)} · Responsável: {c.responsavel}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ background: "#E05C5C", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>{daysDiff(c.editadoAt)}d</span>
                  <button onClick={() => advanceStatus(c.id)} style={{ background: "#3DAE7B", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Marcar Enviado</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setView("kanban")} style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13 }}>← Voltar ao Kanban</button>
        </div>
      )}

      {/* KANBAN VIEW */}
      {view === "kanban" && (
        <div style={{ padding: "0 28px 28px", display: "flex", gap: 12, overflowX: "auto", alignItems: "flex-start" }}>
          {STATUS_FLOW.map(s => {
            const cols = filtered.filter(c => c.status === s.key);
            return (
              <div key={s.key} style={{ minWidth: 230, maxWidth: 250, flex: "0 0 auto" }}>
                <div style={{ background: s.bg, border: `2px solid ${s.color}22`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: s.color, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{s.icon} {s.label}</span>
                    <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 12, fontWeight: 700 }}>{cols.length}</span>
                  </div>
                  <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8, minHeight: 60 }}>
                    {cols.length === 0 && <div style={{ color: "#bbb", fontSize: 12, textAlign: "center", padding: "12px 0" }}>Nenhum cliente</div>}
                    {cols.map(c => <ClientCard key={c.id} client={c} statusInfo={s} prazo={prazoEnvio} onEdit={openEdit} onAdvance={advanceStatus} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LISTA VIEW */}
      {view === "lista" && (
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #E8E7EF", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F7F6F9" }}>
                  {["Cliente", "Telefone", "Status", "Responsável", "Ensaio", "Editado em", "Enviado em", "Dias editado", "Ações"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#666", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "2px solid #E8E7EF", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const s = STATUS_FLOW.find(x => x.key === c.status);
                  const diasEd = c.status === "editado" ? daysDiff(c.editadoAt) : null;
                  const atrasado = diasEd !== null && diasEd >= prazoEnvio;
                  return (
                    <tr key={c.id} style={{ background: atrasado ? "#FFF5F5" : i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F0EFF5" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{c.name}</td>
                      <td style={{ padding: "10px 14px", color: "#666", whiteSpace: "nowrap" }}>{c.phone}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: s.bg, color: s.color, border: `1.5px solid ${s.color}44`, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{c.responsavel || "—"}</td>
                      <td style={{ padding: "10px 14px", color: "#555", whiteSpace: "nowrap" }}>{formatDate(c.ensaioDate)}</td>
                      <td style={{ padding: "10px 14px", color: "#555", whiteSpace: "nowrap" }}>{formatDate(c.editadoAt)}</td>
                      <td style={{ padding: "10px 14px", color: "#555", whiteSpace: "nowrap" }}>{formatDate(c.enviadoAt)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        {atrasado ? <span style={{ color: "#E05C5C", fontWeight: 700 }}>⚠ {diasEd}d</span> : diasEd !== null ? <span style={{ color: "#E09B3D" }}>{diasEd}d</span> : "—"}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(c)} style={{ background: "#EEF0FD", color: "#6B7FD7", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Editar</button>
                          {c.status !== "concluido" && <button onClick={() => advanceStatus(c.id)} style={{ background: "#EBF8F3", color: "#3DAE7B", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Avançar</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CLIENTE */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 20, color: "#1A1A2E" }}>{editingClient ? "Editar Cliente" : "Novo Cliente"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Nome completo", "name"], ["Telefone", "phone"]].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                    {STATUS_FLOW.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Responsável</label>
                  <select value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} style={inputStyle}>
                    <option value="">Selecionar</option>
                    {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Data do Ensaio</label>
                  <input type="date" value={form.ensaioDate || ""} onChange={e => setForm(f => ({ ...f, ensaioDate: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Editor</label>
                  <select value={form.editor || ""} onChange={e => setForm(f => ({ ...f, editor: e.target.value }))} style={inputStyle}>
                    <option value="">Selecionar</option>
                    {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Observações</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              {editingClient && (
                <button onClick={() => deleteClient(editingClient.id)} style={{ background: "#FDF0F0", color: "#E05C5C", border: "2px solid #f5c6c6", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Excluir</button>
              )}
              <button onClick={() => setShowModal(false)} style={{ background: "#F7F6F9", color: "#666", border: "2px solid #E8E7EF", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button onClick={saveClient} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÕES */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }}>
            
            {/* Header da modal */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "#1A1A2E" }}>Configurações</div>
                <div style={{ fontSize: 12, color: "#999" }}>Personalize o sistema do seu estúdio</div>
              </div>
            </div>

            {/* Seção: Nome do estúdio */}
            <div style={{ background: "#F7F6F9", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7FD7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>🏠 Estúdio</div>
              <label style={labelStyle}>Nome do Estúdio</label>
              <input value={settingsForm.studioName} onChange={e => setSettingsForm(f => ({ ...f, studioName: e.target.value }))} placeholder="Ex: Studio Luz & Sombra" style={inputStyle} />
            </div>

            {/* Seção: Prazo de envio */}
            <div style={{ background: "#FDF5E8", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E09B3D", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>⏱ Prazo de Entrega</div>
              <label style={labelStyle}>Prazo máximo para enviar fotos ao cliente após edição</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="number" min="1" max="30"
                  value={settingsForm.prazoEnvio}
                  onChange={e => setSettingsForm(f => ({ ...f, prazoEnvio: e.target.value }))}
                  style={{ ...inputStyle, width: 80, textAlign: "center", fontSize: 20, fontWeight: 700 }}
                />
                <div style={{ fontSize: 14, color: "#666" }}>
                  dia{settingsForm.prazoEnvio > 1 ? "s" : ""} após a edição ser concluída
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#E09B3D", marginTop: 8, background: "#FFF3E0", borderRadius: 6, padding: "6px 10px" }}>
                ⚠ Se as fotos ficarem mais de {settingsForm.prazoEnvio} dia{settingsForm.prazoEnvio > 1 ? "s" : ""} sem envio, um alerta será gerado automaticamente.
              </div>
            </div>

            {/* Seção: Equipe */}
            <div style={{ background: "#EEF0FD", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7FD7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>👥 Equipe</div>
              <label style={labelStyle}>Integrantes da equipe</label>
              
              {/* Lista de membros */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {settingsForm.teamMembers.length === 0 && (
                  <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic", padding: "8px 0" }}>Nenhum integrante cadastrado.</div>
                )}
                {settingsForm.teamMembers.map(m => (
                  <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 8, padding: "8px 12px", border: "1.5px solid #D8DCFA" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        {m[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{m}</span>
                    </div>
                    <button onClick={() => removeMember(m)} style={{ background: "#FDF0F0", color: "#E05C5C", border: "1.5px solid #f5c6c6", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              {/* Adicionar membro */}
              <label style={labelStyle}>Adicionar integrante</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newMember}
                  onChange={e => setNewMember(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addMember()}
                  placeholder="Nome do integrante"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={addMember} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  + Adicionar
                </button>
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowSettings(false)} style={{ background: "#F7F6F9", color: "#666", border: "2px solid #E8E7EF", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={saveSettings} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ✓ Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientCard({ client, statusInfo, prazo, onEdit, onAdvance }) {
  const nextStatus = STATUS_FLOW[STATUS_FLOW.findIndex(s => s.key === client.status) + 1];
  const diasEdicao = client.status === "editado" ? daysDiff(client.editadoAt) : null;
  const atrasado = diasEdicao !== null && diasEdicao >= prazo;

  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: atrasado ? "2px solid #E05C5C" : "1.5px solid #E8E7EF", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {atrasado && <div style={{ background: "#E05C5C", color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, marginBottom: 6, display: "inline-block" }}>⚠ ATRASADO {diasEdicao}d</div>}
      <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A2E", marginBottom: 2 }}>{client.name}</div>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>{client.phone}</div>
      {client.responsavel && <div style={{ fontSize: 11, color: "#6B7FD7", fontWeight: 600, marginBottom: 2 }}>👤 {client.responsavel}</div>}
      {client.editor && <div style={{ fontSize: 11, color: "#C96FBF", fontWeight: 600, marginBottom: 2 }}>✏️ Editor: {client.editor}</div>}
      {client.ensaioDate && <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>📅 {formatDate(client.ensaioDate)}</div>}
      {client.notes && <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, fontStyle: "italic", lineHeight: 1.3 }}>{client.notes}</div>}
      <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
        <button onClick={() => onEdit(client)} style={{ flex: 1, background: "#F7F6F9", color: "#555", border: "1.5px solid #E8E7EF", borderRadius: 6, padding: "4px 0", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Editar</button>
        {nextStatus && (
          <button onClick={() => onAdvance(client.id)} style={{ flex: 2, background: statusInfo.color, color: "#fff", border: "none", borderRadius: 6, padding: "4px 0", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
            → {nextStatus.label}
          </button>
        )}
      </div>
    </div>
  );
}
