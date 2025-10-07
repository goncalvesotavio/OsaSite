import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { fetchVendasUniformesPorPeriodo } from '../../lib/fetchFinanceiro';
import styles from './UniformesResultado.module.css';

import UniformeIcon from '../../assets/uniformes gestao.png';

const categorias = [
    { label: "Todos", value: "Todos" },
    { label: "Camisetas", value: "Camiseta" },
    { label: "Agasalhos", value: "Casaco" },
    { label: "Calça e Short", value: ['Calca', 'Short'] },
];

const RelatorioCard = ({ item, dataInicio, dataFim }) => {
    const params = new URLSearchParams({
        id_uniforme: item.id,
        nome: item.Nome,
        img: item.Img,
        precoBase: item.precoBase,
        dataInicio: dataInicio,
        dataFim: dataFim
    });

    return (
        <div className={styles.card}>
            <img src={item.Img} alt={item.Nome} className={styles.cardImage} />
            <Link to={`/relatorio-vendas/uniformes-detalhe?${params.toString()}`} className={styles.infoButton}>
                <FaInfoCircle size={20} color="#FFF" />
            </Link>
            <p className={styles.cardTitle}>{item.Nome}</p>
            <p className={styles.cardValue}>
                Valor total de vendas: {item.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
    );
};

export default function UniformesResultado() {
    const [searchParams] = useSearchParams();
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    const [relatorio, setRelatorio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [textoPesquisa, setTextoPesquisa] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');

    useEffect(() => {
        if (!dataInicio || !dataFim) {
            setLoading(false);
            return;
        }

        const carregarRelatorio = async () => {
            setLoading(true);
            const vendas = await fetchVendasUniformesPorPeriodo(dataInicio, dataFim);
            
            const agrupado = vendas.reduce((acc, venda) => {
                const id = venda.Uniformes.id_uniforme;
                if (!acc[id]) {
                    acc[id] = {
                        id: id,
                        Nome: venda.Uniformes.Nome,
                        Img: venda.Uniformes.Img,
                        Categoria: venda.Uniformes.Categoria,
                        precoBase: venda.Uniformes.Preço,
                        totalVendas: 0,
                    };
                }
                acc[id].totalVendas += venda.Preco_total;
                return acc;
            }, {});

            setRelatorio(Object.values(agrupado));
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const valorTotalArrecadado = useMemo(() => {
        return relatorio.reduce((soma, item) => soma + item.totalVendas, 0);
    }, [relatorio]);
    
    const relatorioFiltrado = useMemo(() => {
        return relatorio
            .filter(item => {
                if (filtroCategoria === 'Todos') return true;
                if (Array.isArray(filtroCategoria)) {
                    return filtroCategoria.some(cat => item.Categoria?.toLowerCase() === cat.toLowerCase());
                }
                return item.Categoria?.toLowerCase() === filtroCategoria.toLowerCase();
            })
            .filter(item => {
                return item.Nome.toLowerCase().includes(textoPesquisa.toLowerCase());
            });
    }, [relatorio, textoPesquisa, filtroCategoria]);
    
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
                <img src={UniformeIcon} alt="Ícone de Uniformes" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Relatório de Uniformes</h1>
            </header>
            
            <div className={styles.searchContainer}>
                <input type="text" className={styles.searchInput} placeholder="Pesquise aqui..." value={textoPesquisa} onChange={(e) => setTextoPesquisa(e.target.value)}/>
                <FaSearch size={20} className={styles.searchIcon} />
            </div>
            
            <div className={styles.categoryContainerWrapper}>
                <div className={styles.categoryContainer}>
                    {categorias.map(c => (
                        <button key={c.label} className={`${styles.categoryButton} ${JSON.stringify(filtroCategoria) === JSON.stringify(c.value) ? styles.categoryButtonActive : ''}`} onClick={() => setFiltroCategoria(c.value)}>
                            <span className={`${styles.categoryButtonText} ${JSON.stringify(filtroCategoria) === JSON.stringify(c.value) ? styles.categoryButtonTextActive : ''}`}>{c.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className={styles.summaryContainer}>
                <p className={styles.summaryText}>De: <strong>{formatarData(dataInicio)}</strong> até <strong>{formatarData(dataFim)}</strong></p>
                <p className={styles.summaryText}>Total arrecadado: <strong>{valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
            </div>

            <div className={styles.listContainer}>
                {relatorioFiltrado.map(item => (
                    <RelatorioCard key={item.id} item={item} dataInicio={dataInicio} dataFim={dataFim} />
                ))}
            </div>
        </main>
    )
}