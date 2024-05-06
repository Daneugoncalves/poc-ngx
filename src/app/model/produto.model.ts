export type Produto = {
    id: string,
    produto: string,
    peso: number,
    palletTotal: number,
    complemento: boolean,
    veiculo: VeiculoProduto[],
    fatorHectoLitro: number,
}

export type Veiculo = {
    id: string,
    veiculoProprio: boolean,
    equipamento: string,
    quantidadePallets: number,
    capacidadePeso: number
}

export type VeiculoProduto = {
    veiculoId: string,
    quantidadePallets: number,
}