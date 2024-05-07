import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MontagemVeiculosStore } from './store/montagem-veiculo.store';
import { CommonModule, JsonPipe } from '@angular/common';
import { Veiculo } from './model/produto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  store = inject(MontagemVeiculosStore);

  ngOnInit(): void {
    this.store.loadAllProducts().then(() => {console.log('Products loaded')});
    this.store.loadAllVeiculos().then(() => {console.log('Veiculos loaded')});
  }

  calcularProdutosNoCaminhao(veiculo: Veiculo) {
    return veiculo.produtos.reduce((acc, produto) => {
      return acc + produto.palletsCarregados;
    }, 0);
  }

  addProdutoAoCaminhaoSelecionado(produtoId: string) {
    this.store.addProdutoNoVeiculo(produtoId);
  }

  selecionarCaminhao(caminhaoId: string) {
    this.store.selecionarCaminhao(caminhaoId);
  }
}
