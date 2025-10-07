import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchVendasArmariosPorPeriodo } from '../../lib/fetchFinanceiro';
import styles from './ArmariosResultado.module.css';

import ArmarioIcon from '../../assets/armarios gestao.png';

const VendaItem = ({ item }) => (
    <div className={styles.itemRow}>
        <p className={styles.itemText}>Armário Nº {item.N_armario}</p>
        <p className={styles.itemValue}>
            {item.Armários.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
    </div>
);

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

    const valorTotalArrecadado = useMemo(() => {
        return vendas.reduce((soma, item) => soma + item.Armários.preco, 0);
    }, [vendas]);

    const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

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

            <div className={styles.summaryContainer}>
                <p className={styles.summaryText}>De: <strong>{formatarData(dataInicio)}</strong> até <strong>{formatarData(dataFim)}</strong></p>
                <p className={styles.summaryTextBold}>Valor total arrecadado: {valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>

            <div className={styles.listContainer}>
                <h2 className={styles.listHeader}>Armários Alugados no Período</h2>
                {vendas.map((item, index) => (
                    <VendaItem key={`${item.N_armario}-${index}`} item={item} />
                ))}
            </div>
        </main>
    );
}