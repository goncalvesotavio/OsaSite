import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileUpload } from 'react-icons/fa';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";

import { fetchPrecoPadraoArmario } from '@/lib/fetchArmarios.js';
import { buscarDatas, novasDatas, novoPreco } from '@/lib/fetchContratos.js';
import styles from './ControleContrato.module.css';
import ContratoIcon from '@/assets/controle-contrato.png';

registerLocale('pt-BR', ptBR);

export default function ControleContrato() {
    const [preco, setPreco] = useState('');
    const [dataAnual, setDataAnual] = useState(new Date());
    const [dataSemestral, setDataSemestral] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            try {
                const precoPadrao = await fetchPrecoPadraoArmario();
                if (precoPadrao !== null) {
                    setPreco(String(precoPadrao));
                }

                const datas = await buscarDatas(new Date().getFullYear());
                const primeiroContrato = datas[0];
                if (primeiroContrato) {
                    if (primeiroContrato.Data_anual) setDataAnual(new Date(primeiroContrato.Data_anual));
                    if (primeiroContrato.Data_semestral) setDataSemestral(new Date(primeiroContrato.Data_semestral));
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            } finally {
                setLoading(false);
            }
        };
        carregarDadosIniciais();
    }, []);

    const salvar = async () => {
        await novasDatas(new Date().getFullYear(), dataAnual, dataSemestral);
        await novoPreco(parseFloat(preco));
        alert("Dados salvos com sucesso!");
    };

    if (loading) {
        return (
            <main className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </main>
        );
    }

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to="/" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <img src={ContratoIcon} alt="Ícone de Contrato" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Controle de Contrato</h1>
            </header>

            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Preço (R$):</label>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="Ex: 100.00"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Data fim do contrato anual:</label>
                        <DatePicker
                            selected={dataAnual}
                            onChange={(date) => setDataAnual(date)}
                            dateFormat="dd/MM/yyyy"
                            locale="pt-BR"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Data fim do contrato semestral:</label>
                        <DatePicker
                            selected={dataSemestral}
                            onChange={(date) => setDataSemestral(date)}
                            dateFormat="dd/MM/yyyy"
                            locale="pt-BR"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Contrato:</label>
                        <button className={styles.uploadButton} onClick={() => alert("Funcionalidade de upload a ser implementada.")}>
                            <FaFileUpload size={18} />
                            <span className={styles.uploadButtonText}>Fazer Upload de Arquivo</span>
                        </button>
                    </div>

                    <button className={styles.saveButton} onClick={salvar}>
                        <span className={styles.saveButtonText}>Salvar Alterações</span>
                    </button>
                </div>
            </div>
        </main>
    );
}