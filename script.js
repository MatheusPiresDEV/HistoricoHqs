// MENU HAMBÚRGUER
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});


// script.js

// Aguarda carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const adicionarSection = document.querySelector('.adicionar-section');
  const formAdicao = document.getElementById('formAdicao');
  const modalSenha = document.getElementById('modalSenha');
  const btnAdicionar = document.getElementById('btnAdicionar');
  const btnConfirmarSenha = document.getElementById('btnConfirmarSenha');
  const btnFecharModal = document.getElementById('btnFecharModal');

  // Estado inicial: mostrar apenas o botão “Adicionar”
  if (adicionarSection) adicionarSection.style.display = 'flex';
  if (formAdicao) formAdicao.style.display = 'none';
  if (modalSenha) modalSenha.style.display = 'none';

  // Ao clicar em “Adicionar”, só exibe o modal de senha
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', abrirModalSenha);
  }

  // Botões do modal
  if (btnConfirmarSenha) btnConfirmarSenha.addEventListener('click', confirmarSenha);
  if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModalSenha);

  // Captura o submit do formulário de adição
  if (formAdicao) {
    formAdicao.addEventListener('submit', function (e) {
      e.preventDefault();
      salvarItem();
    });
  }

  // Carrega histórico e estatísticas ao iniciar
  carregarItensDoLocalStorage();
});


// Abre o modal de senha
function abrirModalSenha() {
  document.getElementById('modalSenha').style.display = 'flex';
}

// Fecha o modal de senha
function fecharModalSenha() {
  document.getElementById('modalSenha').style.display = 'none';
}

// Confirmação da senha: exibe o form de adição
function confirmarSenha() {
  const senha = document.getElementById('senhaInput').value;
  if (senha === 'mathe0us') {
    fecharModalSenha();
    document.querySelector('.adicionar-section').style.display = 'none';
    document.getElementById('formAdicao').style.display = 'flex';
  } else {
    alert('Senha incorreta!');
  }
}


document.addEventListener("DOMContentLoaded", () => {
  carregarItensDoLocalStorage();
});

// Salva novo item no localStorage
function salvarItem() {
  const nome = document.getElementById('nomeItem').value.trim();
  const tipo = document.getElementById('tipoItem').value;
  const arquivo = document.getElementById('fileInput').files[0];
  const urlImagem = document.getElementById('urlInput').value.trim();

  if (!nome || !tipo) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  if ((arquivo && urlImagem) || (!arquivo && !urlImagem)) {
    alert('Preencha apenas UM campo de imagem: upload OU URL.');
    return;
  }

  const criarItem = (imagemFinal) => {
    const novoItem = {
      id: crypto.randomUUID(),
      nome,
      tipo,
      imagem: imagemFinal,
      data: new Date().toLocaleString('pt-BR'),
      status: 'Não lido',
      dataConclusao: null
    };

    salvarNoLocalStorage(novoItem);
    alert(`Item "${nome}" salvo com sucesso!`);

    document.getElementById('nomeItem').value = '';
    document.getElementById('tipoItem').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('urlInput').value = '';

    window.location.reload();
  };

  if (arquivo) {
    const reader = new FileReader();
    reader.onload = function (e) {
      criarItem(e.target.result);
    };
    reader.readAsDataURL(arquivo);
  } else {
    criarItem(urlImagem);
  }
}
function salvarNoLocalStorage(item) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  itens.push(item);
  localStorage.setItem('itens', JSON.stringify(itens));
}

function carregarItensDoLocalStorage() {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  atualizarEstatisticas(itens);

  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) return;

  cardsContainer.innerHTML = '';
  itens.forEach(adicionarCartaoAoHistorico);
}

function atualizarEstatisticas(itens) {
  const livros = itens.filter(i => i.tipo === 'Livro');
  const hqs = itens.filter(i => i.tipo === 'HQ');

  const cont = (arr, status) => arr.filter(i => i.status === status).length;
  const pct = (num, tot) => tot > 0 ? Math.round((num / tot) * 100) : 0;

  document.getElementById('total-livros').textContent = livros.length;
  document.getElementById('livros-lidos').textContent = cont(livros, 'Lido');
  document.getElementById('livros-nao-lidos').textContent = cont(livros, 'Não lido');
  document.getElementById('livros-percent').textContent = pct(cont(livros, 'Lido'), livros.length) + '%';

  document.getElementById('total-hqs').textContent = hqs.length;
  document.getElementById('hqs-lidas').textContent = cont(hqs, 'Lido');
  document.getElementById('hqs-nao-lidas').textContent = cont(hqs, 'Não lido');
  document.getElementById('hqs-percent').textContent = pct(cont(hqs, 'Lido'), hqs.length) + '%';
}

