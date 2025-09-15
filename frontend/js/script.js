const API_URL = "http://localhost:5043/tarefas";

window.onload = function () {
  const mensagem = localStorage.getItem("msgSucesso")
  if (mensagem) {
    mostrarMensagem(mensagem);
    localStorage.removeItem("msgSucesso");
  }

  const secaoAtiva = localStorage.getItem("secaoAtiva");
  if (secaoAtiva) {
    const link = document.querySelector(`.sidebar-link[data-section="${secaoAtiva}"]`);
    if (link) link.click();
    localStorage.removeItem("secaoAtiva");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar-link");
  const sections = document.querySelectorAll(".section");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-item").forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");
      sections.forEach(sec => sec.classList.add("d-none"));
      const sectionId = link.getAttribute("data-section");
      document.getElementById(sectionId).classList.remove("d-none");
    });
  });
});

async function carregarTarefas() {
  const resp = await fetch(API_URL);
  const tarefas = await resp.json();
  buildTabela(tarefas);
  buildTabela(tarefas, "concluidas");
}

function buildTabela(tarefas, tipo = "pendentes") {
  const tbody = document.getElementById("tabela-" + tipo)
  tbody.innerHTML = "";
  tarefas.forEach(tarefa => {
    const tarefaConcluida = tarefa.completionDate != null;
    const addNaTabela = (tipo == "pendentes" && !tarefaConcluida) || (tipo == "concluidas" && tarefaConcluida);
    if (addNaTabela) {
      tbody.innerHTML += getLinhaTabela(tarefa, tarefaConcluida);
    }
  });
}

function getLinhaTabela(tarefa, tarefaConcluida) {
  const idRow = tarefaConcluida ? `row-conc-${tarefa.id}` : `row-pend-${tarefa.id}`;
  let row = `
      <tr id="${idRow}">
        <td>${tarefa.description}</td>
        <td>${new Date(tarefa.createdDate).toLocaleString()}</td>`;

    if (tarefaConcluida) {
      const dataFormatada = new Date(tarefa.completionDate).toLocaleString();
      row += `<td data-iso-date="${tarefa.completionDate}">${dataFormatada}</td>
              <td class="right-align">`;
    } else {
      row += `<td></td>
              <td class="right-align">
                <button class="btn btn-sm btn-success" onclick="concluirTarefa(${tarefa.id})">Concluir</button>`;
    }

    const parametros = `${tarefa.id}, '${tarefa.description}', ${tarefaConcluida}`;
    row += `<button class="btn btn-sm btn-warning" onclick="abrirModalEdicao(${parametros})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="excluirTarefa(${tarefa.id})">Excluir</button></td>`;
    return row;
}

function addListenerBuscaTarefas(tipo = "pendentes") {
  document.getElementById(`search-${tipo}`).addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    document.querySelectorAll(`#tabela-${tipo} tr`).forEach(row => {
      const descricao = row.cells[0].textContent.toLowerCase();
      row.style.display = descricao.includes(termo) ? "" : "none";
    });
  });
}

function abrirModalEdicao(id, descricao, concluida) {
  document.getElementById("editar-id").value = id;
  document.getElementById("editar-descricao").value = descricao;

  if (concluida) {
    const tarefaLinha = document.querySelector(`#tabela-concluidas tr#row-conc-${id}`);
    const dataConclusao = tarefaLinha.cells[2].getAttribute("data-iso-date");

    document.getElementById("editar-data-conclusao-container").classList.remove("d-none");
    document.getElementById("editar-data-conclusao").value = dataConclusao;
  } else {
    document.getElementById("editar-data-conclusao-container").classList.add("d-none");
  }

  const modal = new bootstrap.Modal(document.getElementById("editarTarefaModal"));
  modal.show();
}

async function alterarTarefa() {
  const id = document.getElementById("editar-id").value;
  const description = document.getElementById("editar-descricao").value;
  const completionDateInput = document.getElementById("editar-data-conclusao").value;

  const payload = { description };
  if (completionDateInput) payload.completionDate = completionDateInput + ":00";

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    adicionarMensagemStorage("Tarefa alterada com sucesso!");
  } else {
    mostrarMensagem("Não foi possível editar a tarefa.", true);
  }
}

async function excluirTarefa(id) {
  Swal.fire({
    title: "Atenção",
    text: "Tem certeza que deseja excluir a tarefa?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Excluir",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          adicionarMensagemStorage("Tarefa removida com sucesso.");
        } else {
          mostrarMensagem("Erro inesperado ao remover a tarefa. Tente novamente!", true);
        }
      });
    }
  });
}

async function adicionarTarefa() {
  const description = document.getElementById("descricao").value;
  if (description.length < 3) {
    Swal.fire("Atenção", "Você deve adicionar no mínimo 3 caracteres.", "warning");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (response.ok) {
    adicionarMensagemStorage("A tarefa foi criada com sucesso.");
  } else {
    mostrarMensagem("Não foi possível adicionar a tarefa.", true);
  }
}

function mostrarMensagem(text, erro) {
  let title = "Tudo certo!";
  let icon = "success";
  if (erro) {
    title = "Ops...";
    icon = "error";
  }
  Swal.fire({ title, text, icon, timer: 1500, showConfirmButton: false });
}

function adicionarMensagemStorage(mensagem) {
  localStorage.setItem("msgSucesso", mensagem);  
  adicionarSecaoAtiva();
  location.reload();
}

function adicionarSecaoAtiva() {
  const secao = document.querySelector(".nav-item.active a").getAttribute("data-section");
  localStorage.setItem("secaoAtiva", secao);
}

async function concluirTarefa(id) {
  const response = await fetch(`${API_URL}/${id}/concluir`, { method: "PATCH" });

  if (response.ok) {
    adicionarMensagemStorage("Tarefa concluída!");
  } else {
    mostrarMensagem("Não foi possível concluir a tarefa.", true);
  }
}

carregarTarefas();
addListenerBuscaTarefas();
addListenerBuscaTarefas("concluidas");
