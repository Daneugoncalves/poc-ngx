export type Produto = {
    id: string,
    produto: string,
    peso: number,
    palletTotal: number,
    complemento: boolean,
    fatorHectoLitro: number,
    palletsCarregados: number,
}

export type Veiculo = {
    id: string,
    veiculoProprio: boolean,
    equipamento: string,
    quantidadePallets: number,
    capacidadePeso: number,
    palletsCarregados: number,
    produtos: VeiculoProduto[],
}

export type VeiculoProduto = {
    produtoId: string,
    produto: string,
    fatorHectoLitro: number,
    peso: number,
    quantidadePallets: number,
    palletsCarregados: number,
}