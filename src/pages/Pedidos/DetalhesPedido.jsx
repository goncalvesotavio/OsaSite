import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClipboardList, FaTrash, FaSave, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import styles from './DetalhesPedido.module.css';
import {
    checkIfVendaHasUniformes,
    deletePedido,
    fetchDetalhesPedidosArmario,
    fetchDetalhesPedidosUniforme,
    fetchPedido,
    updateCompraFinalizada,
    updateStatusPagamento
} from '../../lib/fetchPedidos';

import ReciboIcon from '../../assets/recibo.png';

const ItemRow = ({ item }) => (
    <tr className={styles.tableRow}>
        <td className={styles.tableCell} data-label="Qtd">{item.quantidade || '1'}</td>
        <td className={styles.tableCell} data-label="Produto">{item.nome}</td>
        <td className={styles.tableCell} data-label="Detalhe">{item.detalhe}</td>
        <td className={`${styles.tableCell} ${styles.priceCell}`} data-label="Preço">
            {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </td>
    </tr>
);

export default function DetalhesPedido() {
    const { id } = useParams();
    const vendaId = Number(id);
    const navigate = useNavigate();

    const [pedido, setPedido] = useState(null);
    const [itensPedido, setItensPedido] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusPago, setStatusPago] = useState(false);
    const [statusRetirado, setStatusRetirado] = useState(false);
    const [hasUniformes, setHasUniformes] = useState(false);

    const carregarDetalhes = useCallback(async () => {
        if (!vendaId) return;
        try {
            setLoading(true);
            const [pedidoData, uniformesData, armariosData, uniformesCheck] = await Promise.all([
                fetchPedido(vendaId),
                fetchDetalhesPedidosUniforme(vendaId),
                fetchDetalhesPedidosArmario(vendaId),
                checkIfVendaHasUniformes(vendaId),
            ]);

            if (pedidoData && pedidoData.length > 0) {
                const p = pedidoData[0];
                setPedido(p);
                setStatusPago(p.Pago);
                setStatusRetirado(p.Compra_finalizada);
            }
            setHasUniformes(uniformesCheck);

            const itensUniformes = (uniformesData || []).map(item => ({
                id: `uniforme-${item.id}`, nome: item.Uniformes.Nome, detalhe: item.Estoque_uniforme?.Tamanho || '-',
                preco: item.Preco_total, quantidade: item.Qtd
            }));
            const itensArmarios = (armariosData || []).map(item => ({
                id: `armario-${item.id}`, nome: 'Armário', detalhe: `Nº ${item.N_armario}`,
                preco: item.Armários?.preco_final ?? 0,
            }));
            setItensPedido([...itensUniformes, ...itensArmarios]);
        } catch (error) {
            console.error("Erro ao carregar detalhes do pedido:", error);
        } finally {
            setLoading(false);
        }
    }, [vendaId]);

    useEffect(() => {
        carregarDetalhes();
    }, [carregarDetalhes]);

    const handleSalvarStatus = async (type) => {
        if (!pedido) return;

        const isPayment = type === 'pagamento';
        const newPago = isPayment ? !pedido.Pago : statusPago;
        const newRetirado = !isPayment ? !pedido.Retirado : statusRetirado;

        await updateStatusPagamento(pedido.id_venda, newPago);

        const eFinalizado = hasUniformes ? (newPago && newRetirado) : newPago;
        await updateCompraFinalizada(pedido.id_venda, eFinalizado);

        alert(`Status de ${type} salvo!`);
        await carregarDetalhes();
    };


    const handleDelete = async () => {
        if (!pedido) return;
        const confirmDelete = window.confirm(`Tem certeza que deseja deletar o pedido de ${pedido.Clientes.Nome}? Esta ação não pode ser desfeita.`);
        if (confirmDelete) {
            const { error } = await deletePedido(pedido.id_venda);
            if (error) {
                alert("Erro ao deletar o pedido.");
            } else {
                alert("Pedido deletado com sucesso.");
                navigate('/pedidos');
            }
        }
    };

    if (loading) {
        return <main className={styles.loadingContainer}><div className={styles.spinner}></div></main>;
    }

    if (!pedido) {
        return <main className={styles.loadingContainer}><h1 className={styles.headerTitle}>Pedido não encontrado</h1></main>;
    }

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to="/pedidos" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <FaClipboardList size={30} className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Detalhes do Pedido</h1>
            </header>

            <div className={styles.contentContainer}>
                <div className={styles.card}>
                    <div className={styles.infoColumn}>
                        <div className={styles.clientHeader}>
                            <h2 className={styles.clientName}>{pedido.Clientes.Nome}</h2>
                            <button className={`${styles.button} ${styles.deleteButtonMobile}`} onClick={handleDelete}>
                                <FaTrash />
                            </button>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.tableHeader}>Qtd</th>
                                        <th className={styles.tableHeader}>Produto</th>
                                        <th className={styles.tableHeader}>Detalhe</th>
                                        <th className={`${styles.tableHeader} ${styles.priceCell}`}>Preço</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensPedido.map(item => <ItemRow key={item.id} item={item} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.actionsColumn}>
                        <div className={styles.actionCard}>
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Status do Pagamento</h3>
                                <div className={styles.radioGroup}>
                                    <button className={styles.radioOption} onClick={() => setStatusPago(true)}>
                                        {statusPago ? <FaCheckCircle size={22} color='#5C8E8B' /> : <FaRegCircle size={22} color='#AAA' />}
                                        <span className={styles.radioText}>Pago</span>
                                    </button>
                                    <button className={styles.radioOption} onClick={() => setStatusPago(false)}>
                                        {!statusPago ? <FaCheckCircle size={22} color='#5C8E8B' /> : <FaRegCircle size={22} color='#AAA' />}
                                        <span className={styles.radioText}>Não pago</span>
                                    </button>
                                </div>
                                <button className={`${styles.button} ${styles.saveButton}`} onClick={() => handleSalvarStatus('pagamento')}>
                                    <FaSave /> Salvar Pagamento
                                </button>
                            </div>

                            {hasUniformes && (
                                <div className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Status da Retirada</h3>
                                    <div className={styles.radioGroup}>
                                        <button className={styles.radioOption} onClick={() => setStatusRetirado(true)}>
                                            {statusRetirado ? <FaCheckCircle size={22} color='#5C8E8B' /> : <FaRegCircle size={22} color='#AAA' />}
                                            <span className={styles.radioText}>Retirado</span>
                                        </button>
                                        <button className={styles.radioOption} onClick={() => setStatusRetirado(false)}>
                                            {!statusRetirado ? <FaCheckCircle size={22} color='#5C8E8B' /> : <FaRegCircle size={22} color='#AAA' />}
                                            <span className={styles.radioText}>Não retirado</span>
                                        </button>
                                    </div>
                                    <button className={`${styles.button} ${styles.saveButton}`} onClick={() => handleSalvarStatus('retirada')}>
                                        <FaSave /> Salvar Retirada
                                    </button>
                                </div>
                            )}
                        </div>

                        <footer className={styles.footer}>
                            <div className={styles.footerInfo}>
                                <p className={styles.footerLabel}>Forma de pagamento</p>
                                <p className={styles.footerValue}>{pedido.Forma_de_pagamento}</p>
                            </div>
                            <img src={ReciboIcon} alt="Ícone de recibo" className={styles.reciboIcon} />
                            <div className={styles.totalSection}>
                                <p className={styles.footerLabel}>Total do Pedido</p>
                                <p className={styles.totalValue}>{pedido.Total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            </div>
                        </footer>
                        <button className={`${styles.button} ${styles.deleteButtonDesktop}`} onClick={handleDelete}>
                            <FaTrash /> Deletar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}