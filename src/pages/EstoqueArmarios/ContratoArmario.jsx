import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './ContratoArmario.module.css';

import ArmarioIcon from '../../assets/armarios gestao.png';

export default function ContratoArmario() {
    const [searchParams] = useSearchParams();
    const url = searchParams.get('url');
    const navigate = useNavigate();

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <FaArrowLeft size={24} />
                </button>
                <img src={ArmarioIcon} alt="Ícone de Armários" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Contrato do Armário</h1>
            </header>
            
            <div className={styles.content}>
                <h2 className={styles.subtitle}>Contrato de Compra Digitalizado</h2>
                <div className={styles.webviewContainer}>
                    {url ? (
                        <iframe
                            src={url}
                            className={styles.webview}
                            title="Contrato de Compra"
                        />
                    ) : (
                        <p className={styles.errorText}>URL do contrato não encontrada.</p>
                    )}
                </div>
            </div>
        </main>
    );
}