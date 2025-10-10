import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaDotCircle, FaRegCircle, FaMinus, FaPlus, FaSave } from 'react-icons/fa';
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
    const [valorMudanca, setValorMudanca] = useState('')
    const [selecionadoNovoTamanho, setSelecionadoNovoTamanho] = useState(false)
    const [novoTamanho, setNovoTamanho] = useState('')

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
            await adicionarTamanho(uniformeId, novoTamanho.trim(), parseInt(valorMudanca))
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
            await carregarDetalhes();
        }
    }

    const alterarValor = (quantidade) => {
        const valorAtual = parseInt(valorMudanca, 10) || 0;
        const novoValor = valorAtual + quantidade;
        setValorMudanca(novoValor.toString());
    };
    
    const apagarTamanho = async () => {
        if (!tamanhoSelecionado) {
            alert("Atenção: Por favor, selecione um tamanho antes de salvar.");
            return;
        }

        await deletarTamanho(tamanhoSelecionado.id)
    }

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

            <div className={styles.scrollContainer}>
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <img src={uniforme.Img} alt={uniforme.Nome} className={styles.mainImage} />
                    </div>
                    <h2 className={styles.uniformeTitle}>{uniforme.Nome}</h2>

                    <div className={styles.estoqueContainer}>
                        <div className={styles.estoqueList}>
                            {estoques.map(item => (
                                <p key={item.id_estoque} className={styles.estoqueItem}>
                                    {item.Tamanho}: {item.Qtd_estoque}
                                </p>
                            ))}
                        </div>
                        <p className={styles.estoqueTotal}>Total: {estoqueTotal}</p>
                    </div>

                    <div className={styles.actionsContainer}>
                        <p className={styles.actionsTitle}>Selecione o tamanho que deseja alterar:</p>
                        <div className={styles.radioGroup}>
                            {estoques.map(item => (
                                <button key={item.id_estoque} className={styles.radioOption} onClick={() => setTamanhoSelecionado(item)}>
                                    {tamanhoSelecionado?.id_estoque === item.id_estoque ? <FaDotCircle size={22} color="#5C8E8B" /> : <FaRegCircle size={22} color="#5C8E8B" />}
                                    <span className={styles.radioText}>{item.Tamanho}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setSelecionadoNovoTamanho(true)}>Novo Tamanho</button>

                        {selecionadoNovoTamanho && (
                            <>
                                <label>Tamanho: </label>
                                <input 
                                  type='text' 
                                  onChange={(e) => setNovoTamanho(e.target.value)}/>
                            </>
                        )}

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
                            <button className={styles.saveButton} onClick={handleSalvarEstoque}>
                                <FaSave size={24} color="#FFF" />
                            </button>
                            <button onClick={() => apagarTamanho()}>Apagar</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}