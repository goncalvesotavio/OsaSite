import { supabase } from "./supabase.js"

export async function fetchPedidosFinalizados() {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            id_venda,
            Data,Total,
            Pago,
            Clientes(Nome)`)
        .eq('Compra_finalizada', true)

    if (error) console.error('Erro ao buscar pedidos:', error)

    return data
}

export async function fetchPedidosPendentes() {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            id_venda,
            Data,Total,
            Pago,
            Clientes(Nome)
        `)
        .eq('Compra_finalizada', false)

    if (error) console.error('Erro ao buscar pedidos:', error)

    return data
}

export async function fetchPedido(id_venda) {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            id_venda,
            Data,
            Forma_de_pagamento,
            Total,
            Pago,
            Compra_finalizada,
            Clientes(Nome)
        `)
        .eq('id_venda', id_venda)

    if (error) console.error('Erro ao buscar pedido:', error)

    return data
}

export async function fetchDetalhesPedidosUniforme(id_venda) {
    const { data, error } = await supabase
        .from('Vendas_uniformes')
        .select(`
            id,
            Qtd,
            Preco_total,
            Uniformes(Nome),
            Estoque_uniforme(Tamanho)`)
        .eq('id_venda', id_venda)

    if (error) console.error('Erro ao buscar detalhes de uniformes:', error)

    return data
}

export async function fetchDetalhesPedidosArmario(id_venda) {
    const { data, error } = await supabase
        .from('Vendas_armários')
        .select(`
            id,
            N_armario,
            Armários(preco_final:"Preco(R$)" )
        `)
        .eq('id_venda', id_venda)

    if (error) {
        console.error('Erro ao buscar detalhes de armários:', error)
    }

    return data
}

export async function updateStatusPagamento(id_venda, novoStatus) {
    const { error } = await supabase
        .from('Vendas-2025')
        .update({ Pago: novoStatus })
        .eq('id_venda', id_venda)

    if (error) console.error('Erro ao atualizar pagamento:', error)

    return { error }
}

export async function updateCompraFinalizada(id_venda, novoStatus) {
    const { error } = await supabase
        .from('Vendas-2025')
        .update({ Compra_finalizada: novoStatus })
        .eq('id_venda', id_venda)

    if (error) console.error('Erro ao finalizar compra:', error)

    return { error }
}

export async function checkIfVendaHasUniformes(id_venda) {
    const { data, error } = await supabase
        .from('Vendas_uniformes')
        .select('id')
        .eq('id_venda', id_venda)
        .limit(1)

    if (error) console.error('Erro ao checar uniformes na venda:', error)

    return data && data.length > 0;
}

export async function deletePedido(id_venda) {
    try {
        const { data } = await supabase
            .from('Vendas_uniformes')
            .select(`
      Tamanho,
      Qtd
    `)
            .eq('id_venda', id_venda)

        if (data && data.length > 0) {
            for (const venda of data) {
                await mudarEstoque(venda.Tamanho, venda.Qtd)
            }
        }

        await supabase
            .from('Vendas_uniformes')
            .delete()
            .eq('id_venda', id_venda)

        const { data: dataArmario } = await supabase
            .from('Vendas_armários')
            .select('N_armario')
            .eq('id_venda', id_venda)

        if (dataArmario && dataArmario.length > 0) {
            for (const venda of dataArmario) {
                await mudarArmario(venda.N_armario)
            }
        }

        await supabase
            .from('Vendas_armários')
            .delete()
            .eq('id_venda', id_venda)

        const { error } = await supabase
            .from('Vendas-2025')
            .delete()
            .eq('id_venda', id_venda)

        if (error) throw error

        return { error: null }
    } catch (error) {
        console.error('Erro ao deletar pedido:', error)
        return { error }
    }
}

export async function mudarEstoque(Tamanho, Qtd) {
    const { data, error: selectError } = await supabase
        .from('Estoque_uniforme')
        .select('Qtd_estoque')
        .eq('id_estoque', Tamanho)
        .single()

    if (selectError) {
        console.error("Erro ao buscar estoque:", selectError)
        return
    }

    const novoValor = (data?.Qtd_estoque || 0) + Qtd

    const { error: updateError } = await supabase
        .from('Estoque_uniforme')
        .update({ Qtd_estoque: novoValor })
        .eq('id_estoque', Tamanho)

    if (updateError) {
        console.error("Erro ao atualizar estoque:", updateError)
    }
}

export async function mudarArmario(n_armario) {
    const { error } = await supabase
        .from('Armários')
        .update({ Disponivel: 'true' })
        .eq('N_armario', n_armario)

    if (error) {
        console.error('Erro ao mudar armário: ', error)
    }
}