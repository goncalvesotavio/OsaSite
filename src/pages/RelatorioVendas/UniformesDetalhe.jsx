import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchVendasDeUmUniformePorPeriodo } from '../../lib/fetchFinanceiro';
import styles from './UniformesDetalhe.module.css';

import UniformeIcon from '../../assets/uniformes gestao.png';

export default function UniformesDetalhe() {
    const [searchParams] = useSearchParams();
    const id_uniforme = searchParams.get('id_uniforme');
    const nome = searchParams.get('nome');
    const img = searchParams.get('img');
    const precoBase = searchParams.get('precoBase');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    const [detalhesVenda, setDetalhesVenda] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id_uniforme || !dataInicio || !dataFim) return;

        const carregarDetalhes = async () => {
            setLoading(true);
            const vendas = await fetchVendasDeUmUniformePorPeriodo(Number(id_uniforme), dataInicio, dataFim);

            const agrupadoPorTamanho = vendas.reduce((acc, venda) => {
                const tamanho = venda.Estoque_uniforme?.Tamanho || 'N/A';
                if (!acc[tamanho]) {
                    acc[tamanho] = { tamanho: tamanho, quantidade: 0, valorTotal: 0 };
                }
                acc[tamanho].quantidade += venda.Qtd;
                acc[tamanho].valorTotal += venda.Preco_total;
                return acc;
            }, {});

            setDetalhesVenda(Object.values(agrupadoPorTamanho));
            setLoading(false);
        };
        carregarDetalhes();
    }, [id_uniforme, dataInicio, dataFim]);

    const valorTotalGeral = useMemo(() => {
        return detalhesVenda.reduce((soma, item) => soma + item.valorTotal, 0);
    }, [detalhesVenda]);

    if (loading) {
        return <main className={styles.loadingContainer}><div className={styles.spinner}></div></main>;
    }

    const backLinkParams = new URLSearchParams({ dataInicio, dataFim });

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to={`/relatorio-vendas/uniformes?${backLinkParams.toString()}`} className={styles.backButton}>
                    <FaArrowLeft size={24} />
                </Link>
                <img src={UniformeIcon} alt="Ícone de Uniformes" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Detalhe do Uniforme</h1>
            </header>

            <div className={styles.scrollContainer}>
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <img src={img} alt={nome} className={styles.mainImage} />
                    </div>
                    <h2 className={styles.uniformeTitle}>{nome}</h2>
                    <p className={styles.uniformePrice}>
                        {Number(precoBase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.tableHeader}>
                                    <th>Tamanho</th>
                                    <th style={{ textAlign: 'center' }}>Quantidade</th>
                                    <th style={{ textAlign: 'right' }}>Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhesVenda.map(item => (
                                    <tr key={item.tamanho} className={styles.tableRow}>
                                        <td>{item.tamanho}</td>
                                        <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            Valor total: {valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}