// MENU HAMBÚRGUER
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('active');
}

// MODAL DE SENHA
function abrirModalSenha() {
  document.getElementById('modalSenha').style.display = 'flex';
}

function fecharModalSenha() {
  document.getElementById('modalSenha').style.display = 'none';
}

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

// ADICIONAR ITEM
function abrirCamera() {
  alert('Função de câmera ainda não implementada.');
}

function salvarItem() {
  const nome = document.getElementById('nomeItem').value;
  const tipo = document.getElementById('tipoItem').value;
  const imagemInput = document.getElementById('fileInput');
  const imagem = imagemInput.files[0];

  if (!nome || !imagem || !tipo) {
    alert('Preencha todos os campos.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imagemURL = e.target.result;
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const novoItem = {
      nome,
      tipo,
      imagem: imagemURL,
      data: dataAtual,
      status: 'Não lido'
    };

    salvarNoLocalStorage(novoItem);
    alert(`Item "${nome}" salvo com sucesso!`);
    imagemInput.value = '';
    document.getElementById('nomeItem').value = '';
    document.getElementById('tipoItem').value = '';
    location.reload();
  };
  reader.readAsDataURL(imagem);
}

function salvarNoLocalStorage(item) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  itens.push(item);
  localStorage.setItem('itens', JSON.stringify(itens));
}

function carregarItensDoLocalStorage() {
  const cardsContainer = document.querySelector('.cards-container');
  if (cardsContainer) cardsContainer.innerHTML = '';

  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  itens.forEach(adicionarCartaoAoHistorico);
  atualizarEstatisticas(itens);
}

function adicionarCartaoAoHistorico(item) {
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) return;

  const card = document.createElement('div');
  card.className = 'item-card';

  const img = document.createElement('img');
  img.src = item.imagem;
  img.alt = 'Imagem do item';
  img.className = 'item-image';

  const info = document.createElement('div');
  info.className = 'item-info';

  const title = document.createElement('h3');
  title.className = 'item-title';
  title.textContent = item.nome;

  const date = document.createElement('p');
  date.className = 'item-date';
  date.textContent = `Adicionado em: ${item.data}`;

  const statusEl = document.createElement('p');
  statusEl.className = `item-status ${item.status === 'Lido' ? 'lido' : 'nao-lido'}`;
  statusEl.textContent = `Status: ${item.status}`;
  statusEl.style.cursor = 'pointer';

  statusEl.addEventListener('click', () => {
    const senha = prompt('Digite a senha para alterar o status:');
    if (senha === 'mathe0us') {
      item.status = item.status === 'Lido' ? 'Não lido' : 'Lido';
      statusEl.textContent = `Status: ${item.status}`;
      statusEl.className = `item-status ${item.status === 'Lido' ? 'lido' : 'nao-lido'}`;
      atualizarItemNoLocalStorage(item);
      atualizarEstatisticas(JSON.parse(localStorage.getItem('itens')));
    } else {
      alert('Senha incorreta!');
    }
  });

  const excluirBtn = document.createElement('button');
  excluirBtn.textContent = 'Excluir';
  excluirBtn.style.marginTop = '10px';
  excluirBtn.style.padding = '5px 10px';
  excluirBtn.style.backgroundColor = '#e74c3c';
  excluirBtn.style.color = 'white';
  excluirBtn.style.border = 'none';
  excluirBtn.style.borderRadius = '5px';
  excluirBtn.style.cursor = 'pointer';

  excluirBtn.addEventListener('click', () => {
    const senha = prompt(`Digite a senha para excluir "${item.nome}":`);
    if (senha === 'mathe0us') {
      excluirItemDoLocalStorage(item);
      carregarItensDoLocalStorage();
    } else {
      alert('Senha incorreta!');
    }
  });

  info.appendChild(title);
  info.appendChild(date);
  info.appendChild(statusEl);
  info.appendChild(excluirBtn);

  card.appendChild(img);
  card.appendChild(info);
  cardsContainer.appendChild(card);
}

function atualizarItemNoLocalStorage(itemAtualizado) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const novosItens = itens.map(item =>
    item.nome === itemAtualizado.nome && item.data === itemAtualizado.data
      ? itemAtualizado
      : item
  );
  localStorage.setItem('itens', JSON.stringify(novosItens));
}

function excluirItemDoLocalStorage(itemParaExcluir) {
  const itens = JSON.parse(localStorage.getItem('itens')) || [];
  const novosItens = itens.filter(item =>
    !(item.nome === itemParaExcluir.nome && item.data === itemParaExcluir.data)
  );
  localStorage.setItem('itens', JSON.stringify(novosItens));
}

function atualizarEstatisticas(itens) {
  const totalLivros = document.getElementById('total-livros');
  const totalHqs = document.getElementById('total-hqs');
  const percentLivros = document.getElementById('percent-livros');
  const percentHqs = document.getElementById('percent-hqs');

  const livrosLidos = document.getElementById('livros-lidos');
  const livrosNaoLidos = document.getElementById('livros-nao-lidos');
  const livrosPercent = document.getElementById('livros-percent');

  const hqsLidas = document.getElementById('hqs-lidas');
  const hqsNaoLidas = document.getElementById('hqs-nao-lidas');
  const hqsPercent = document.getElementById('hqs-percent');

  const livros = itens.filter(i => i.tipo === 'Livro');
  const hqs = itens.filter(i => i.tipo === 'HQ');

  const livrosL = livros.filter(i => i.status === 'Lido').length;
  const hqsL = hqs.filter(i => i.status === 'Lido').length;

  const livrosTotal = livros.length;
  const hqsTotal = hqs.length;

  const livrosPorcentagem = livrosTotal > 0 ? Math.round((livrosL / livrosTotal) * 100) : 0;
  const hqsPorcentagem = hqsTotal > 0 ? Math.round((hqsL / hqsTotal) * 100) : 0;

  if (totalLivros) totalLivros.textContent = livrosTotal;
  if (totalHqs) totalHqs.textContent = hqsTotal;
  if (percentLivros) percentLivros.textContent = `${livrosPorcentagem}%`;
  if (percentHqs) percentHqs.textContent = `${hqsPorcentagem}%`;

  if (livrosLidos) livrosLidos.textContent = livrosL;
  if (livrosNaoLidos) livrosNaoLidos.textContent = livrosTotal - livrosL;
  if (livrosPercent) livrosPercent.textContent = `${livrosPorcentagem}%`;

  if (hqsLidas) hqsLidas.textContent = hqsL;
  if (hqsNaoLidas) hqsNaoLidas.textContent = hqsTotal - hqsL;
  if (hqsPercent) hqsPercent.textContent = `${hqsPorcentagem}%`;
}

// ENTER para enviar
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
