import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MontagemVeiculosStore } from './store/montagem-veiculo.store';
import { CommonModule, JsonPipe } from '@angular/common';

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

  calcularProdutosNoCaminhao(veiculoId: string) {
    return computed(() => this.store.getProdutosByCarroId(veiculoId)().reduce((acc, produto) => acc + produto.palletTotal, 0));
  }

  addProdutoAoCaminhaoSelecionado(produtoId: string) {
    this.store.addProdutoNoVeiculo(produtoId, this.store.caminhaoSelecionado());
  }

  selecionarCaminhao(caminhaoId: string) {
    this.store.selecionarCaminhao(caminhaoId);
  }
}