function adicionarCartaoAoHistorico(item) {
  const cardsContainer = document.querySelector('.cards-container');
  const card = document.createElement('article');
  card.className = 'item-card';

  const img = document.createElement('img');
  img.src = item.imagem;
  img.alt = 'Capa';
  img.className = 'item-image';

  const info = document.createElement('div');
  info.className = 'item-info';

  const title = document.createElement('h3');
  title.className = 'item-title';
  title.textContent = item.nome;

  const dateEl = document.createElement('p');
  dateEl.className = 'item-date';
  dateEl.textContent = `Adicionado em: ${item.data}`;

  const statusEl = document.createElement('p');
  statusEl.className = 'item-status ' + (
    item.status === 'Lido' ? 'lido' :
      item.status === 'Em andamento' ? 'em-andamento' :
        'nao-lido'
  );
  statusEl.textContent = `Status: ${item.status}`;

  const statusBtn = document.createElement('button');
  statusBtn.className = 'btn-status';
  atualizarTextoBotaoStatus(statusBtn, item.status);

  statusBtn.addEventListener('click', () => {
    if (item.status === 'Não lido') {
      item.status = 'Em andamento';
      item.dataConclusao = null;
    } else if (item.status === 'Em andamento') {
      const resp = prompt('Quantas páginas o livro tem?');
      const paginas = parseInt(resp, 10);
      if (!Number.isInteger(paginas) || paginas <= 0) {
        alert('Informe um número de páginas válido.');
        return;
      }

      item.status = 'Lido';
      item.dataConclusao = new Date().toLocaleString('pt-BR');

      const inicio = parseDataHistorico(item.data);
      const fim = parseDataHistorico(item.dataConclusao);
      const resumo = avaliarLeitura(inicio, fim, paginas);
      const pre = document.createElement('pre');
      pre.className = 'resultado';
      pre.innerText = resumo;
      info.appendChild(pre);
    }

    atualizarItemNoLocalStorage(item);
    statusEl.textContent = `Status: ${item.status}`;
    statusEl.className = 'item-status ' + (
      item.status === 'Lido' ? 'lido' :
        item.status === 'Em andamento' ? 'em-andamento' :
          'nao-lido'
    );
    atualizarTextoBotaoStatus(statusBtn, item.status);
  });

  const excluirBtn = document.createElement('button');
  excluirBtn.className = 'btn-excluir';
  excluirBtn.textContent = 'Excluir';
  excluirBtn.addEventListener('click', () => {
    const senha = prompt(`Digite a senha para excluir "${item.nome}"`);
    if (senha === 'mathe0us') {
      excluirItemDoLocalStorage(item);
      carregarItensDoLocalStorage();
    } else {
      alert('Senha incorreta!');
    }
  });

  info.append(title, dateEl, statusEl, excluirBtn);
  card.append(img, info, statusBtn);
  cardsContainer.appendChild(card);
}

function atualizarTextoBotaoStatus(btn, status) {
  if (status === 'Não lido') {
    btn.innerText = 'Iniciar leitura';
    btn.disabled = false;
  } else if (status === 'Em andamento') {
    btn.innerText = 'Concluir leitura';
    btn.disabled = false;
  } else {
    btn.innerText = 'Leitura concluída';
    btn.disabled = true;
  }
}

function atualizarItemNoLocalStorage(itemAtualizado) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const idx = itens.findIndex(i => i.id === itemAtualizado.id);
  if (idx >= 0) {
    itens[idx] = itemAtualizado;
    localStorage.setItem('itens', JSON.stringify(itens));
  }
}

function excluirItemDoLocalStorage(itemParaExcluir) {
  let itens = JSON.parse(localStorage.getItem('itens')) || [];
  itens = itens.filter(i => i.id !== itemParaExcluir.id);
  localStorage.setItem('itens', JSON.stringify(itens));
}

