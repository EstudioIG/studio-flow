import { useState } from "react";

const FLUXO_DE_STATUS = [
  { chave: "liderar", rotulo: "Liderar", cor: "#6B7FD7", bg: "#EEF0FD", icone: "+" },
  { chave: "agenda", rotulo: "Ensaio Agendado", cor: "#E09B3D", bg: "#FDF5E8", icone: "📅" },
  { chave: "ensaio_feito", rotulo: "Ensaio Realizado", cor: "#5BA4CF", bg: "#EAF4FB", icone: "📷" },
  { chave: "em_edicao", rotulo: "Em Edição", cor: "#C96FBF", bg: "#FAF0FA", icone: "✏️" },
  { chave: "editado", rotulo: "Editado – Aguard. Envio", cor: "#E05C5C", bg: "#FDF0F0", icone: "⚡" },
  { chave: "enviado", rotulo: "Fotos Enviadas", cor: "#3DAE7B", bg: "#EBF8F3", icone: "📤" },
  { chave: "pos_venda", rotulo: "Pós-venda", cor: "#8B7EC8", bg: "#F3F1FC", icone: "💬" },
  { chave: "concluido", rotulo: "Concluído", cor: "#4A7C59", bg: "#EEF6F1", icone: "✅" },
];

const EQUIPE_PADRAO = ["Ana", "Bruno", "Carla", "Diego", "Elas"];
const DEFAULT_PRAZO = 3;

const clientes_iniciais = [
  { id: 1, nome: "Mariana Costa", telefone: "(11) 98765-4321", status: "em_edicao", responsavel: "Ana", criadoEm: "2025-06-10", Data: "2025-06-01", notas: "", editor: "" },
  { id: 2, nome: "Fernanda Lima", telefone: "(11) 91234-5678", status: "editado", responsavel: "Carla", criadoEm: "2025-06-08", Data: "2025-06-05", notas: "", editor: "", editadoEm: "2025-06-10" },
  { id: 3, nome: "Rafael Souza", telefone: "(11) 94567-8901", status: "enviado", responsavel: "Ana", criadoEm: "2025-06-05", Data: "2025-06-03", notas: "", editor: "" },
  { id: 4, nome: "Juliana Pereira", telefone: "(11) 99876-5432", status: "agenda", responsavel: "Bruno", criadoEm: "2025-06-19", Data: "2025-06-25", notas: "", editor: "" },
  { id: 5, nome: "Carlos Mendes", telefone: "(11) 92345-6789", status: "liderar", responsavel: "Carla", criadoEm: "2025-06-21", Data: null, notas: "", editor: "" },
  { id: 6, nome: "Beatriz Alves", telefone: "(11) 97654-3210", status: "concluido", responsavel: "Diego", criadoEm: "2025-05-20", Data: "2025-05-15", notas: "", editor: "" },
];

function diasDiferenca(dataStr) {
  if (!dataStr) return null;
  return Math.floor((new Date() - new Date(dataStr)) / (1000 * 60 * 60 * 24));
}

function formatarData(dataStr) {
  if (!dataStr) return "–";
  return new Date(dataStr).toLocaleDateString("pt-BR");
}

const estiloEntrada = {
  width: "100%",
  border: "2px solid #E8E7EF",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
};

