import { supabase } from './supabase.js'

export async function arrecadacaoTotal() {
  const { data, error } = await supabase
    .from('Vendas-2025')
    .select('Total')
    .eq('Compra_finalizada', true)

  if (error) {
    console.error('Erro ao buscar arrecadação total: ', error)
    return 0
  }

  const totalArrecadado = data?.reduce((soma, venda) => soma + (venda.Total || 0), 0) || 0
  return totalArrecadado
}

export async function arrecadacaoTotalUniformes() {
  const { data, error } = await supabase
    .from('Vendas_uniformes')
    .select('Preco_total, Vendas-2025!inner(Compra_finalizada)')
    .eq('Vendas-2025.Compra_finalizada', true)

  if (error) {
    console.error('Erro ao buscar arrecadação de uniformes: ', error)
    return 0
  }

  const totalUniformesArrecadados = data?.reduce((soma, venda) => soma + (venda.Preco_total || 0), 0) || 0
  return totalUniformesArrecadados
}

export async function arrecadacaoUniforme(id_uniforme) {
  const { data, error } = await supabase
    .from('Vendas_uniformes')
    .select('Preco_total, Vendas-2025!inner(Compra_finalizada)')
    .eq('id_uniforme', id_uniforme)
    .eq('Vendas-2025.Compra_finalizada', true)

  if (error) {
    console.error('Erro ao buscar arrecadação do uniforme: ', error)
    return 0
  }

  const uniformeArrecadados = data?.reduce((soma, venda) => soma + (venda.Preco_total || 0), 0) || 0
  return uniformeArrecadados
}

export async function arrecadacaoUniformeTamanho(id_estoque) {
  const { data, error } = await supabase
    .from('Vendas_uniformes')
    .select('Preco_total, Vendas-2025!inner(Compra_finalizada)')
    .eq('Vendas-2025.Compra_finalizada', true)
    .eq('Tamanho', id_estoque)

  if (error) {
    console.error('Erro ao buscar arrecadação do tamanho do uniforme: ', error)
    return 0
  }

  const uniformeTamanhoArrecadados = data?.reduce((soma, venda) => soma + (venda.Preco_total || 0), 0) || 0
  return uniformeTamanhoArrecadados
}

export async function arrecadacaoArmarios() {
  const { data, error } = await supabase
    .from('Armários')
    .select(`preco: "Preco(R$)"`)
    .eq('Disponivel', false)

  if (error) {
    console.error('Erro ao buscar arrecadação dos armários: ', error)
    return 0
  }

  const arrecadacaoArmarios = data?.reduce((soma, armario) => soma + (armario.preco || 0), 0) || 0
  return arrecadacaoArmarios
}

export async function fetchVendasUniformesPorPeriodo(dataInicio, dataFim) {
  const { data, error } = await supabase
    .from('Vendas_uniformes')
    .select(`id, Qtd, Preco_total, Uniformes (*), Vendas-2025!inner (Data, Compra_finalizada)`)
    .gte('Vendas-2025.Data', dataInicio)
    .lte('Vendas-2025.Data', dataFim)
    .eq('Vendas-2025.Compra_finalizada', true)

  if (error) {
    console.error("Erro ao buscar vendas de uniformes por período: ", error)
    return []
  }

  return data
}

export async function fetchVendasDeUmUniformePorPeriodo(id_uniforme, dataInicio, dataFim) {
  const { data, error } = await supabase
    .from('Vendas_uniformes')
    .select(`Qtd, Preco_total, Estoque_uniforme(Tamanho), Uniformes!inner(id_uniforme), Vendas-2025!inner(Data, Compra_finalizada)`)
    .eq('Uniformes.id_uniforme', id_uniforme)
    .eq('Vendas-2025.Compra_finalizada', true)
    .gte('Vendas-2025.Data', dataInicio)
    .lte('Vendas-2025.Data', dataFim)

  if (error) {
    console.error("Erro ao buscar vendas detalhadas do uniforme: ", error)
    return []
  }

  return data
}

export async function fetchVendasArmariosPorPeriodo(dataInicio, dataFim) {
  const { data, error } = await supabase
    .from('Vendas_armários')
    .select(`
      id,
      N_armario,
      Armários(preco: "Preco(R$)"),
      Vendas-2025!inner(Data, Pago)
    `)
    .gte('Vendas-2025.Data', dataInicio)
    .lte('Vendas-2025.Data', dataFim)
    .eq('Vendas-2025.Pago', true)

  if (error) {
    console.error("Erro ao buscar vendas de armários por período: ", error)
    return []
  }

  return data
}