function parseDataHistorico(str) {
  const [data, hora] = str.split(' ');
  const [dia, mes, ano] = data.split('/').map(Number);
  const [h, m, s] = hora.split(':').map(Number);
  return new Date(ano, mes - 1, dia, h, m, s);
}

function avaliarLeitura(dataInicio, dataFim, paginas) {
  const diffMs = dataFim - dataInicio;
  const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const vel = dias > 0 ? (paginas / dias).toFixed(2) : paginas;
  return `Início: ${dataInicio.toLocaleDateString('pt-BR')} ${dataInicio.toLocaleTimeString('pt-BR')}\n` +
    `Conclusão: ${dataFim.toLocaleDateString('pt-BR')} ${dataFim.toLocaleTimeString('pt-BR')}\n` +
    `Duração: ${dias} dia(s)\n` +
    `Média: ${vel} página(s)/dia`;
}
// Atualiza estatísticas de livros e HQs na Home
function atualizarEstatisticas(itens) {
  const livros = itens.filter(i => i.tipo === 'Livro');
  const hqs = itens.filter(i => i.tipo === 'HQ');

  const cont = (arr, status) => arr.filter(i => i.status === status).length;
  const pct = (num, tot) => tot > 0 ? Math.round((num / tot) * 100) : 0;

  const livrosTotal = livros.length;
  const hqsTotal = hqs.length;

  const livrosLidos = cont(livros, 'Lido');
  const livrosNaoLidos = cont(livros, 'Não lido');

  const hqsLidas = cont(hqs, 'Lido');
  const hqsNaoLidas = cont(hqs, 'Não lido');

  // Atualiza elementos da Home
  document.getElementById('total-livros').textContent = livrosTotal;
  document.getElementById('livros-lidos').textContent = livrosLidos;
  document.getElementById('livros-nao-lidos').textContent = livrosNaoLidos;
  document.getElementById('livros-percent').textContent = pct(livrosLidos, livrosTotal) + '%';
  document.getElementById('percent-livros').textContent = pct(livrosLidos, livrosTotal) + '%';
  document.getElementById('percent-livros-nao-lidos').textContent = pct(livrosNaoLidos, livrosTotal) + '%';

  document.getElementById('total-hqs').textContent = hqsTotal;
  document.getElementById('hqs-lidas').textContent = hqsLidas;
  document.getElementById('hqs-nao-lidas').textContent = hqsNaoLidas;
  document.getElementById('hqs-percent').textContent = pct(hqsLidas, hqsTotal) + '%';
  document.getElementById('percent-hqs').textContent = pct(hqsLidas, hqsTotal) + '%';
  document.getElementById('percent-hqs-nao-lidas').textContent = pct(hqsNaoLidas, hqsTotal) + '%';
}
// Cria um cartão no histórico com botão de status e excluir
function adicionarCartaoAoHistorico(item) {
  const cardsContainer = document.querySelector('.cards-container');
  const card = document.createElement('article');
  card.className = 'item-card';

  // Imagem
  const img = document.createElement('img');
  img.src = item.imagem;
  img.alt = 'Capa';
  img.className = 'item-image';

  // Info
  const info = document.createElement('div');
  info.className = 'item-info';

  const title = document.createElement('h3');
  title.className = 'item-title';
  title.textContent = item.nome;

  const dateEl = document.createElement('p');
  dateEl.className = 'item-date';
  dateEl.textContent = `Adicionado em: ${item.data}`;

  const statusEl = document.createElement('p');
  statusEl.className = 'item-status ' +
    (item.status === 'Lido' ? 'lido' :
      item.status === 'Em andamento' ? 'em-andamento' :
        'nao-lido');
  statusEl.textContent = `Status: ${item.status}`;

  info.append(title, dateEl, statusEl);

  // Botão de status único
  const statusBtn = document.createElement('button');
  statusBtn.className = 'btn-status';
  atualizarTextoBotaoStatus(statusBtn, item.status);

  statusBtn.addEventListener('click', () => {
    if (item.status === 'Não lido') {
      item.status = 'Em andamento';
      item.dataConclusao = null;
      atualizarItemNoLocalStorage(item);
      statusEl.textContent = `Status: ${item.status}`;
      statusEl.className = 'item-status em-andamento';
      atualizarTextoBotaoStatus(statusBtn, item.status);

    } else if (item.status === 'Em andamento') {
      const resp = prompt('Quantas páginas o livro tem?');
      const paginas = parseInt(resp, 10);
      if (!Number.isInteger(paginas) || paginas <= 0) {
        alert('Informe um número de páginas válido.');
        return;
      }

      item.status = 'Lido';
      item.dataConclusao = new Date().toLocaleString('pt-BR');
      atualizarItemNoLocalStorage(item);

      statusEl.textContent = `Status: ${item.status}`;
      statusEl.className = 'item-status lido';
      atualizarTextoBotaoStatus(statusBtn, item.status);

      // Exibe resumo
      const inicio = parseDataHistorico(item.data);
      const fim = parseDataHistorico(item.dataConclusao);
      const resumo = avaliarLeitura(inicio, fim, paginas);
      const pre = document.createElement('pre');
      pre.className = 'resultado';
      pre.innerText = resumo;
      info.appendChild(pre);
    }
  });

  // Botão Excluir
  const excluirBtn = document.createElement('button');
  excluirBtn.className = 'btn-excluir';
  excluirBtn.textContent = 'Excluir';
  excluirBtn.addEventListener('click', () => {
    const senha = prompt(`Digite a senha para excluir "${item.nome}"`);
    if (senha === 'mathe0us') {
      excluirItemDoLocalStorage(item);
      carregarItensDoLocalStorage();
    } else {
      alert('Senha incorreta!');
    }
  });

  // Monta o cartão
  card.append(img, info, statusBtn);
  info.appendChild(excluirBtn);
  cardsContainer.appendChild(card);
}


