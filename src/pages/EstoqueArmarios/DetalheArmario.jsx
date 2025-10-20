import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import styles from './DetalheArmario.module.css';
import {
    buscarArmario,
    buscarClienteArmario,
    fetchVendaPorId,
    marcarArmarioQuebrado,
    cancelarAluguelArmario,
    marcarArmarioConsertado
} from '@/lib/fetchArmarios.js';

import ArmarioIcon from '@/assets/armarios gestao.png';
import NovoContratoIcon from '@/assets/contrato.png';

const DetalheItem = ({ label, value }) => (
    <div className={styles.detalheRow}>
        <span className={styles.detalheLabel}>{label}</span>
        <span className={styles.detalheValue}>{value}</span>
    </div>
);

export default function DetalheArmario() {
    const { n_armario } = useParams();
    const [armario, setArmario] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [venda, setVenda] = useState(null);
    const [loading, setLoading] = useState(true);

    const carregarDetalhes = useCallback(async () => {
        if (!n_armario) return;
        setLoading(true);
        setCliente(null);
        setVenda(null);
        const numeroArmario = Number(n_armario);
        const armarioDataArray = await buscarArmario(numeroArmario);
        if (armarioDataArray && armarioDataArray.length > 0) {
            const armarioAtual = armarioDataArray[0];
            setArmario(armarioAtual);
            const isOcupado = !armarioAtual.Disponivel && armarioAtual.Vendas_armários && armarioAtual.Vendas_armários.length > 0;
            if (isOcupado) {
                const idVenda = armarioAtual.Vendas_armários[0].id_venda;
                const [clienteDataArray, vendaData] = await Promise.all([
                    buscarClienteArmario(idVenda),
                    fetchVendaPorId(idVenda)
                ]);
                if (clienteDataArray && clienteDataArray.length > 0 && clienteDataArray[0].Clientes) {
                    setCliente(clienteDataArray[0].Clientes);
                }
                if (vendaData) setVenda(vendaData);
            }
        }
        setLoading(false);
    }, [n_armario]);

    useEffect(() => {
        carregarDetalhes();
    }, [carregarDetalhes]);

    const handleAction = async (confirmText, actionFn, successMsg, errorMsg) => {
        if (window.confirm(confirmText)) {
            const { error } = await actionFn();
            if (error) {
                alert(errorMsg);
            } else {
                alert(successMsg);
                carregarDetalhes();
            }
        }
    };

    const handleCancelarAluguel = () => handleAction(
        "Você tem certeza que deseja cancelar este aluguel?",
        () => cancelarAluguelArmario(armario.N_armario, armario.Vendas_armários[0].id_venda),
        "Aluguel cancelado. O armário está disponível.", "Não foi possível cancelar o aluguel."
    );
    const handleMarcarQuebrado = () => handleAction(
        "Você tem certeza que deseja marcar este armário como quebrado?",
        () => marcarArmarioQuebrado(armario.N_armario),
        "Armário marcado como quebrado.", "Não foi possível atualizar o status."
    );
    const handleMarcarConsertado = () => handleAction(
        "O armário voltará a ficar disponível. Deseja continuar?",
        () => marcarArmarioConsertado(armario.N_armario),
        "Armário consertado e disponível.", "Não foi possível consertar o armário."
    );

    const getStatusInfo = () => {
        if (armario?.Funcional === false) return { style: styles.statusRed, text: 'Quebrado' };
        if (armario?.Disponivel) return { style: styles.statusGreen, text: 'Disponível' };
        return { style: styles.statusGray, text: 'Alugado' };
    };

    const formatarData = (dataString) => dataString ? new Date(dataString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : "N/A";

    const calcularVencimento = (dataString) => {
        if (!dataString) return "N/A";
        const data = new Date(dataString);
        data.setFullYear(data.getFullYear() + 1);
        return formatarData(data);
    };

    const RenderDetalhes = () => {
        if (armario?.Funcional === false) {
            return (
                <div className={styles.statusInfoContainer}>
                    <p className={styles.infoText}>Este armário está quebrado e aguardando manutenção.</p>
                    <button className={`${styles.actionButton} ${styles.repairButton}`} onClick={handleMarcarConsertado}>
                        <FaCheckCircle />
                        <span>Marcar como Consertado</span>
                    </button>
                </div>
            );
        }
        if (armario?.Disponivel) {
            return (
                <div className={styles.statusInfoContainer}>
                    <p className={styles.infoText}>Este armário está disponível para aluguel.</p>
                    <button className={`${styles.actionButton} ${styles.breakButton}`} onClick={handleMarcarQuebrado}>
                        <FaTools />
                        <span>Marcar como Quebrado</span>
                    </button>
                </div>
            );
        }
        if (cliente) {
            const contratoUrl = armario?.Vendas_armários?.[0]?.Contrato;
            return (
                <div className={styles.clientDetails}>
                    <DetalheItem label="Ocupado por" value={cliente.Nome} />
                    <DetalheItem label="RM" value={cliente.RM} />
                    <DetalheItem label="Curso" value={cliente.Curso} />
                    <DetalheItem label="Série" value={cliente.Serie} />
                    <DetalheItem label="Data de compra" value={formatarData(venda?.Data)} />
                    <DetalheItem label="Vencimento" value={calcularVencimento(venda?.Data)} />
                    {contratoUrl && (
                        <div className={styles.contratoContainer}>
                            <span className={styles.detalheLabel}>Contrato</span>
                            <Link to={`/estoque-armarios/contrato?url=${encodeURIComponent(contratoUrl)}`} className={styles.contratoButton}>
                                <img src={NovoContratoIcon} alt="Ícone de Contrato" className={styles.contratoButtonIcon} />
                                <span>Visualizar</span>
                            </Link>
                        </div>
                    )}
                    <div className={styles.actionsContainer}>
                        <h3 className={styles.actionsTitle}>Ações</h3>
                        <div className={styles.buttonGroup}>
                            <button className={`${styles.actionButton} ${styles.breakButton}`} onClick={handleMarcarQuebrado}>
                                <FaTools />
                                <span>Quebrado</span>
                            </button>
                            <button className={`${styles.actionButton} ${styles.cancelButton}`} onClick={handleCancelarAluguel}>
                                <FaTimesCircle />
                                <span>Cancelar Aluguel</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return <p className={styles.infoText}>Carregando informações do locatário...</p>;
    };

    if (loading) {
        return <main className={styles.loadingContainer}><div className={styles.spinner}></div></main>;
    }
    if (!armario) {
        return <main className={styles.loadingContainer}><p>Armário não encontrado.</p></main>;
    }

    const statusInfo = getStatusInfo();

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to={`/estoque-armarios/${armario.Corredor}`} className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <img src={ArmarioIcon} alt="Ícone de Armários" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Detalhe do Armário</h1>
            </header>

            <div className={styles.contentContainer}>
                <div className={styles.card}>
                    <div className={styles.summaryColumn}>
                        <div className={styles.numeroContainer}>
                            <span className={styles.numeroTexto}>{armario.N_armario}</span>
                        </div>
                        <div className={styles.headerInfo}>
                            <p className={styles.corredorTexto}>Corredor {armario.Corredor}</p>
                            <div className={`${styles.statusBadge} ${statusInfo.style}`}>
                                {statusInfo.text}
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailsColumn}>
                        <RenderDetalhes />
                    </div>
                </div>
            </div>
        </main>
    );
}