import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './EstoqueArmarios.module.css';

import ArmarioIcon from '../../assets/armarios gestao.png';

const corredores = [
    { nome: "Corredor 1", href: "/estoque-armarios/1" },
    { nome: "Corredor 2", href: "/estoque-armarios/2" },
    { nome: "Corredor 3", href: "/estoque-armarios/3" },
    { nome: "Mecânica", href: "/estoque-armarios/mecanica" }
];

export default function EstoqueArmarios() {
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
                <img src={ArmarioIcon} alt="Ícone de Armários" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Estoque de Armários</h1>
            </header>

            <div className={styles.content}>
                <h2 className={styles.subtitle}>Selecione um corredor</h2>
                {corredores.map(corredor => (
                    <Link key={corredor.nome} to={corredor.href} className={styles.corredorButton}>
                        <span className={styles.corredorButtonText}>{corredor.nome}</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}