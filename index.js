const KEY_BD = '@usuariosestudo'

var listadeprodutos = {
    ultimoIDgerado: 0,
    produtos: []
}

function Salvar() {
    var id = listadeprodutos.ultimoIDgerado +1
    listadeprodutos.ultimoIDgerado = id

    let item = document.getElementById("valorProduto").value
    let valor = document.getElementById("valorPreco").value

    listadeprodutos.produtos.push({
        ID: id, Produto: `${item}`, Preco: `${valor}`
    })

    gravarBD()
    Renderizar()
}

function editUsuario(ID, novoProduto, novoPreco){
    var produto = listadeprodutos.produtos.find(produto => produto.ID == ID);
    if (produto) {
        produto.Produto = novoProduto;
        produto.Preco = novoPreco;
        gravarBD();
        Renderizar();
    }
}

function deleteUsuario(ID){
    listadeprodutos.produtos = listadeprodutos.produtos.filter(produto => {
        return produto.ID != ID
    })
    gravarBD()
    Renderizar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id ' + id)){
        deleteUsuario(id)
    }
}

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listadeprodutos))
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listadeprodutos = JSON.parse(data)
    }

    Renderizar()
}

function Renderizar() {
    const tbody = document.getElementById("corpodalistadeprodutos");
    if (tbody) {
        var data = listadeprodutos.produtos;
        if (FILTRO.trim()) {
            const expReg = new RegExp(FILTRO.trim().replace(/[^\d\w]+/g, '.*'), 'i');
            data = data.filter(produto => {
                return expReg.test(produto.Produto) || expReg.test(produto.Preco);
            });
            
        }
        data = data.sort((a, b) => {
            return a.Produto.localeCompare(b.Produto);
        }).map(produto => {
            return `<tr>
                        <td>${produto.ID}</td>
                        <td>${produto.Produto}</td>
                        <td>${produto.Preco}</td>
                        <td>
                            <button onclick="editarProduto(${produto.ID})" id="botaoverder">Editar</button>
                            <button onclick="perguntarSeDeleta(${produto.ID})" id="botaovermelho">Excluir</button>
                        </td>
                    </tr>`;
        }).join('');
        
        tbody.innerHTML = data;
    }
}

function editarProduto(ID) {
    var produto = listadeprodutos.produtos.find(produto => produto.ID == ID);
    if (produto) {
        var novoProduto = prompt("Digite o novo nome do produto:", produto.Produto);
        var novoPreco = prompt("Digite o novo preço do produto:", produto.Preco);
        if (novoProduto !== null && novoPreco !== null) {
            editUsuario(ID, novoProduto, novoPreco);
        }
    }
}

var FILTRO = ''

function pesquisar(value){
    FILTRO = value;
    Renderizar()
}

function submeter(e) {
    e.preventDefault()
}

window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastrar').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})