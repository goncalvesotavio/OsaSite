import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FiDollarSign } from 'react-icons/fi';
import { fetchVendasArmariosPorPeriodo, fetchVendasUniformesPorPeriodo } from '../../lib/fetchFinanceiro';
import styles from './GeralResultado.module.css';

import UniformeIcon from '../../assets/uniformes gestao.png';
import ArmarioIcon from '../../assets/armarios gestao.png';

const VendaItem = ({ item }) => {
    const iconSource = item.tipo === 'uniforme' ? UniformeIcon : ArmarioIcon;
    return (
        <div className={styles.itemRow}>
            <img src={iconSource} alt={item.tipo} className={styles.itemIcon} />
            <div className={styles.itemDetails}>
                <p className={styles.itemText}>{item.descricao}</p>
                <p className={styles.itemDate}>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
            </div>
            <p className={styles.itemValue}>
                {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
    );
};

export default function GeralResultado() {
    const [searchParams] = useSearchParams();
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    
    const [itensRelatorio, setItensRelatorio] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dataInicio || !dataFim) return;

        const carregarRelatorio = async () => {
            setLoading(true);
            const [vendasUniformes, vendasArmarios] = await Promise.all([
                fetchVendasUniformesPorPeriodo(dataInicio, dataFim),
                fetchVendasArmariosPorPeriodo(dataInicio, dataFim)
            ]);

            const itensUniformes = vendasUniformes.map(v => ({
                id: `u-${v.id}`,
                data: v['Vendas-2025'].Data,
                tipo: 'uniforme',
                descricao: v.Uniformes.Nome,
                valor: v.Preco_total
            }));

            const itensArmarios = vendasArmarios.map(v => ({
                id: `a-${v.id}`,
                data: v['Vendas-2025'].Data,
                tipo: 'armario',
                descricao: `Armário Nº ${v.N_armario}`,
                valor: v.Armários.preco
            }));
            
            const todosOsItens = [...itensUniformes, ...itensArmarios];
            todosOsItens.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

            setItensRelatorio(todosOsItens);
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const valorTotalArrecadado = useMemo(() => {
        return itensRelatorio.reduce((soma, item) => soma + item.valor, 0);
    }, [itensRelatorio]);

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
                <FiDollarSign size={30} className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Relatório Geral</h1>
            </header>

            <div className={styles.summaryContainer}>
                <p className={styles.summaryText}>De: <strong>{formatarData(dataInicio)}</strong> até <strong>{formatarData(dataFim)}</strong></p>
                <p className={styles.summaryTextBold}>Valor total arrecadado: {valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>

            <div className={styles.listContainer}>
                <h2 className={styles.listHeader}>Todas as Transações no Período</h2>
                {itensRelatorio.map((item) => (
                    <VendaItem key={item.id} item={item} />
                ))}
            </div>
        </main>
    );
}