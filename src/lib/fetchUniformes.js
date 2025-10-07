import { supabase } from './supabase.js'

export async function fetchUniformes() {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
      id_uniforme,
      Nome,
      Img,
      Preço,
      Categoria,
      Estoque_uniforme(Qtd_estoque)
    `)

  if (error || !data) {
    console.error('Erro ao buscar uniformes:', error)
    return []
  }

  return data
}

export async function buscarUniforme(id_uniforme) {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
      id_uniforme,
      Nome,
      Img,
      Preço,
      Categoria,
      Estoque_uniforme(Qtd_estoque)
    `)
    .eq('id_uniforme', id_uniforme)

  if (error || !data) {
    console.error('Erro ao buscar uniformes:', error)
    return []
  }

  const produtos = data.map(item => {
    const totalEstoque = item.Estoque_uniforme
      ? item.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
      : 0

    return {
      ...item,
      somaEstoque: totalEstoque
    }
  })

  return produtos
}

export async function detalhesEstoque(id_uniforme) {
  const { data, error } = await supabase
    .from('Estoque_uniforme')
    .select(`
        id_estoque,
        Tamanho,
        Qtd_estoque
      `)
    .eq('id_uniforme', id_uniforme)

  if (error) {
    console.error('Erro ao buscar estoque de uniformes:', error)
    return []
  }

  return data
}

export async function atualizarEstoque(id_estoque, novaQtd) {
  const { data, error } = await supabase
    .from('Estoque_uniforme')
    .update({ Qtd_estoque: novaQtd })
    .eq('id_estoque', id_estoque)

  if (error) {
    console.error('Erro ao atualizar estoque: ', error)
  }
}