// Atualiza texto e habilita/desabilita o botão de status
function atualizarTextoBotaoStatus(btn, status) {
  if (status === 'Não lido') {
    btn.innerText = 'Iniciar leitura';
    btn.disabled = false;
  } else if (status === 'Em andamento') {
    btn.innerText = 'Concluir leitura';
    btn.disabled = false;
  } else {
    btn.innerText = 'Leitura concluída';
    btn.disabled = true;
  }
}


// Sobrescreve o item no localStorage
function atualizarItemNoLocalStorage(itemAtualizado) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const idx = itens.findIndex(i =>
    i.nome === itemAtualizado.nome &&
    i.data === itemAtualizado.data
  );
  if (idx >= 0) {
    itens[idx] = itemAtualizado;
    localStorage.setItem('itens', JSON.stringify(itens));
  }
}

// Remove o item do localStorage
function excluirItemDoLocalStorage(itemParaExcluir) {
  let itens = JSON.parse(localStorage.getItem('itens')) || [];
  itens = itens.filter(i =>
    !(i.nome === itemParaExcluir.nome &&
      i.data === itemParaExcluir.data)
  );
  localStorage.setItem('itens', JSON.stringify(itens));
}


// Converte string "dd/MM/yyyy HH:mm:ss" em Date
function parseDataHistorico(str) {
  const [data, hora] = str.split(' ');
  const [dia, mes, ano] = data.split('/').map(Number);
  const [h, m, s] = hora.split(':').map(Number);
  return new Date(ano, mes - 1, dia, h, m, s);
}

// Gera resumo de duração e média de leitura
function avaliarLeitura(dataInicio, dataFim, paginas) {
  const diffMs = dataFim - dataInicio;
  const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const vel = dias > 0 ? (paginas / dias).toFixed(2) : paginas;
  return `Início: ${dataInicio.toLocaleDateString('pt-BR')} ${dataInicio.toLocaleTimeString('pt-BR')}\n` +
    `Conclusão: ${dataFim.toLocaleDateString('pt-BR')} ${dataFim.toLocaleTimeString('pt-BR')}\n` +
    `Duração: ${dias} dia(s)\n` +
    `Média: ${vel} página(s)/dia`;
}


/**
 * Atualiza o texto e o estado do botão conforme o status atual
 */
function atualizarTextoBotaoStatus(btn, status) {
  if (status === 'Não lido') {
    btn.innerText = 'Iniciar leitura';
    btn.disabled = false;
  } else if (status === 'Em andamento') {
    btn.innerText = 'Concluir leitura';
    btn.disabled = false;
  } else { // Lido
    btn.innerText = 'Leitura concluída';
    btn.disabled = true;
  }
}

