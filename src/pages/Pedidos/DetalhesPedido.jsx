import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClipboardList, FaTrashAlt, FaSave, FaCheckCircle, FaCircle } from 'react-icons/fa';
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
        <td className={styles.tableCellIndex}>{item.quantidade || ''}</td>
        <td className={styles.tableCellDesc}>{item.nome}</td>
        <td className={styles.tableCellSize}>{item.detalhe}</td>
        <td className={styles.tableCellPrice}>
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

    const handleSalvarPagamento = async () => {
        if (!pedido) return;
        const { error } = await updateStatusPagamento(pedido.id_venda, statusPago);
        if (error) {
            alert("Erro", "Não foi possível salvar o status de pagamento.");
            return;
        }
        const eFinalizado = hasUniformes ? (statusPago && statusRetirado) : statusPago;
        await updateCompraFinalizada(pedido.id_venda, eFinalizado);
        alert("Status de pagamento salvo!");
        await carregarDetalhes();
    };

    const handleSalvarRetirada = async () => {
        if (!pedido) return;
        const eFinalizado = statusPago && statusRetirado;
        await updateCompraFinalizada(pedido.id_venda, eFinalizado);
        alert("Status de retirada salvo!");
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
            <div className={styles.scrollContainer}>
                <div className={styles.card}>
                    <header className={styles.header}>
                        <Link to="/pedidos" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                        <FaClipboardList size={30} className={styles.headerIcon} />
                        <h1 className={styles.headerTitle}>Pedidos</h1>
                        <div style={{ flex: 1 }} />
                        <button className={styles.deleteButton} onClick={handleDelete}>
                            <FaTrashAlt size={22} color="#E53935" />
                        </button>
                    </header>
                    <h2 className={styles.clientName}>{pedido.Clientes.Nome}</h2>
                    
                    <table className={styles.table}>
                        <tbody>
                            {itensPedido.map(item => <ItemRow key={item.id} item={item} />)}
                        </tbody>
                    </table>

                    <div className={styles.section}>
                        <div>
                            <p className={styles.sectionTitle}>Pagamento:</p>
                            <button className={styles.radioOption} onClick={() => setStatusPago(true)}>
                                {statusPago ? <FaCheckCircle size={20} color='#5C8E8B' /> : <FaCircle size={20} color='#DDD' />}
                                <span className={styles.radioText}>Pago</span>
                            </button>
                            <button className={styles.radioOption} onClick={() => setStatusPago(false)}>
                                {!statusPago ? <FaCheckCircle size={20} color='#5C8E8B' /> : <FaCircle size={20} color='#DDD' />}
                                <span className={styles.radioText}>Não pago</span>
                            </button>
                        </div>
                        <button className={styles.saveButton} onClick={handleSalvarPagamento}><FaSave size={28} /></button>
                    </div>

                    {hasUniformes && (
                        <div className={styles.section}>
                            <div>
                                <p className={styles.sectionTitle}>Retirada:</p>
                                <button className={styles.radioOption} onClick={() => setStatusRetirado(true)}>
                                    {statusRetirado ? <FaCheckCircle size={20} color='#5C8E8B' /> : <FaCircle size={20} color='#DDD' />}
                                    <span className={styles.radioText}>Retirou</span>
                                </button>
                                <button className={styles.radioOption} onClick={() => setStatusRetirado(false)}>
                                    {!statusRetirado ? <FaCheckCircle size={20} color='#5C8E8B' /> : <FaCircle size={20} color='#DDD' />}
                                    <span className={styles.radioText}>Ainda não retirou</span>
                                </button>
                            </div>
                            <button className={styles.saveButton} onClick={handleSalvarRetirada}><FaSave size={28} /></button>
                        </div>
                    )}

                    <footer className={styles.footer}>
                        <div>
                            <p className={styles.footerLabel}>Forma de pagamento:</p>
                            <p className={styles.footerValue}>{pedido.Forma_de_pagamento}</p>
                        </div>
                        <img src={ReciboIcon} alt="Ícone de recibo" className={styles.reciboIcon} />
                        <div className={styles.totalSection}>
                            <p className={styles.footerLabel}>Total</p>
                            <p className={styles.totalValue}>{pedido.Total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}