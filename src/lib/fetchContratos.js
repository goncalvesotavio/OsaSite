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

export async function salvarContrato(file) {
  try {
    const base64 = file.base64; // sempre vem da web

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const uint8Array = new Uint8Array(byteNumbers);

    const safeFileName = file.name
      .replace(/\s/g, "_")
      .replace(/\[|\]/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const { data, error } = await supabase.storage
      .from("arquivos")
      .upload(`Contratos/2025/${safeFileName}`, uint8Array, {
        contentType: file.mimeType,
        upsert: true,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("arquivos")
      .getPublicUrl(`Contratos/2025/${safeFileName}`);

    await atualizarURLContrato(new Date().getFullYear(), publicData.publicUrl);
    console.log("🌍 URL pública:", publicData.publicUrl);

    return publicData.publicUrl;
  } catch (err) {
    console.error("❌ Erro ao salvar arquivo:", err);
    return null;
  }
}

export async function atualizarURLContrato(ano, url) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .update({ Contrato: url })
      .eq("Ano", ano)

      if (error) {
        console.error("Erro ao atualizar a URL do contrato: ", error)
      }
}

export async function novoURLContrato(ano, url) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .insert([{ Contrato: url }])
      .eq("Ano", ano)

      if (error) {
        console.error("Erro ao atualizar a URL do contrato: ", error)
      }
}

export async function buscarDatas(ano) {
  const { data, error } = await supabase
    .from('Contratos_armários')
    .select(`
      Data_anual,
      Data_semestral
    `)
    .eq('Ano', ano)

    if (error) {
      console.error("Erro ao buscar as datas dos armários: ", error)
    }

    return data || []
}

export async function novasDatas(ano, dataAnual, dataSemestral) {
  const { error } = await supabase
    .from('Contratos_armários')
    .update({ Data_anual: dataAnual, Data_semestral: dataSemestral})
    .eq("Ano", ano)

    if (error) {
      console.error("Erro ao atualizar as datas dos armários: ", error)
    }
}

export async function novoPreco(preco) {
  const { error } = await supabase
    .from('Armários')
    .update({ 'Preco(R$)': preco})
    .neq('N_armario', -1)

    if (error) {
      console.error("Erro ao atualizar o preço do aluguel: ", error)
    }
}