// PARSER DE DATA (pt-BR dd/MM/yyyy HH:mm:ss)
function parseDataHistorico(valor) {
  if (valor instanceof Date) return valor;
  if (typeof valor === 'string') {
    const m = valor.match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
    );
    if (m) {
      const [, dd, mm, yyyy, HH, MM, SS] = m;
      return new Date(`${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}-03:00`);
    }
    const d2 = new Date(valor);
    if (!isNaN(d2)) return d2;
  }
  return new Date('Invalid Date');
}

// CALCULA DIFERENÇA ENTRE DUAS DATAS
function calcularTempo(dataInicio, dataConclusao) {
  const diffMs = dataConclusao.getTime() - dataInicio.getTime();
  if (isNaN(diffMs)) return null;
  const totalSeg = Math.floor(diffMs / 1000);
  const dias = Math.floor(totalSeg / 86400);
  const horas = Math.floor((totalSeg % 86400) / 3600);
  const minutos = Math.floor((totalSeg % 3600) / 60);
  const segundos = totalSeg % 60;
  return { dias, horas, minutos, segundos, totalSeg };
}

// AVALIAÇÃO DE LEITURA COM BASE EM PÁGINAS
function avaliarLeitura(dataInicio, dataConclusao, paginas) {
  const t = calcularTempo(dataInicio, dataConclusao);
  if (!t) return 'Erro ao calcular tempo.';
  const { dias, horas, minutos, segundos, totalSeg } = t;

  const tempoPorPagina = totalSeg / paginas;
  let rotulo;
  if (tempoPorPagina < 60) rotulo = 'muito rápida 📘⚡';
  else if (tempoPorPagina <= 180) rotulo = 'razoável 📗';
  else rotulo = 'demorada 📕⏳';

  return (
    `Tempo para concluir: ${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos\n` +
    `Total de páginas: ${paginas}\n` +
    `Tempo médio por página: ${Math.round(tempoPorPagina)} segundos\n` +
    `Classificação: Leitura ${rotulo}`
  );
}

// ATUALIZA ITEM NO localStorage
function atualizarItemNoLocalStorage(itemAtualizado) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const novos = itens.map(i =>
    i.nome === itemAtualizado.nome && i.data === itemAtualizado.data
      ? itemAtualizado
      : i
  );
  localStorage.setItem('itens', JSON.stringify(novos));
}

// EXCLUI ITEM DO localStorage
function excluirItemDoLocalStorage(itemParaExcluir) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const filtrados = itens.filter(
    i => !(i.nome === itemParaExcluir.nome && i.data === itemParaExcluir.data)
  );
  localStorage.setItem('itens', JSON.stringify(filtrados));
}

// INICIALIZAÇÃO AO CARREGAR A PÁGINA

