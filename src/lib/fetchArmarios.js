import { supabase } from './supabase.js';

export async function fetchArmarios() {
    const { data, error } = await supabase
        .from('Armários')
        .select(`
            N_armario,
            Corredor,
            preco: "Preco(R$)",
            Disponivel
        `);

    if (error) {
        console.error('Erro ao buscar armários: ', error);
        return [];
    }

    return data;
}

export async function buscarArmario(n_armario) {
    const { data, error } = await supabase
        .from('Armários')
        .select(`
            N_armario,
            Corredor,
            preco: "Preco(R$)",
            Disponivel,
            Funcional,
            Vendas_armários(id_venda, Contrato)
        `)
        .eq('N_armario', n_armario);

    if (error) {
        console.error('Erro ao buscar armários: ', error);
        return [];
    }

    return data;
}

export async function buscarClienteArmario(id_venda) {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            Clientes(
            Nome,
            RM,
            Tipo_curso,
            Curso,
            Serie)
        `)
        .eq('id_venda', id_venda);

    if (error) {
        console.error('Erro ao buscar dono do armário: ', error);
        return [];
    }

    return data;
}

export async function fetchVendaPorId(id_venda) {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select('Data')
        .eq('id_venda', id_venda)
        .single();

    if (error) {
        console.error('Erro ao buscar dados da venda:', error);
        return null;
    }

    return data;
}

export async function mudarDisponibilidadeArmario(n_armario, novoStatus) {
    const { error } = await supabase
        .from('Armários')
        .update({ Disponivel: novoStatus })
        .eq('N_armario', n_armario);

    if (error) {
        console.error('Erro ao atualizar disponibilidade do armário: ', error);
    }
}

export async function fetchPrecoPadraoArmario() {
    const { data, error } = await supabase
        .from('Armários')
        .select('preco: "Preco(R$)"')
        .limit(1)
        .single();

    if (error) {
        console.error('Erro ao buscar preço do armário:', error);
        return null;
    }
    return data?.preco;
}

export async function marcarArmarioQuebrado(n_armario) {
    const { error } = await supabase
        .from('Armários')
        .update({ Funcional: false })
        .eq('N_armario', n_armario);

    if (error) console.error('Erro ao marcar armário como quebrado:', error);
    return { error };
}

export async function cancelarAluguelArmario(n_armario, id_venda) {
    try {
        const { error: deleteError } = await supabase.from('Vendas_armários').delete().eq('id_venda', id_venda);
        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase.from('Armários').update({ Disponivel: true }).eq('N_armario', n_armario);
        if (updateError) throw updateError;

        return { error: null };
    } catch (error) {
        console.error('Erro ao cancelar aluguel:', error);
        return { error };
    }
}

export async function marcarArmarioConsertado(n_armario) {
    const { error } = await supabase
        .from('Armários')
        .update({ Funcional: true, Disponivel: true })
        .eq('N_armario', n_armario);

    if (error) console.error('Erro ao marcar armário como consertado:', error);
    return { error };
}

export async function buscarStatusArmarios() {
    const { data, error } = await supabase
        .from('Armários')
        .select('N_armario, Disponivel, Funcional');

    if (error) {
        console.error("Erro ao buscar status dos armários:", error);
        return [];
    }

    const processedData = data.map(armario => {
        let status = 'Disponível';
        if (armario.Funcional === false) {
            status = 'Quebrado';
        } else if (armario.Disponivel === false) {
            status = 'Alugado';
        }
        return {
            N_armario: armario.N_armario,
            Status: status,
        };
    });

    return processedData;
}