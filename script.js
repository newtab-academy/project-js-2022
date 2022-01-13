var infos = [];
    
// Mock com lista de cartões para teste
var cards = [
    // cartão válido
    {
      card_number: '1111111111111111',
      cvv: 789,
      expiry_date: '01/18',
    },
    // cartão inválido
    {
      card_number: '4111111111111234',
      cvv: 123,
      expiry_date: '01/20',
    },
];

var valorCartao = {}
// Função para pegar a escolha do cartão do input select

function escolhaDoCartao(event) {
    
    valorCartao = event.target.value;
}

// Ações dos modals
function clear() {
    document.querySelector('.abrir-pagamento').style.display = "none"; // Para abrir modal de pagamento
    document.querySelector('.abrir-pagou').style.display = "none"; // Para abrir modal com recibo de pagamento
    document.querySelector('.err-message').style.display = "none"; // Para validar campo de valor digitado
    document.getElementById('valor-input').value = ""
}

var pegarUsuario = ""; // Para pegar o nome do usuário
var abrirNaoRecebeu = ""; // Para msg de erro de pagamento
var valorCartao = "1"; // Para pegar o cartão escolhido para pagamento
var valorDinheiro = ""; // Para pegar o valor de pagamento digitado

// Função para abrir o modal de pagamento do usuário
function abrirModalPagar(name) {
    document.querySelector('.abrir-pagamento').style.display = "flex";
    pegarUsuario = name;
}

// Função que abre o modal de recibo de pagamento 
function abrirModalPagou() {
    if (valorDinheiro === "") {
        document.querySelector('.err-message').style.display = "flex";
    } else 
        {
        if (valorCartao === "1") {
            abrirNaoRecebeu = ("");
        } else {
            abrirNaoRecebeu = ("não");
        }

        document.querySelector('.abrir-pagamento').style.display = "none";
        document.querySelector('.abrir-pagou').style.display = "flex";
        valorDinheiro = "";
        document.querySelector('.err-message').style.display = "none";
        document.getElementById('valor-input').value = "";
    }
}

// Função para fechar o modal do recibo de pagamento
function fecharModal() {
    document.querySelector('.abrir-pagou').style.display = "none";
}

// Função para validar campo de valor para pagamento do usuário
function valorInput(event) {

    valorDinheiro = (event.target.value).replace(/[^0-9]+/gi,'')
    
    if (valorDinheiro.length <= 2) {
        valorDinheiro = "0." + ("00" + valorDinheiro).slice(-2)
    } else {
        valorDinheiro = (valorDinheiro).slice(0, -2) + '.' + (valorDinheiro).slice(-2)
    }

    document.getElementById('valor-input').value = parseFloat(valorDinheiro).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }); 

    document.querySelector('.err-message').style.display = "none";
}

// Renderizando na tela as informações recebidas da API 
function render() {
    list = infos.map(item => (
        `<div class="container" key=${item.index}>
            <div class="content">
                <img class="thumbnail" src=${item.img} alt="Foto do usuário" />
                <div class="infos">   
                    <p>Nome do Usuário: ${item.name}</p>
                    <p>ID: ${item.id} - Username: ${item.username}</p>
                </div>
                <button class="botao-pagar" onclick="abrirModalPagar('${item.name}')">Pagar</button>
            </div>
        </div>`
    )).join("\n")


    /*--------------------------------Abrir Modal de pagamento----------------------------------*/
    modalPag = `
        <div class="abrirModal abrir-pagamento">
            <p class="texto-cabecalho-modal">Pagamento para <span>${pegarUsuario}</span></p>
            <div class="valorInput">
            <input type="text" id="valor-input" value="${valorDinheiro}" onkeyup="valorInput(event)" data-prefix="R$ " data-inputmode="numeric" placeholder="R$ 0,00" />
            <p class="err-message">Campo obrigatório</p>
            </div>
            <select value=${valorCartao} onchange="escolhaDoCartao(event)">
                <option value="1">Cartão com final ${cards[0].card_number.substr(-4)}</option>
                <option value="2">Cartão com final ${cards[1].card_number.substr(-4)}</option>
            </select>
            <button onclick="abrirModalPagou()">Pagar</button>
        </div>  
    `;

    /*------------------------------Abrir Modal de recibo de pagamento--------------------------------*/
   modalRec = ` 
        <div class="abrirModal abrir-pagou">
            <p class="texto-cabecalho-modal">Recibo de pagamento</p>
            <p>O Pagamento <b>${abrirNaoRecebeu}</b> foi concluído com sucesso</p>
            <button onclick="fecharModal()">Fechar</button>
        </div>
    `

    document.getElementById('list').innerHTML = list 
    document.getElementById('modalPag').innerHTML = modalPag
    document.getElementById('modalRec').innerHTML = modalRec
}


fetch(`https://cors.eu.org/${('https://www.mocky.io/v2/5d531c4f2e0000620081ddce')}`).
then(jsonRaw => jsonRaw.json()).
then((resposta) => { 
    infos = resposta 
    render();
    clear()
})