// Atualiza todos os campos de estatísticas na Home
function atualizarEstatisticas(itens) {
  const elementos = {
    totalLivros: document.getElementById('total-livros'),
    totalHqs: document.getElementById('total-hqs'),
    percentLivros: document.getElementById('percent-livros'),
    percentHqs: document.getElementById('percent-hqs'),
    livrosLidos: document.getElementById('livros-lidos'),
    livrosNaoLidos: document.getElementById('livros-nao-lidos'),
    livrosPercent: document.getElementById('livros-percent'),
    percentLivrosNaoLidos: document.getElementById('percent-livros-nao-lidos'),
    hqsLidas: document.getElementById('hqs-lidas'),
    hqsNaoLidas: document.getElementById('hqs-nao-lidas'),
    hqsPercent: document.getElementById('hqs-percent'),
    percentHqsNaoLidas: document.getElementById('percent-hqs-nao-lidas'),
    livrosAndamento: document.getElementById('livros-andamento'),
    percentLivrosAndamento: document.getElementById('percent-livros-andamento'),
    hqsAndamento: document.getElementById('hqs-andamento'),
    percentHqsAndamento: document.getElementById('percent-hqs-andamento')
  };

  const filtrarPorTipo = (tipo) => itens.filter(i => i.tipo === tipo);
  const contarPorStatus = (arr, status) => arr.filter(i => i.status === status).length;
  const calcularPct = (num, tot) => tot > 0 ? Math.round((num / tot) * 100) : 0;

  const livros = filtrarPorTipo('Livro');
  const hqs = filtrarPorTipo('HQ');

  const livrosTotal = livros.length;
  const hqsTotal = hqs.length;

  const livrosL = contarPorStatus(livros, 'Lido');
  const livrosN = contarPorStatus(livros, 'Não lido');
  const livrosA = contarPorStatus(livros, 'Em andamento');

  const hqsL = contarPorStatus(hqs, 'Lido');
  const hqsN = contarPorStatus(hqs, 'Não lido');
  const hqsA = contarPorStatus(hqs, 'Em andamento');

  const livrosPctLidos = calcularPct(livrosL, livrosTotal);
  const livrosPctNaoLidos = calcularPct(livrosN, livrosTotal);
  const livrosPctAndamento = calcularPct(livrosA, livrosTotal);

  const hqsPctLidas = calcularPct(hqsL, hqsTotal);
  const hqsPctNaoLidas = calcularPct(hqsN, hqsTotal);
  const hqsPctAndamento = calcularPct(hqsA, hqsTotal);

  // Atualiza DOM
  if (elementos.totalLivros) elementos.totalLivros.textContent = livrosTotal;
  if (elementos.totalHqs) elementos.totalHqs.textContent = hqsTotal;

  if (elementos.livrosLidos) elementos.livrosLidos.textContent = livrosL;
  if (elementos.livrosNaoLidos) elementos.livrosNaoLidos.textContent = livrosN;
  if (elementos.livrosPercent) elementos.livrosPercent.textContent = `${livrosPctLidos}%`;
  if (elementos.percentLivros) elementos.percentLivros.textContent = `${livrosPctLidos}%`;
  if (elementos.percentLivrosNaoLidos) elementos.percentLivrosNaoLidos.textContent = `${livrosPctNaoLidos}%`;

  if (elementos.hqsLidas) elementos.hqsLidas.textContent = hqsL;
  if (elementos.hqsNaoLidas) elementos.hqsNaoLidas.textContent = hqsN;
  if (elementos.hqsPercent) elementos.hqsPercent.textContent = `${hqsPctLidas}%`;
  if (elementos.percentHqs) elementos.percentHqs.textContent = `${hqsPctLidas}%`;
  if (elementos.percentHqsNaoLidas) elementos.percentHqsNaoLidas.textContent = `${hqsPctNaoLidas}%`;

  if (elementos.livrosAndamento) elementos.livrosAndamento.textContent = livrosA;
  if (elementos.percentLivrosAndamento) elementos.percentLivrosAndamento.textContent = `${livrosPctAndamento}%`;

  if (elementos.hqsAndamento) elementos.hqsAndamento.textContent = hqsA;
  if (elementos.percentHqsAndamento) elementos.percentHqsAndamento.textContent = `${hqsPctAndamento}%`;
}


// Carrega itens do localStorage, atualiza estatísticas e renderiza cards (se existir container)
function carregarItensDoLocalStorage() {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];

  // 1) Atualiza estatísticas na Home
  atualizarEstatisticas(itens);

  // 2) Se estivermos na página de histórico (cards-container existe), renderiza os cartões
  const cardsContainer = document.querySelector('.cards-container');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    itens.forEach(item => adicionarCartaoAoHistorico(item));
  }
}

// Atalhos de teclado e inicialização
document.addEventListener('DOMContentLoaded', () => {
  const nomeInput = document.getElementById('nomeItem');
  if (nomeInput) {
    nomeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        salvarItem();
      }
    });
  }

  carregarItensDoLocalStorage();
});

document.addEventListener("DOMContentLoaded", () => {
  atualizarResumoCarrinho();
});

