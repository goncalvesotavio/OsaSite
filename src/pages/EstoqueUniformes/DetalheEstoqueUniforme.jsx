import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaDotCircle, FaRegCircle, FaMinus, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { atualizarEstoque, buscarUniforme, detalhesEstoque, adicionarTamanho, deletarTamanho } from '../../lib/fetchUniformes';
import styles from './DetalheEstoqueUniforme.module.css';

import UniformeIcon from '../../assets/uniformes gestao.png';

export default function DetalheEstoqueUniforme() {
    const { id } = useParams();
    const uniformeId = Number(id);

    const [uniforme, setUniforme] = useState(null);
    const [estoques, setEstoques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [valorMudanca, setValorMudanca] = useState('');
    const [selecionadoNovoTamanho, setSelecionadoNovoTamanho] = useState(false);
    const [novoTamanho, setNovoTamanho] = useState('');

    const carregarDetalhes = useCallback(async () => {
        if (!uniformeId) return;
        setLoading(true);
        const [uniformeData, estoqueData] = await Promise.all([
            buscarUniforme(uniformeId),
            detalhesEstoque(uniformeId)
        ]);
        if (uniformeData && uniformeData.length > 0) {
            setUniforme(uniformeData[0]);
        }
        setEstoques(estoqueData);
        setTamanhoSelecionado(null);
        setValorMudanca('');
        setLoading(false);
    }, [uniformeId]);

    useEffect(() => {
        carregarDetalhes();
    }, [carregarDetalhes]);

    const estoqueTotal = useMemo(() => {
        return estoques.reduce((soma, item) => soma + item.Qtd_estoque, 0);
    }, [estoques]);

    const handleSalvarEstoque = async () => {
        if (selecionadoNovoTamanho && novoTamanho.trim() !== '') {
            await adicionarTamanho(uniformeId, novoTamanho.trim(), parseInt(valorMudanca) || 0);
            alert(`Sucesso: Novo tamanho ${novoTamanho.trim()} adicionado!`);
        } else {
            if (!tamanhoSelecionado) {
                alert("Atenção: Por favor, selecione um tamanho antes de salvar.");
                return;
            }
            const mudancaNumerica = parseInt(valorMudanca, 10);
            if (isNaN(mudancaNumerica) || mudancaNumerica === 0) {
                alert("Atenção: Por favor, insira um valor válido (diferente de zero) para adicionar ou remover.");
                return;
            }
            const novaQuantidade = tamanhoSelecionado.Qtd_estoque + mudancaNumerica;
            if (novaQuantidade < 0) {
                alert("Erro: A quantidade em estoque não pode ser negativa.");
                return;
            }
            await atualizarEstoque(tamanhoSelecionado.id_estoque, novaQuantidade);
            alert(`Sucesso: Estoque do tamanho ${tamanhoSelecionado.Tamanho} atualizado!`);
        }
        await carregarDetalhes();
        setSelecionadoNovoTamanho(false);
        setNovoTamanho('');
    };

    const alterarValor = (quantidade) => {
        const valorAtual = parseInt(valorMudanca, 10) || 0;
        const novoValor = valorAtual + quantidade;
        setValorMudanca(novoValor.toString());
    };

    const apagarTamanho = async () => {
        if (!tamanhoSelecionado) {
            alert("Atenção: Por favor, selecione um tamanho antes de apagar.");
            return;
        }
        if (window.confirm(`Tem certeza que deseja apagar o tamanho ${tamanhoSelecionado.Tamanho}? Esta ação não pode ser desfeita.`)) {
            await deletarTamanho(tamanhoSelecionado.id_estoque);
            alert(`Sucesso: O tamanho ${tamanhoSelecionado.Tamanho} foi apagado.`);
            await carregarDetalhes();
        }
    };

    if (loading) {
        return <main className={styles.loadingContainer}><div className={styles.spinner}></div></main>;
    }

    if (!uniforme) {
        return <main className={styles.loadingContainer}><p>Uniforme não encontrado.</p></main>;
    }

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to="/estoque-uniformes" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <img src={UniformeIcon} alt="Ícone de Uniformes" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Estoque de Uniformes</h1>
            </header>

            <div className={styles.contentContainer}>
                <div className={styles.card}>
                    <div className={styles.detailsColumn}>
                        <div className={styles.imageContainer}>
                            <img src={uniforme.Img} alt={uniforme.Nome} className={styles.mainImage} />
                        </div>
                        <h2 className={styles.uniformeTitle}>{uniforme.Nome}</h2>
                        <div className={styles.estoqueContainer}>
                            <div className={styles.estoqueList}>
                                {estoques.map(item => (
                                    <p key={item.id_estoque} className={styles.estoqueItem}>
                                        <span>{item.Tamanho}:</span> <span>{item.Qtd_estoque}</span>
                                    </p>
                                ))}
                            </div>
                            <p className={styles.estoqueTotal}>Total: {estoqueTotal}</p>
                        </div>
                    </div>

                    <div className={styles.actionsColumn}>
                        <p className={styles.actionsTitle}>Gerenciar Estoque</p>
                        
                        <div className={styles.sizeSelector}>
                            <p className={styles.subTitle}>1. Selecione um tamanho existente ou adicione um novo</p>
                            <div className={styles.radioGroup}>
                                {estoques.map(item => (
                                    <button key={item.id_estoque} className={styles.radioOption} onClick={() => { setTamanhoSelecionado(item); setSelecionadoNovoTamanho(false); }}>
                                        {tamanhoSelecionado?.id_estoque === item.id_estoque ? <FaDotCircle size={22} color="#5C8E8B" /> : <FaRegCircle size={22} color="#5C8E8B" />}
                                        <span className={styles.radioText}>{item.Tamanho}</span>
                                    </button>
                                ))}
                            </div>
                            <button className={`${styles.button} ${styles.saveButton} ${styles.fullWidthButton}`} onClick={() => { setSelecionadoNovoTamanho(true); setTamanhoSelecionado(null); }}>
                                Adicionar Novo Tamanho
                            </button>

                            {selecionadoNovoTamanho && (
                                <div className={styles.newSizeWrapper}>
                                    <label htmlFor="new-size-input">Nome do Novo Tamanho:</label>
                                    <input
                                        id="new-size-input"
                                        type='text'
                                        className={styles.input}
                                        placeholder="Ex: GG"
                                        value={novoTamanho}
                                        onChange={(e) => setNovoTamanho(e.target.value)} />
                                </div>
                            )}
                        </div>

                        <div className={styles.quantityEditor}>
                            <p className={styles.subTitle}>2. Defina a quantidade para adicionar ou remover</p>
                            <div className={styles.controlsContainer}>
                                <button className={styles.controlButton} onClick={() => alterarValor(-1)}>
                                    <FaMinus size={20} color="#FFF" />
                                </button>
                                <input
                                    type="number"
                                    className={styles.quantityInput}
                                    placeholder="0"
                                    value={valorMudanca}
                                    onChange={(e) => setValorMudanca(e.target.value)}
                                />
                                <button className={styles.controlButton} onClick={() => alterarValor(1)}>
                                    <FaPlus size={20} color="#FFF" />
                                </button>
                            </div>
                        </div>

                        <div className={styles.finalActions}>
                           <p className={styles.subTitle}>3. Salve a alteração ou apague o tamanho</p>
                            <div className={styles.finalButtonsWrapper}>
                                <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSalvarEstoque}>
                                    <FaSave size={20} /> Salvar
                                </button>
                                <button className={`${styles.button} ${styles.deleteButton}`} onClick={apagarTamanho} disabled={!tamanhoSelecionado || selecionadoNovoTamanho}>
                                    <FaTrash size={18} /> Apagar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}