import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { FiDollarSign } from 'react-icons/fi';
import styles from './RelatorioVendas.module.css';

import UniformeIcon from '../../assets/uniformes gestao.png';
import ArmarioIcon from '../../assets/armarios gestao.png';

export default function RelatorioVendas() {
    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to="/" className={styles.backButton}>
                    <FaArrowLeft size={24} />
                </Link>
                <FaChartBar size={30} className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Relatório de Vendas</h1>
            </header>

            <div className={styles.content}>
                <div className={styles.cardGrid}>
                    <Link to="/relatorio-vendas/uniformes" className={styles.reportCard}>
                        <img src={UniformeIcon} alt="Uniformes" className={styles.cardIconImage} />
                        <span className={styles.cardText}>Uniformes</span>
                    </Link>
                    <Link to="/relatorio-vendas/armarios" className={styles.reportCard}>
                        <img src={ArmarioIcon} alt="Armários" className={styles.cardIconImage} />
                        <span className={styles.cardText}>Armários</span>
                    </Link>
                    <Link to="/relatorio-vendas/geral" className={styles.reportCard}>
                        <div className={styles.cardIconFont}>
                            <FiDollarSign size={45} />
                        </div>
                        <span className={styles.cardText}>Geral</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}