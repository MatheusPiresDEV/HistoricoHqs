document.addEventListener("DOMContentLoaded", () => {
    const senhaCorreta = "mathe0us";
    const itemList = document.getElementById("itemList");
    const modal = document.getElementById("modal");
    const senhaAdd = document.getElementById("senhaAdd");
    const formAdd = document.getElementById("formAdd");
    const confirmAdd = document.getElementById("confirmAdd");
    const fecharModal = document.getElementById("fecharModal");
    const addItemBtn = document.getElementById("addItemBtn");

    const nomeInput = document.getElementById("nomeItem");
    const imagemLinkInput = document.getElementById("imagemLink");
    const imagemUploadInput = document.getElementById("imagemUpload");
    const valorInput = document.getElementById("valorItem");

    let itens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];

    const formatarData = (data) => new Date(data).toLocaleString("pt-BR");

    const calcularTempo = (ms) => {
        const seg = Math.floor(ms / 1000);
        const dias = Math.floor(seg / 86400);
        const horas = Math.floor((seg % 86400) / 3600);
        const minutos = Math.floor((seg % 3600) / 60);
        const segundos = seg % 60;
        return `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
    };

    const salvarItens = () => {
        localStorage.setItem("carrinhoItens", JSON.stringify(itens));

    };

    const renderizarItens = () => {
        const pesquisa = document.getElementById("pesquisaItem")?.value.trim().toLowerCase();
        const tipoFiltro = document.getElementById("filtroTipo")?.value;
        const statusFiltro = document.getElementById("filtroStatus")?.value;
        const ordenacao = document.getElementById("ordenarValor")?.value;

        let filtrados = [...itens];

        if (pesquisa) {
            filtrados = filtrados.filter(item => item.nome.toLowerCase().includes(pesquisa));
        }
        if (tipoFiltro && tipoFiltro !== "todos") {
            filtrados = filtrados.filter(item => item.tipo.toLowerCase().includes(tipoFiltro.toLowerCase()));
        }
        if (statusFiltro) {
            filtrados = filtrados.filter(item => item.status === statusFiltro);
        }
        if (ordenacao) {
            filtrados.sort((a, b) => {
                const va = a.valor || 0;
                const vb = b.valor || 0;
                return ordenacao === "maior" ? vb - va : va - vb;
            });
        }

        itemList.innerHTML = "";
        const maiorValor = Math.max(...filtrados.map(item => item.valor || 0));

        filtrados.forEach((item) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}">
                <h3>${item.nome}</h3>
                <p>Adicionado em: ${formatarData(item.dataAdicao)}</p>
                <p style="color:${item.status === "Comprei" ? "green" : "red"}">Status: ${item.status}</p>
                <p style="${item.valor === maiorValor ? 'color:blue;font-weight:bold;' : ''}">
                    Valor: R$ ${(item.valor ?? 0).toFixed(2)}
                </p>
            `;

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
                card.innerHTML += `
                    <p>Comprado em: ${formatarData(item.dataCompra)}</p>
                    <p>Demorou: ${item.tempoCompra}</p>
                `;
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
            atualizarMediaPrecos();
        } else {
            alert("Senha incorreta.");
        }
    };

    const excluirItem = (item) => {
        const senha = prompt("Digite a senha para excluir o item:");
        if (senha === senhaCorreta) {
            if (confirm(`Tem certeza que deseja excluir "${item.nome}"?`)) {
                itens = itens.filter(i => i.id !== item.id);
                salvarItens();
                renderizarItens();
                atualizarMediaPrecos();

            }
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

    confirmAdd.onclick = (e) => {
        e.preventDefault();
        adicionarItem();
    };

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !modal.classList.contains("hidden") && !formAdd.classList.contains("hidden")) {
            e.preventDefault();
            adicionarItem();
        }
    });

    function adicionarItem() {
        const nome = nomeInput.value.trim();
        const checkboxes = document.querySelectorAll('input[name="tipoItem"]:checked');
        const tipos = Array.from(checkboxes).map(cb => cb.value).join(", ");
        const link = imagemLinkInput.value.trim();
        const upload = imagemUploadInput.files[0];
        const valorStr = valorInput.value.trim();

        if (!nome || !tipos || !valorStr || isNaN(parseFloat(valorStr))) {
            alert("Preencha o nome, selecione o tipo e informe um valor válido.");
            return;
        }

        const valor = parseFloat(valorStr);

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

    ["pesquisaItem", "filtroTipo", "filtroStatus", "ordenarValor"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", renderizarItens);
    });

    renderizarItens();
    atualizarMediaPrecos();
    function atualizarMediaPrecos() {
        const mediaEl = document.getElementById("media-precos");
        if (!mediaEl || !Array.isArray(itens)) return;

        const valores = itens
            .map(item => item.valor)
            .filter(v => typeof v === "number" && !isNaN(v));

        const media = valores.length
            ? valores.reduce((a, b) => a + b, 0) / valores.length
            : 0;

        const mediaFormatada = media.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        mediaEl.textContent = `Média de preços: ${mediaFormatada}`;

        // Estilo dinâmico baseado no valor da média
        if (media < 50) {
            mediaEl.style.color = "#27ae60"; // verde
        } else if (media < 100) {
            mediaEl.style.color = "#f39c12"; // laranja
        } else {
            mediaEl.style.color = "#c0392b"; // vermelho
        }
    }

});




