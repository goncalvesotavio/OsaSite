import { supabase } from './supabase.js';

export async function fetchContrato(ano) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .select("Contrato")
      .eq("Ano", ano);

    if (error) {
        console.error("Erro ao buscar armários: ", error);
    }

    return data;
}

export async function salvarContrato(file, nomeArquivo) {
    try {
        const filePath = `Contratos/${nomeArquivo}`;

        const { error: uploadError } = await supabase.storage
          .from("arquivos")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("arquivos").getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        console.log("Arquivo salvo com sucesso:", publicUrl);
        return publicUrl;
    } catch (err) {
        console.error("Erro ao salvar arquivo:", err);
        return null;
    }
}

export async function atualizarURLContrato(ano, url) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .update([{ Contrato: url }])
      .eq("Ano", ano);

    if (error) {
        console.error("Erro ao atualizar a URL do contrato: ", error);
    }
}

export async function novoURLContrato(ano, url) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .insert([{ Ano: ano, Contrato: url }]);

    if (error) {
        console.error("Erro ao inserir a URL do contrato: ", error);
    }
}

export async function buscarDatas(ano) {
    const { data, error } = await supabase
      .from('Contratos_armários')
      .select(`
        Data_anual,
        Data_semestral
      `)
      .eq('Ano', ano);

    if (error) {
        console.error("Erro ao buscar as datas dos armários: ", error);
    }

    return data || [];
}

export async function novasDatas(ano, dataAnual, dataSemestral) {
    const { error } = await supabase
      .from('Contratos_armários')
      .update({ Data_anual: dataAnual, Data_semestral: dataSemestral })
      .eq("Ano", ano);

    if (error) {
        console.error("Erro ao atualizar as datas dos armários: ", error);
    }
}

export async function novoPreco(preco) {
    const { error } = await supabase
      .from('Armários')
      .update({ 'Preco(R$)': preco })
      .neq('N_armario', -1);

    if (error) {
        console.error("Erro ao atualizar o preço do aluguel: ", error);
    }
}