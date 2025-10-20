import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchVendasArmariosPorPeriodo } from '../../lib/fetchFinanceiro';
import styles from './ArmariosResultado.module.css';

import ArmarioIcon from '../../assets/armarios gestao.png';

export default function ArmariosResultado() {
    const [searchParams] = useSearchParams();
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dataInicio || !dataFim) return;

        const carregarRelatorio = async () => {
            setLoading(true);
            const vendasData = await fetchVendasArmariosPorPeriodo(dataInicio, dataFim);
            setVendas(vendasData);
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const { valorTotalArrecadado, totalArmariosAlugados } = useMemo(() => {
        const total = vendas.reduce((soma, item) => soma + item.Armários.preco, 0);
        return {
            valorTotalArrecadado: total,
            totalArmariosAlugados: vendas.length
        };
    }, [vendas]);

    const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    if (loading) {
        return <main className={styles.loadingContainer}><div className={styles.spinner}></div></main>;
    }

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to="/relatorio-vendas" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <img src={ArmarioIcon} alt="Ícone de Armários" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Relatório de Armários</h1>
            </header>

            <div className={styles.contentContainer}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryHeader}>
                        <p>Resumo do Período</p>
                        <span>{formatarData(dataInicio)} a {formatarData(dataFim)}</span>
                    </div>
                    <div className={styles.summaryStats}>
                        <div className={styles.statItem}>
                            <p className={styles.statLabel}>Armários Alugados</p>
                            <p className={styles.statValue}>{totalArmariosAlugados}</p>
                        </div>
                        <div className={styles.statItem}>
                            <p className={styles.statLabel}>Valor Total Arrecadado</p>
                            <p className={`${styles.statValue} ${styles.totalValue}`}>
                                {valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.listContainer}>
                    <h2 className={styles.listHeader}>Detalhes das Vendas</h2>
                    <table className={styles.salesTable}>
                        <thead>
                            <tr>
                                <th>Armário Nº</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas.map((item, index) => (
                                <tr key={`${item.N_armario}-${index}`}>
                                    <td data-label="Armário Nº">{item.N_armario}</td>
                                    <td data-label="Valor">
                                        {item.Armários.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}