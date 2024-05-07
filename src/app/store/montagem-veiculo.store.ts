import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Produto, Veiculo, VeiculoProduto } from '../model/produto.model';
import { computed, inject } from '@angular/core';
import { MontagemService } from './add-produto-veiculo.service';

type MontagemVeiculosState = {
  produtos: Produto[];
  veiculos: Veiculo[];
  caminhaoSelecionado: string;
};

const initialState: MontagemVeiculosState = {
  produtos: [],
  veiculos: [],
  caminhaoSelecionado: '',
};

export const MontagemVeiculosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, montagemService = inject(MontagemService)) => ({
    async loadAllProducts() {
      const produtos: Produto[] = [
        {
          id: '1',
          produto: 'Produto 1',
          peso: 100,
          palletTotal: 1,
          complemento: false,
          fatorHectoLitro: 10,
          palletsCarregados: 0,
        },
        {
          id: '2',
          produto: 'Produto 2',
          peso: 200,
          palletTotal: 2,
          complemento: false,
          fatorHectoLitro: 20,
          palletsCarregados: 0,
        },
        {
          id: '3',
          produto: 'Produto 3',
          peso: 300,
          palletTotal: 3,
          complemento: false,
          fatorHectoLitro: 30,
          palletsCarregados: 0,
        },
        {
          id: '4',
          produto: 'Produto 4',
          peso: 400,
          palletTotal: 4,
          complemento: false,
          fatorHectoLitro: 40,
          palletsCarregados: 0,
        },
        {
          id: '5',
          produto: 'Produto 5',
          peso: 500,
          palletTotal: 5,
          complemento: false,
          fatorHectoLitro: 50,
          palletsCarregados: 0,
        },
      ];

      patchState(store, { produtos });
    },

    async loadAllVeiculos() {
      const veiculos: Veiculo[] = [
        {
          id: '1',
          veiculoProprio: true,
          equipamento: 'Veiculo 1',
          quantidadePallets: 10,
          capacidadePeso: 1000,
          palletsCarregados: 0,
          produtos: [],
        },
        {
          id: '2',
          veiculoProprio: true,
          equipamento: 'Veiculo 2',
          quantidadePallets: 20,
          capacidadePeso: 2000,
          palletsCarregados: 0,
          produtos: [],
        },
        {
          id: '3',
          veiculoProprio: true,
          equipamento: 'Veiculo 3',
          quantidadePallets: 30,
          capacidadePeso: 3000,
          palletsCarregados: 0,
          produtos: [],
        },
      ];

      patchState(store, { veiculos });
    },

    addProdutoNoVeiculo(produtoId: string) {
        const veiculo = store.veiculos().find(
            (veiculo) => veiculo.id === store.caminhaoSelecionado()
        );

        const produto = store.produtos().find(
            (produto) => produto.id === produtoId
        );

        if (produto && veiculo && veiculo.quantidadePallets > veiculo.palletsCarregados) {
            const quantidadePalletsDisponiveis = produto.palletTotal - produto.palletsCarregados;
            const quantidadePalletsDisponiveisNoCarro = veiculo.quantidadePallets - veiculo.palletsCarregados;

            const produtoVeiculo: VeiculoProduto = {
                produtoId: produto.id,
                produto: produto.produto,
                fatorHectoLitro: produto.fatorHectoLitro,
                peso: produto.peso,
                quantidadePallets: quantidadePalletsDisponiveis <= quantidadePalletsDisponiveisNoCarro ? quantidadePalletsDisponiveis : quantidadePalletsDisponiveisNoCarro,
                palletsCarregados: produto.palletsCarregados + quantidadePalletsDisponiveis <= quantidadePalletsDisponiveisNoCarro ? quantidadePalletsDisponiveis : quantidadePalletsDisponiveisNoCarro,
            };

            const novoVeiculo: Veiculo = {
                ...veiculo,
                produtos: veiculo.produtos.map((produto) => {
                    if (produto.produtoId === produtoVeiculo.produtoId) {
                        return {
                            ...produto,
                            quantidadePallets: produto.quantidadePallets + produtoVeiculo.quantidadePallets,
                        };
                    }
                    return produto;
                }),
                palletsCarregados: produtoVeiculo.quantidadePallets + veiculo.palletsCarregados,
            };

            if (!veiculo.produtos.some((produto) => produto.produtoId === produtoVeiculo.produtoId)) {
                novoVeiculo.produtos.push(produtoVeiculo);
            }

            patchState(store, (state) => ({
                veiculos: state.veiculos.map((veiculo) =>
                    veiculo.id === store.caminhaoSelecionado() ? novoVeiculo : veiculo
                ),

                produtos: state.produtos.map((produto) => {
                    if (produto.id === produtoId) {
                        return {
                            ...produto,
                            palletsCarregados: produto.palletsCarregados + produtoVeiculo.quantidadePallets,
                        };
                    }
                    return produto;
                })
            }));
        }
    },

    excluirProdutoDoVeiculo(produtoId: string) {
        const veiculo = store.veiculos().find(
            (veiculo) => veiculo.id === store.caminhaoSelecionado()
        );

        const produto = store.produtos().find(
            (produto) => produto.id === produtoId
        );

        if (produto && veiculo) {
            const produtoVeiculo = veiculo.produtos.find(
                (produto) => produto.produtoId === produtoId
            );

            if (produtoVeiculo) {
                const novoVeiculo: Veiculo = {
                    ...veiculo,
                    produtos: veiculo.produtos.filter(
                        (produto) => produto.produtoId !== produtoId
                    ),
                    palletsCarregados: veiculo.palletsCarregados - produtoVeiculo.quantidadePallets,
                };

                patchState(store, (state) => ({
                    veiculos: state.veiculos.map((veiculo) =>
                        veiculo.id === store.caminhaoSelecionado() ? novoVeiculo : veiculo
                    ),

                    produtos: state.produtos.map((produto) => {
                        if (produto.id === produtoId) {
                            return {
                                ...produto,
                                palletsCarregados: produto.palletsCarregados - produtoVeiculo.quantidadePallets,
                            };
                        }
                        return produto;
                    })
                }));
            }
        }
    },

    adicionarQuantidadePalles(produtoId: string){
        const veiculo = store.veiculos().find(
            (veiculo) => veiculo.id === store.caminhaoSelecionado()
        );

        if (veiculo) {
            const novoVeiculo: Veiculo = {
                ...veiculo,
                quantidadePallets: veiculo.quantidadePallets + 1,
            };

            patchState(store, (state) => ({
                veiculos: state.veiculos.map((veiculo) =>
                    veiculo.id === store.caminhaoSelecionado() ? novoVeiculo : veiculo
                ),
                produtos: state.produtos.map((produto) => {
                    if (produto.id === produtoId) {
                        return {
                            ...produto,
                            palletsCarregados: produto.palletsCarregados + 1,
                        };
                    }
                    return produto;
                })
            }));
        }
    },

    subtrairQuantidadePalles(produtoId: string){
        const veiculo = store.veiculos().find(
            (veiculo) => veiculo.id === store.caminhaoSelecionado()
        );

        if (veiculo) {
            const novoVeiculo: Veiculo = {
                ...veiculo,
                quantidadePallets: veiculo.quantidadePallets - 1,
            };

            patchState(store, (state) => ({
                veiculos: state.veiculos.map((veiculo) =>
                    veiculo.id === store.caminhaoSelecionado() ? novoVeiculo : veiculo
                ),
                produtos: state.produtos.map((produto) => {
                    if (produto.id === produtoId) {
                        return {
                            ...produto,
                            palletsCarregados: produto.palletsCarregados + 1,
                        };
                    }
                    return produto;
                })
            }));
        }
    },

    selecionarCaminhao(caminhaoSelecionado: string) {
      patchState(store, { caminhaoSelecionado });
    },
  })),

  withComputed((store) => ({
    carroSelecionadoCheio: computed(() => {
        const veiculo = store.veiculos().find(
            (veiculo) => veiculo.id === store.caminhaoSelecionado()
        );
    
        return veiculo?.quantidadePallets === veiculo?.palletsCarregados;
    }),
  }))
);
