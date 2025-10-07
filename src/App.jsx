import React from 'react';
import { Routes, Route } from 'react-router-dom';

import TelaInicio from './pages/TelaInicio.jsx';
import Pedidos from './pages/Pedidos/Pedidos.jsx';
import DetalhesPedido from './pages/Pedidos/DetalhesPedido.jsx';
import RelatorioVendas from './pages/RelatorioVendas/RelatorioVendas.jsx';
import SelecionarDataRelatorio from './pages/RelatorioVendas/SelecionarDataRelatorio.jsx';
import UniformesResultado from './pages/RelatorioVendas/UniformesResultado.jsx';
import UniformesDetalhe from './pages/RelatorioVendas/UniformesDetalhe.jsx';
import GeralResultado from './pages/RelatorioVendas/GeralResultado.jsx';
import ArmariosResultado from './pages/RelatorioVendas/ArmariosResultado.jsx';
import EstoqueUniformes from './pages/EstoqueUniformes/EstoqueUniformes.jsx';
import DetalheEstoqueUniforme from './pages/EstoqueUniformes/DetalheEstoqueUniforme.jsx';
import EstoqueArmarios from './pages/EstoqueArmarios/EstoqueArmarios.jsx';
import DetalheCorredor from './pages/EstoqueArmarios/DetalheCorredor.jsx';
import ContratoArmario from './pages/EstoqueArmarios/ContratoArmario.jsx';
import DetalheArmario from './pages/EstoqueArmarios/DetalheArmario.jsx';
import ControleContrato from './pages/ControleContrato/ControleContrato.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TelaInicio />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/pedidos/:id" element={<DetalhesPedido />} />
      <Route path="/controle-contrato" element={<ControleContrato />} />
      
      <Route path="/estoque-uniformes" element={<EstoqueUniformes />} />
      <Route path="/estoque-uniformes/:id" element={<DetalheEstoqueUniforme />} />

      <Route path="/estoque-armarios" element={<EstoqueArmarios />} />
      <Route path="/estoque-armarios/contrato" element={<ContratoArmario />} />
      <Route path="/estoque-armarios/:id" element={<DetalheCorredor />} />
      <Route path="/estoque-armarios/detalhe/:n_armario" element={<DetalheArmario />} />

      <Route path="/relatorio-vendas" element={<RelatorioVendas />} />
      <Route path="/relatorio-vendas/:tipo" element={<SelecionarDataRelatorio />} />
      <Route path="/relatorio-vendas/uniformes-resultado" element={<UniformesResultado />} />
      <Route path="/relatorio-vendas/uniformes-detalhe" element={<UniformesDetalhe />} />
      <Route path="/relatorio-vendas/armarios-resultado" element={<ArmariosResultado />} />
      <Route path="/relatorio-vendas/geral-resultado" element={<GeralResultado />} />
    </Routes>
  );
}

export default App;