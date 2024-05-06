import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Produto, Veiculo, VeiculoProduto } from "../model/produto.model";
import { computed } from "@angular/core";

type MontagemVeiculosState = {
    produtos: Produto[];
    veiculos: Veiculo[];
    caminhaoSelecionado: string;
};

const initialState: MontagemVeiculosState = { 
    produtos: [],
    veiculos: [],
    caminhaoSelecionado: ""
};

export const MontagemVeiculosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),

    withMethods((store) => ({ 

        async loadAllProducts() {

            const produtos: Produto[] = [
                { id: "1", produto: "Produto 1", peso: 100, palletTotal: 1, complemento: false, veiculo: [{quantidadePallets: 1, veiculoId: "1"}], fatorHectoLitro: 10 },
                { id: "2", produto: "Produto 2", peso: 200, palletTotal: 2, complemento: false, veiculo: [{quantidadePallets: 2, veiculoId: "2"}], fatorHectoLitro: 20 },
                { id: "3", produto: "Produto 3", peso: 300, palletTotal: 3, complemento: false, veiculo: [{quantidadePallets: 3, veiculoId: "3"}], fatorHectoLitro: 30 },
            ] 

            patchState(store, { produtos });    
        },

        async loadAllVeiculos() {
                
                const veiculos: Veiculo[] = [
                    { id: "1", veiculoProprio: true, equipamento: "Veiculo 1", quantidadePallets: 10, capacidadePeso: 1000 },
                    { id: "2", veiculoProprio: true, equipamento: "Veiculo 2", quantidadePallets: 20, capacidadePeso: 2000 },
                    { id: "3", veiculoProprio: true, equipamento: "Veiculo 3", quantidadePallets: 30, capacidadePeso: 3000 },
                ] 
    
                patchState(store, { veiculos });
        },

        getProdutosByCarroId(veiculoId: string) {
            return computed(() => store.produtos().filter(produto => produto.veiculo.some(v => v.veiculoId === veiculoId)));
        },

        getQuantidadeProdutoCarregada(produtoId: string) {
            return computed(() => store.produtos().find(produto => produtoId === produto.id)?.veiculo.reduce((acc, v) => acc + v.quantidadePallets, 0) || 0);
        },

        addProdutoNoVeiculo(produtoId: string, veiculoId: string) {
          
            const produtos = store.produtos().map(p => {
                if (p.id === produtoId) {
                    const veiculo = p.veiculo.find(v => v.veiculoId === veiculoId);

                    if (veiculo) {
                        veiculo.quantidadePallets += 1;
                    } else {
                        p.veiculo.push({ veiculoId, quantidadePallets: 1 });
                    }
                }
                return p;
            });

            patchState(store, { produtos });
        },

        selecionarCaminhao(caminhaoSelecionado: string) {
            patchState(store, { caminhaoSelecionado });
        }
    })),

    withComputed((store) => ({

        quantidadesPalletsCarregados: computed(() => {

            let veiculos: VeiculoProduto[] = [];
            
            store.produtos().forEach(p => {

                p.veiculo.forEach(v => {
                    
                    const veiculo = veiculos.find(veiculo => veiculo.veiculoId === v.veiculoId);
                    if (veiculo) {
                        veiculo.quantidadePallets += v.quantidadePallets;
                    } else {
                        veiculos.push({veiculoId: v.veiculoId, quantidadePallets: v.quantidadePallets});
                    }

                });
            });

            return veiculos;
        }
        
        )
    }))


)