const estiloEtiqueta = {
  fontSize: 11,
  fontWeight: 700,
  color: "#888",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

function CartaoCliente({ cliente, statusInfo, prazo, onEdit, onAdvance }) {
  const proximoStatus = FLUXO_DE_STATUS[FLUXO_DE_STATUS.findIndex((s) => s.chave === cliente.status) + 1];
  const diasEdicao = cliente.status === "editado" ? diasDiferenca(cliente.editadoEm) : null;
  const atrasado = diasEdicao !== null && diasEdicao >= prazo;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: "10px 12px",
      border: atrasado ? "2px solid #E05C5C" : "1.5px solid #E8E7EF",
      marginBottom: 8,
    }}>
      {atrasado && (
        <div style={{ background: "#E05C5C", color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, display: "inline-block", marginBottom: 4 }}>
          ⚠ {diasEdicao}d em edição
        </div>
      )}
      <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A2E", marginBottom: 2 }}>{cliente.nome}</div>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>{cliente.telefone}</div>
      {cliente.responsavel && <div style={{ fontSize: 11, color: "#6B7FD7", fontWeight: 600, marginBottom: 2 }}>👤 {cliente.responsavel}</div>}
      {cliente.editor && <div style={{ fontSize: 11, color: "#C96FBF", fontWeight: 600, marginBottom: 2 }}>✏️ Editor: {cliente.editor}</div>}
      {cliente.Data && <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>📅 {formatarData(cliente.Data)}</div>}
      {cliente.notas && <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic", lineHeight: 1.3, marginBottom: 4 }}>{cliente.notas}</div>}
      <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
        <button onClick={() => onEdit(cliente)} style={{ flex: 1, background: "#F7F6F9", color: "#555", border: "1.5px solid #E8E7EF", borderRadius: 6, padding: "4px 0", fontSize: 11, cursor: "pointer" }}>
          Editar
        </button>
        {proximoStatus && (
          <button onClick={() => onAdvance(cliente.id)} style={{ flex: 2, background: statusInfo.cor, color: "#fff", border: "none", borderRadius: 6, padding: "4px 0", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
            → {proximoStatus.rotulo}
          </button>
        )}
      </div>
    </div>
  );
}

export default function GerenciadorEstudio() {
  const [clientes, setClientes] = useState(clientes_iniciais);
  const [membros, setMembros] = useState(EQUIPE_PADRAO);
  const [prazoEnvio, setPrazoEnvio] = useState(DEFAULT_PRAZO);
  const [visualizar, setVisualizar] = useState("kanban");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroResp, setFiltroResp] = useState("todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEdicao, setClienteEdicao] = useState(null);
  const [procurar, setProcurar] = useState("");
  const [forma, setForma] = useState({ nome: "", telefone: "", status: "liderar", responsavel: "", Data: "", notas: "", editor: "" });
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);
  const [formConfig, setFormConfig] = useState({ nomeEstudio: "Meu Estúdio", prazoEnvio, membros: [...membros] });
  const [novoMembro, setNovoMembro] = useState("");
  const [nomeEstudio, setNomeEstudio] = useState("Meu Estúdio");

  const alertas = clientes.filter((c) => c.status === "editado" && c.editadoEm && diasDiferenca(c.editadoEm) >= prazoEnvio);

  function abrirConfiguracoes() {
    setFormConfig({ nomeEstudio, prazoEnvio, membros: [...membros] });
    setNovoMembro("");
    setMostrarConfiguracoes(true);
  }

  function salvarConfiguracoes() {
    if (!formConfig.nomeEstudio.trim()) return;
    if (formConfig.prazoEnvio < 1) return;
    setNomeEstudio(formConfig.nomeEstudio);
    setPrazoEnvio(Number(formConfig.prazoEnvio));
    setMembros(formConfig.membros.filter((m) => m.trim()));
    setMostrarConfiguracoes(false);
  }

  function adicionarMembro() {
    const nome = novoMembro.trim();
    if (!nome || formConfig.membros.includes(nome)) return;
    setFormConfig((f) => ({ ...f, membros: [...f.membros, nome] }));
    setNovoMembro("");
  }

  function removerMembro(nome) {
    setFormConfig((f) => ({ ...f, membros: f.membros.filter((m) => m !== nome) }));
  }

  function abrirNovo() {
    setClienteEdicao(null);
    setForma({ nome: "", telefone: "", status: "liderar", responsavel: "", Data: "", notas: "", editor: "" });
    setMostrarModal(true);
  }

  function abrirEditar(cliente) {
    setClienteEdicao(cliente);
    setForma({ ...cliente });
    setMostrarModal(true);
  }

  function salvarCliente() {
    if (!forma.nome.trim()) return;
    if (clienteEdicao) {
      setClientes((cs) => cs.map((c) => (c.id === clienteEdicao.id ? { ...c, ...forma } : c)));
    } else {
      const agora = new Date().toISOString().split("T")[0];
      setClientes((cs) => [...cs, { ...forma, id: Date.now(), criadoEm: agora, editadoEm: null, enviadoEm: null }]);
    }
    setMostrarModal(false);
  }

  function avancarStatus(id) {
    setClientes((cs) =>
      cs.map((c) => {
        if (c.id !== id) return c;
        const idx = FLUXO_DE_STATUS.findIndex((s) => s.chave === c.status);
        if (idx >= FLUXO_DE_STATUS.length - 1) return c;
        const proximoStatus = FLUXO_DE_STATUS[idx + 1].chave;
        const agora = new Date().toISOString().split("T")[0];
        return {
          ...c,
          status: proximoStatus,
          editadoEm: proximoStatus === "editado" ? agora : c.editadoEm,
          enviadoEm: proximoStatus === "enviado" ? agora : c.enviadoEm,
        };
      })
    );
  }

  function excluirCliente(id) {
    if (window.confirm("Remover este cliente?")) {
      setClientes((cs) => cs.filter((c) => c.id !== id));
      setMostrarModal(false);
    }
  }

  const filtrado = clientes.filter((c) => {
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus;
    const matchResp = filtroResp === "todos" || c.responsavel === filtroResp;
    const matchSearch = !procurar || c.nome.toLowerCase().includes(procurar.toLowerCase());
    return matchStatus && matchResp && matchSearch;
  });

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#F7F6F9", minHeight: "100vh", color: "#1A1A2E" }}>
      {/* CABEÇALHO */}
      <div style={{ background: "#1A1A2E", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>Fluxo de Estúdio</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#8B8BAA", marginTop: 1 }}>{nomeEstudio}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {alertas.length > 0 && (
            <button onClick={() => setVisualizar("alertas")} style={{ background: "#E05C5C", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>
              ⚠ {alertas.length} alerta{alertas.length > 1 ? "s" : ""}
            </button>
          )}
          <button onClick={abrirConfiguracoes} style={{ background: "#2E2E4A", color: "#aaa", border: "1.5px solid #3E3E5A", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
            ⚙ Configurações
          </button>
          <button onClick={abrirNovo} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* BARRA DE ESTATÍSTICAS */}
      <div style={{ display: "flex", gap: 10, padding: "16px 28px", overflowX: "auto" }}>
        {FLUXO_DE_STATUS.map((s) => (
          <div key={s.chave} onClick={() => setFiltroStatus(filtroStatus === s.chave ? "todos" : s.chave)} style={{ background: filtroStatus === s.chave ? s.cor : "#fff", color: filtroStatus === s.chave ? "#fff" : "#1A1A2E", border: `2px solid ${s.cor}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", minWidth: 90, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{clientes.filter((c) => c.status === s.chave).length}</div>
            <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2, opacity: 0.85, lineHeight: 1.2 }}>{s.rotulo}</div>
          </div>
        ))}
      </div>

      {/* BARRA DE FERRAMENTAS */}
      <div style={{ padding: "0 28px 14px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input value={procurar} onChange={(e) => setProcurar(e.target.value)} placeholder="Buscar cliente..." style={{ ...estiloEntrada, width: 200 }} />
        <select value={filtroResp} onChange={(e) => setFiltroResp(e.target.value)} style={{ ...estiloEntrada, width: 160 }}>
          <option value="todos">Todos responsáveis</option>
          {membros.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {["kanban", "lista"].map((v) => (
            <button key={v} onClick={() => setVisualizar(v)} style={{ background: visualizar === v ? "#1A1A2E" : "#fff", color: visualizar === v ? "#fff" : "#555", border: "1.5px solid #E8E7EF", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
              {v === "kanban" ? "⊞ Kanban" : "≡ Lista"}
            </button>
          ))}
        </div>
      </div>

      {/* VISUALIZAÇÃO DE ALERTAS */}
      {visualizar === "alertas" && (
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#FDF0F0", border: "2px solid #E05C5C", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#E05C5C", marginBottom: 12 }}>⚠ Fotos editadas aguardando envio</div>
            {alertas.length === 0 && <div style={{ color: "#999", fontSize: 13 }}>Nenhum atraso no momento.</div>}
            {alertas.map((c) => {
              const diasEd = diasDiferenca(c.editadoEm);
              return (
                <div key={c.id} style={{ background: "#fff", borderRadius: 10, padding: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.nome}</div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Editado em {formatarData(c.editadoEm)}. Responsável: {c.responsavel || "–"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ background: "#E05C5C", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
                      {diasEd}d
                    </span>
                    <button onClick={() => avancarStatus(c.id)} style={{ background: "#3DAE7B", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                      Marcar Enviado
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setVisualizar("kanban")} style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer" }}>
            ← Voltar ao Kanban
          </button>
        </div>
      )}

      {/* VISUALIZAÇÃO KANBAN */}
      {visualizar === "kanban" && (
        <div style={{ padding: "0 28px 28px", display: "flex", gap: 12, overflowX: "auto", alignItems: "flex-start" }}>
          {FLUXO_DE_STATUS.map((s) => {
            const cols = filtrado.filter((c) => c.status === s.chave);
            return (
              <div key={s.chave} style={{ minWidth: 230, maxWidth: 250, flex: "0 0 auto" }}>
                <div style={{ background: s.bg, border: `2px solid ${s.cor}22`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: s.cor, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{s.icone} {s.rotulo}</span>
                    <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 12 }}>{cols.length}</span>
                  </div>
                  <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8, minHeight: 60 }}>
                    {cols.length === 0 && <div style={{ color: "#bbb", fontSize: 12, textAlign: "center", padding: "8px 0" }}>Vazio</div>}
                    {cols.map((c) => (
                      <CartaoCliente key={c.id} cliente={c} statusInfo={s} prazo={prazoEnvio} onEdit={abrirEditar} onAdvance={avancarStatus} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISUALIZAÇÃO EM LISTA */}
      {visualizar === "lista" && (
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #E8E7EF", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F7F6F9" }}>
                  {["Cliente", "Telefone", "Status", "Responsável", "Ensaio", "Editado em", "Enviado em", "Dias editado", "Ações"].map((h) => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrado.map((c, eu) => {
                  const s = FLUXO_DE_STATUS.find((x) => x.chave === c.status);
                  const diasEd = c.status === "editado" ? diasDiferenca(c.editadoEm) : null;
                  const atrasado = diasEd !== null && diasEd >= prazoEnvio;
                  return (
                    <tr key={c.id} style={{ background: atrasado ? "#FFF5F5" : eu % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F0EFF5" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600 }}>{c.nome}</td>
                      <td style={{ padding: "10px 14px", color: "#666" }}>{c.telefone}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: s.bg, color: s.cor, border: `1.5px solid ${s.cor}44`, borderRadius: 6, padding: "3px 8px" }}>{s.icone} {s.rotulo}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{c.responsavel || "–"}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{formatarData(c.Data)}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{formatarData(c.editadoEm)}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{formatarData(c.enviadoEm)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        {atrasado ? <span style={{ color: "#E05C5C", fontWeight: 700 }}>⚠ {diasEd}d</span> : diasEd !== null ? <span>{diasEd}d</span> : "–"}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => abrirEditar(c)} style={{ background: "#EEF0FD", color: "#6B7FD7", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Editar</button>
                          {FLUXO_DE_STATUS[FLUXO_DE_STATUS.findIndex((x) => x.chave === c.status) + 1] && (
                            <button onClick={() => avancarStatus(c.id)} style={{ background: "#EBF8F3", color: "#3DAE7B", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>→</button>
                          )}
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
      {mostrarModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 20, color: "#1A1A2E" }}>{clienteEdicao ? "Editar Cliente" : "Novo Cliente"}</div>
            {[["Nome completo", "nome"], ["Telefone", "telefone"]].map(([rotulo, chave]) => (
              <div key={chave} style={{ marginBottom: 14 }}>
                <label style={estiloEtiqueta}>{rotulo}</label>
                <input value={forma[chave]} onChange={(e) => setForma((f) => ({ ...f, [chave]: e.target.value }))} style={estiloEntrada} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={estiloEtiqueta}>Status</label>
                <select value={forma.status} onChange={(e) => setForma((f) => ({ ...f, status: e.target.value }))} style={estiloEntrada}>
                  {FLUXO_DE_STATUS.map((s) => <option key={s.chave} value={s.chave}>{s.rotulo}</option>)}
                </select>
              </div>
              <div>
                <label style={estiloEtiqueta}>Responsável</label>
                <select value={forma.responsavel} onChange={(e) => setForma((f) => ({ ...f, responsavel: e.target.value }))} style={estiloEntrada}>
                  <option value="">–</option>
                  {membros.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div>
                <label style={estiloEtiqueta}>Data do Ensaio</label>
                <input type="date" value={forma.Data || ""} onChange={(e) => setForma((f) => ({ ...f, Data: e.target.value }))} style={estiloEntrada} />
              </div>
              <div>
                <label style={estiloEtiqueta}>Editor</label>
                <select value={forma.editor || ""} onChange={(e) => setForma((f) => ({ ...f, editor: e.target.value }))} style={estiloEntrada}>
                  <option value="">–</option>
                  {membros.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={estiloEtiqueta}>Observações</label>
              <textarea value={forma.notas} onChange={(e) => setForma((f) => ({ ...f, notas: e.target.value }))} rows={3} style={{ ...estiloEntrada, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              {clienteEdicao && (
                <button onClick={() => excluirCliente(clienteEdicao.id)} style={{ background: "#FDF0F0", color: "#E05C5C", border: "2px solid #f5c6c6", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                  Remover
                </button>
              )}
              <button onClick={() => setMostrarModal(false)} style={{ background: "#F7F6F9", color: "#666", border: "2px solid #E8E7EF", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={salvarCliente} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÕES */}
      {mostrarConfiguracoes && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>⚙</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "#1A1A2E" }}>Configurações</div>
                <div style={{ fontSize: 12, color: "#999" }}>Personalize o sistema do seu estúdio</div>
              </div>
            </div>

            <div style={{ background: "#F7F6F9", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7FD7", marginBottom: 12, textTransform: "uppercase" }}>Nome do Estúdio</div>
              <label style={estiloEtiqueta}>Nome do Estúdio</label>
              <input value={formConfig.nomeEstudio} onChange={(e) => setFormConfig((f) => ({ ...f, nomeEstudio: e.target.value }))} style={estiloEntrada} />
            </div>

            <div style={{ background: "#FDF5E8", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E09B3D", marginBottom: 12, textTransform: "uppercase" }}>Prazo de envio</div>
              <label style={estiloEtiqueta}>Prazo máximo para enviar fotos após edição</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="number" min="1" max="30" value={formConfig.prazoEnvio} onChange={(e) => setFormConfig((f) => ({ ...f, prazoEnvio: e.target.value }))} style={{ ...estiloEntrada, width: 80, fontSize: 20, fontWeight: 700, textAlign: "center" }} />
                <div style={{ fontSize: 14, color: "#666" }}>dia{formConfig.prazoEnvio > 1 ? "s" : ""} após edição</div>
              </div>
            </div>

            <div style={{ background: "#EEF0FD", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7FD7", marginBottom: 12, textTransform: "uppercase" }}>Integrantes da equipe</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {formConfig.membros.length === 0 && <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>Nenhum integrante cadastrado</div>}
                {formConfig.membros.map((m) => (
                  <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
                        {m[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{m}</span>
                    </div>
                    <button onClick={() => removerMembro(m)} style={{ background: "#FDF0F0", color: "#E05C5C", border: "1.5px solid #f5c6c6", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 12 }}>
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <label style={estiloEtiqueta}>Adicionar membro</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={novoMembro} onChange={(e) => setNovoMembro(e.target.value)} onKeyDown={(e) => e.key === "Enter" && adicionarMembro()} placeholder="Nome do membro" style={{ ...estiloEntrada, flex: 1 }} />
                <button onClick={adicionarMembro} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setMostrarConfiguracoes(false)} style={{ background: "#F7F6F9", color: "#666", border: "2px solid #E8E7EF", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={salvarConfiguracoes} style={{ background: "linear-gradient(135deg,#6B7FD7,#C96FBF)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>
                ✓ Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