function atualizarResumoCarrinho() {
  const itens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];

  const total = itens.length;
  let hqs = 0, livros = 0, outros = 0;
  let comprados = 0, apendentes = 0;
  let totalGasto = 0;
  let totalCarrinho = 0;

  itens.forEach(item => {
    const tipos = item.tipo.split(",").map(t => t.trim().toLowerCase());

    if (tipos.includes("hq")) hqs++;
    if (tipos.includes("livro")) livros++;
    if (tipos.includes("outro")) outros++;

    if (item.status === "Comprei") {
      comprados++;
      totalGasto += parseFloat(item.valor) || 0;
    } else {
      apendentes++;
      totalCarrinho += parseFloat(item.valor) || 0;
    }
  });

  const percent = (count) => total ? ((count / total) * 100).toFixed(1) + "%" : "0%";

  // Quantidades
  document.getElementById("total-carrinho").textContent = total;
  document.getElementById("carrinho-hqs").textContent = hqs;
  document.getElementById("carrinho-livros").textContent = livros;
  document.getElementById("carrinho-outros").textContent = outros;
  document.getElementById("carrinho-comprados").textContent = comprados;
  document.getElementById("carrinho-apendentes").textContent = apendentes;

  // Porcentagens
  document.getElementById("percent-hqs-carrinho").textContent = percent(hqs);
  document.getElementById("percent-livros-carrinho").textContent = percent(livros);
  document.getElementById("percent-outros-carrinho").textContent = percent(outros);
  document.getElementById("percent-comprados").textContent = percent(comprados);
  document.getElementById("percent-apendentes").textContent = percent(apendentes);

  // Totais financeiros
  document.getElementById("total-gasto").textContent = `R$ ${totalGasto.toFixed(2)}`;
  document.getElementById("total-carrinho-valor").textContent = `R$ ${totalCarrinho.toFixed(2)}`;
}

// Função para registrar eventos detalhados no histórico

// GRÁFICO INTERATIVO
let graficoAtual = null;

function mostrarGrafico(tipo) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const livros = itens.filter(i => i.tipo === 'Livro');
  const hqs = itens.filter(i => i.tipo === 'HQ');

  const contar = (arr, status) => arr.filter(i => i.status === status).length;

  const livrosLidos = contar(livros, 'Lido');
  const livrosNaoLidos = contar(livros, 'Não lido');
  const livrosAndamento = contar(livros, 'Em andamento');

  const hqsLidos = contar(hqs, 'Lido');
  const hqsNaoLidos = contar(hqs, 'Não lido');
  const hqsAndamento = contar(hqs, 'Em andamento');

  const totalItens = itens.length;
  const totalLidos = contar(itens, 'Lido');
  const totalEmAndamento = contar(itens, 'Em andamento');
  const totalNaoLidos = contar(itens, 'Não lido');

  let dados, titulo, labels, tipoGrafico = 'doughnut';
  const ctx = document.getElementById('graficoCanvas').getContext('2d');

  if (graficoAtual) graficoAtual.destroy();

  switch (tipo) {
    case 'relacao':
      dados = [livros.length, hqs.length];
      labels = ['Livros', 'HQs'];
      titulo = 'Relação entre Livros e HQs';
      break;

    case 'hq':
      dados = [hqsLidos, hqsNaoLidos];
      labels = ['HQs Lidos', 'HQs Não Lidos'];
      titulo = 'HQs Lidos vs Não Lidos';
      break;

    case 'livro':
      dados = [livrosLidos, livrosNaoLidos];
      labels = ['Livros Lidos', 'Livros Não Lidos'];
      titulo = 'Livros Lidos vs Não Lidos';
      break;

    case 'status-livros':
      dados = [livrosLidos, livrosNaoLidos, livrosAndamento];
      labels = ['Lidos', 'Não Lidos', 'Em Andamento'];
      titulo = 'Status dos Livros';
      break;

    case 'status-hqs':
      dados = [hqsLidos, hqsNaoLidos, hqsAndamento];
      labels = ['Lidas', 'Não Lidas', 'Em Andamento'];
      titulo = 'Status das HQs';
      break;

    case 'andamento':
      dados = [livrosAndamento, hqsAndamento];
      labels = ['Livros em andamento', 'HQs em andamento'];
      titulo = 'Itens em andamento';
      tipoGrafico = 'bar';
      break;

    case 'progresso-total':
      dados = [totalLidos, totalEmAndamento, totalNaoLidos];
      labels = ['Lidos', 'Em Andamento', 'Não Lidos'];
      titulo = 'Progresso Total de Leitura';
      break;
  }

  graficoAtual = new Chart(ctx, {
    type: tipoGrafico,
    data: {
      labels: labels,
      datasets: [{
        data: dados,
        backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: titulo,
          font: {
            size: 16
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}


