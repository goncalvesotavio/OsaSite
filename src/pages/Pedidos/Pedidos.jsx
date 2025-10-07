import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaClipboardList, FaSearch } from 'react-icons/fa';
import { fetchPedidosFinalizados, fetchPedidosPendentes } from '../../lib/fetchPedidos';
import { supabase } from '../../lib/supabase';
import styles from './Pedidos.module.css';

const PedidoItem = ({ nome, id_venda }) => (
    <Link to={`/pedidos/${id_venda}`} className={styles.pedidoItem}>
        <span className={styles.pedidoNome}>{nome}</span>
    </Link>
);

export default function Pedidos() {
    const [filtroAtivo, setFiltroAtivo] = useState('finalizados');
    const [listaPedidosFinalizados, setListaPedidosFinalizados] = useState([]);
    const [listaPedidosPendentes, setListaPedidosPendentes] = useState([]);
    const [textoPesquisa, setTextoPesquisa] = useState('');
    const [loading, setLoading] = useState(true);

    const carregarPedidosIniciais = useCallback(() => {
        setLoading(true);
        const listarFinalizados = async () => {
            const finalizados = await fetchPedidosFinalizados();
            setListaPedidosFinalizados(finalizados || []);
        };
        const listarPendentes = async () => {
            const pendentes = await fetchPedidosPendentes();
            setListaPedidosPendentes(pendentes || []);
        };

        Promise.all([listarFinalizados(), listarPendentes()]).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        carregarPedidosIniciais();
    }, [carregarPedidosIniciais]);

    useEffect(() => {
        const channel = supabase
            .channel('vendas_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Vendas-2025' },
                () => {
                    carregarPedidosIniciais();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [carregarPedidosIniciais]);

    const pedidosFinalizadosFiltrados = useMemo(() => {
        if (!textoPesquisa) {
            return listaPedidosFinalizados;
        }
        return listaPedidosFinalizados.filter(pedido =>
            pedido.Clientes?.Nome.toLowerCase().includes(textoPesquisa.toLowerCase())
        );
    }, [listaPedidosFinalizados, textoPesquisa]);

    const pedidosPendentesFiltrados = useMemo(() => {
        if (!textoPesquisa) {
            return listaPedidosPendentes;
        }
        return listaPedidosPendentes.filter(pedido =>
            pedido.Clientes?.Nome.toLowerCase().includes(textoPesquisa.toLowerCase())
        );
    }, [listaPedidosPendentes, textoPesquisa]);

    if (loading) {
        return (
            <main className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </main>
        );
    }

    const dadosAtuais = filtroAtivo === 'finalizados' ? pedidosFinalizadosFiltrados : pedidosPendentesFiltrados;

    return (
        <main className={styles.safeArea}>
            <div className={styles.container}>
                <div className={`${styles.circle} ${styles.circleOne}`} />
                <div className={`${styles.circle} ${styles.circleTwo}`} />
                <div className={`${styles.circle} ${styles.circleThree}`} />
                <div className={`${styles.circle} ${styles.circleFour}`} />

                <div className={styles.content}>
                    <header className={styles.header}>
                        <Link to="/" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                        <FaClipboardList size={30} className={styles.headerIcon} />
                        <h1 className={styles.headerTitle}>Pedidos</h1>
                    </header>

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Pesquise aqui pelo nome..."
                            value={textoPesquisa}
                            onChange={(e) => setTextoPesquisa(e.target.value)}
                        />
                        <FaSearch size={20} className={styles.searchIcon} />
                    </div>

                    <div className={styles.filterContainer}>
                        <button
                            className={`${styles.filterButton} ${filtroAtivo === 'finalizados' ? styles.filterButtonActive : ''}`}
                            onClick={() => setFiltroAtivo('finalizados')}
                        >
                            <span className={`${styles.filterButtonText} ${filtroAtivo === 'finalizados' ? styles.filterButtonTextActive : ''}`}>Finalizados</span>
                        </button>
                        <button
                            className={`${styles.filterButton} ${filtroAtivo === 'pendentes' ? styles.filterButtonActive : ''}`}
                            onClick={() => setFiltroAtivo('pendentes')}
                        >
                            <span className={`${styles.filterButtonText} ${filtroAtivo === 'pendentes' ? styles.filterButtonTextActive : ''}`}>Pendentes</span>
                        </button>
                    </div>

                    <div className={styles.pedidosList}>
                        {dadosAtuais.map((item) => (
                            <PedidoItem
                                key={item.id_venda}
                                nome={item.Clientes?.Nome || 'Cliente não encontrado'}
                                id_venda={item.id_venda}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}