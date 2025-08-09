document.addEventListener("DOMContentLoaded", () => {
  const senhaCorreta = "mathe0us";
  const itemList = document.getElementById("itemList");
  const modal = document.getElementById("modal");
  const senhaAdd = document.getElementById("senhaAdd");
  const formAdd = document.getElementById("formAdd");
  const confirmAdd = document.getElementById("confirmAdd");
  const fecharModal = document.getElementById("fecharModal");
  const addItemBtn = document.getElementById("addItemBtn");

  let itens = JSON.parse(localStorage.getItem("itens")) || [];

  const formatarData = (data) => data.toLocaleString("pt-BR");

  const calcularTempo = (ms) => {
    const seg = Math.floor(ms / 1000);
    const dias = Math.floor(seg / 86400);
    const horas = Math.floor((seg % 86400) / 3600);
    const minutos = Math.floor((seg % 3600) / 60);
    const segundos = seg % 60;
    return `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
  };

  const salvarItens = () => {
    localStorage.setItem("itens", JSON.stringify(itens));
  };

  const renderizarItens = () => {
    itemList.innerHTML = "";

    const maiorValor = Math.max(...itens.map(item => item.valor || 0));

    itens.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = item.imagem;
      img.alt = item.nome;
      card.appendChild(img);

      const nome = document.createElement("h3");
      nome.textContent = item.nome;
      card.appendChild(nome);

      const dataAdd = document.createElement("p");
      dataAdd.textContent = `Adicionado em: ${formatarData(new Date(item.dataAdicao))}`;
      card.appendChild(dataAdd);

      const status = document.createElement("p");
      status.textContent = `Status: ${item.status}`;
      status.style.color = item.status === "Comprei" ? "green" : "red";
      card.appendChild(status);

      const valor = document.createElement("p");
      valor.textContent = `Valor: R$ ${item.valor.toFixed(2)}`;
      if (item.valor === maiorValor) {
        valor.style.color = "blue";
        valor.style.fontWeight = "bold";
      }
      card.appendChild(valor);

      const btnStatus = document.createElement("button");
      btnStatus.textContent = "Alterar Status";
      btnStatus.onclick = () => alterarStatus(item);
      card.appendChild(btnStatus);

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.style.backgroundColor = "#e74c3c";
      btnExcluir.onclick = () => excluirItem(item);
      card.appendChild(btnExcluir);

      if (item.status === "Comprei") {
        const dataCompra = document.createElement("p");
        dataCompra.textContent = `Comprado em: ${formatarData(new Date(item.dataCompra))}`;
        card.appendChild(dataCompra);

        const tempo = document.createElement("p");
        tempo.textContent = `Demorou: ${item.tempoCompra}`;
        card.appendChild(tempo);
      }

      itemList.appendChild(card);
    });
  };

  const alterarStatus = (item) => {
    const senha = prompt("Digite a senha para alterar o status:");
    if (senha === senhaCorreta) {
      if (item.status === "A comprar") {
        item.status = "Comprei";
        item.dataCompra = new Date().toISOString();
        const tempo = new Date(item.dataCompra) - new Date(item.dataAdicao);
        item.tempoCompra = calcularTempo(tempo);
      } else {
        item.status = "A comprar";
        delete item.dataCompra;
        delete item.tempoCompra;
      }
      salvarItens();
      renderizarItens();
    } else {
      alert("Senha incorreta.");
    }
  };

  const excluirItem = (item) => {
    const senha = prompt("Digite a senha para excluir o item:");
    if (senha === senhaCorreta) {
      itens = itens.filter(i => i.id !== item.id);
      salvarItens();
      renderizarItens();
    } else {
      alert("Senha incorreta.");
    }
  };

  addItemBtn.onclick = () => {
    modal.classList.remove("hidden");
    senhaAdd.value = "";
    formAdd.classList.add("hidden");
  };

  fecharModal.onclick = () => {
    modal.classList.add("hidden");
  };

  senhaAdd.oninput = () => {
    formAdd.classList.toggle("hidden", senhaAdd.value !== senhaCorreta);
  };

  confirmAdd.onclick = adicionarItem;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !modal.classList.contains("hidden") && !formAdd.classList.contains("hidden")) {
      adicionarItem();
    }
  });

  function adicionarItem() {
    const nome = document.getElementById("nomeItem").value.trim();
    const checkboxes = document.querySelectorAll('input[name="tipoItem"]:checked');
    const tipos = Array.from(checkboxes).map(cb => cb.value).join(", ");
    const link = document.getElementById("imagemLink").value.trim();
    const upload = document.getElementById("imagemUpload").files[0];
    const valor = parseFloat(document.getElementById("valorItem").value.trim());

    if (!nome || !tipos || isNaN(valor)) {
      alert("Preencha o nome, selecione o tipo e informe o valor.");
      return;
    }

    if (link && upload) {
      alert("Escolha apenas uma imagem: ou envie um arquivo ou insira um link.");
      return;
    }

    if (!link && !upload) {
      alert("Você precisa fornecer uma imagem: via link ou upload.");
      return;
    }

    if (upload) {
      const reader = new FileReader();
      reader.onload = function (e) {
        salvarItem(nome, tipos, e.target.result, valor);
      };
      reader.onerror = () => {
        alert("Erro ao carregar a imagem.");
      };
      reader.readAsDataURL(upload);
    } else {
      salvarItem(nome, tipos, link, valor);
    }
  }

  function salvarItem(nome, tipos, imagem, valor) {
    const novoItem = {
      id: crypto.randomUUID(),
      nome,
      tipo: tipos,
      imagem,
      valor,
      status: "A comprar",
      dataAdicao: new Date().toISOString()
    };

    itens.push(novoItem);
    salvarItens();
    renderizarItens();
    modal.classList.add("hidden");
  }

  renderizarItens();
});
