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
        <tr className={styles.tableRow}>
            <td data-label="Item" className={styles.itemCell}>
                <img src={iconSource} alt={item.tipo} className={styles.itemIcon} />
                <span>{item.descricao}</span>
            </td>
            <td data-label="Data">{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
            <td data-label="Valor">
                {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </td>
        </tr>
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
                descricao: `${v.Qtd}x ${v.Uniformes.Nome}`,
                valor: v.Preco_total,
                quantidade: v.Qtd,
            }));

            const itensArmarios = vendasArmarios.map(v => ({
                id: `a-${v.id}`,
                data: v['Vendas-2025'].Data,
                tipo: 'armario',
                descricao: `Armário Nº ${v.N_armario}`,
                valor: v.Armários.preco,
                quantidade: 1,
            }));

            const todosOsItens = [...itensUniformes, ...itensArmarios];
            todosOsItens.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

            setItensRelatorio(todosOsItens);
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const stats = useMemo(() => {
        return itensRelatorio.reduce((acc, item) => {
            if (item.tipo === 'uniforme') {
                acc.totalUniformes += item.valor;
                acc.pecasUniformes += item.quantidade;
            } else if (item.tipo === 'armario') {
                acc.totalArmarios += item.valor;
                acc.pecasArmarios += item.quantidade;
            }
            acc.totalGeral += item.valor;
            return acc;
        }, {
            totalUniformes: 0,
            totalArmarios: 0,
            totalGeral: 0,
            pecasUniformes: 0,
            pecasArmarios: 0
        });
    }, [itensRelatorio]);

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
                <FiDollarSign size={30} className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Relatório Geral</h1>
            </header>

            <div className={styles.contentContainer}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryHeader}>
                        <p>Resumo do Período</p>
                        <span>{formatarData(dataInicio)} a {formatarData(dataFim)}</span>
                    </div>
                    <div className={styles.summaryStats}>
                        <div className={styles.statItem}>
                            <p className={styles.statLabel}>Uniformes Vendidos (peças)</p>
                            <p className={styles.statValue}>{stats.pecasUniformes}</p>
                        </div>
                        <div className={styles.statItem}>
                            <p className={styles.statLabel}>Total em Uniformes</p>
                            <p className={styles.statValue}>{stats.totalUniformes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div className={styles.statItem}>
                            <p className={styles.statLabel}>Armários Alugados</p>
                            <p className={styles.statValue}>{stats.pecasArmarios}</p>
                        </div>
                        <div className={styles.statItem}>
                            <p className={styles.statLabel}>Total em Armários</p>
                            <p className={styles.statValue}>{stats.totalArmarios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </div>
                    <div className={styles.summaryFooter}>
                        <p className={styles.statLabel}>Valor Total Arrecadado</p>
                        <p className={`${styles.statValue} ${styles.totalValue}`}>
                            {stats.totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>

                <div className={styles.listContainer}>
                    <h2 className={styles.listHeader}>Todas as Transações</h2>
                    <table className={styles.salesTable}>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Data</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensRelatorio.map((item) => (
                                <VendaItem key={item.id} item={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}