import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './DetalheCorredor.module.css';

import ArmarioIcon from '../../assets/armarios gestao.png';
import { buscarStatusArmarios } from '../../lib/fetchArmarios';

const secoesData = {
    '1': [{ secao: 1, titulo: 'Armário Nº1', armarios: Array.from({ length: 20 }, (_, i) => i + 1) }, { secao: 2, titulo: 'Armário Nº2', armarios: Array.from({ length: 16 }, (_, i) => i + 21) }, { secao: 3, titulo: 'Armário Nº3', armarios: Array.from({ length: 16 }, (_, i) => i + 37) }, { secao: 4, titulo: 'Armário Nº4', armarios: Array.from({ length: 16 }, (_, i) => i + 53) }, { secao: 5, titulo: 'Armário Nº5', armarios: Array.from({ length: 16 }, (_, i) => i + 69) }, { secao: 6, titulo: 'Armário Nº6', armarios: Array.from({ length: 20 }, (_, i) => i + 85) }, { secao: 7, titulo: 'Armário Nº7', armarios: Array.from({ length: 16 }, (_, i) => i + 105) }, { secao: 8, titulo: 'Armário Nº8', armarios: Array.from({ length: 16 }, (_, i) => i + 121) }, { secao: 9, titulo: 'Armário Nº9', armarios: Array.from({ length: 16 }, (_, i) => i + 137) }, { secao: 10, titulo: 'Armário Nº10', armarios: Array.from({ length: 16 }, (_, i) => i + 153) }, { secao: 11, titulo: 'Armário Nº11', armarios: Array.from({ length: 20 }, (_, i) => i + 169) }, { secao: 12, titulo: 'Armário Nº12', armarios: Array.from({ length: 16 }, (_, i) => i + 189) }],
    '2': [{ secao: 13, titulo: 'Armário Nº13', armarios: Array.from({ length: 16 }, (_, i) => i + 205) }, { secao: 14, titulo: 'Armário Nº14', armarios: Array.from({ length: 16 }, (_, i) => i + 221) }, { secao: 15, titulo: 'Armário Nº15', armarios: Array.from({ length: 20 }, (_, i) => i + 237) }, { secao: 16, titulo: 'Armário Nº16', armarios: Array.from({ length: 16 }, (_, i) => i + 257) }, { secao: 17, titulo: 'Armário Nº17', armarios: Array.from({ length: 16 }, (_, i) => i + 273) }, { secao: 18, titulo: 'Armário Nº18', armarios: Array.from({ length: 16 }, (_, i) => i + 289) }, { secao: 19, titulo: 'Armário Nº19', armarios: Array.from({ length: 16 }, (_, i) => i + 305) }, { secao: 20, titulo: 'Armário Nº20', armarios: Array.from({ length: 16 }, (_, i) => i + 321) }, { secao: 21, titulo: 'Armário Nº21', armarios: Array.from({ length: 16 }, (_, i) => i + 337) }, { secao: 22, titulo: 'Armário Nº22', armarios: Array.from({ length: 16 }, (_, i) => i + 353) }],
    '3': [{ secao: 23, titulo: 'Armário Nº23', armarios: Array.from({ length: 20 }, (_, i) => i + 369) }, { secao: 24, titulo: 'Armário Nº24', armarios: Array.from({ length: 16 }, (_, i) => i + 389) }, { secao: 25, titulo: 'Armário Nº25', armarios: Array.from({ length: 16 }, (_, i) => i + 405) }, { secao: 26, titulo: 'Armário Nº26', armarios: Array.from({ length: 16 }, (_, i) => i + 421) }, { secao: 27, titulo: 'Armário Nº27', armarios: Array.from({ length: 16 }, (_, i) => i + 437) }, { secao: 28, titulo: 'Armário Nº28', armarios: Array.from({ length: 20 }, (_, i) => i + 453) }],
    'mecanica': [{ secao: 29, titulo: 'Armário Nº29', armarios: Array.from({ length: 20 }, (_, i) => i + 473) }, { secao: 30, titulo: 'Armário Nº30', armarios: Array.from({ length: 20 }, (_, i) => i + 493) }, { secao: 31, titulo: 'Armário Nº31', armarios: Array.from({ length: 8 }, (_, i) => i + 513) }, { secao: 32, titulo: 'Armário Nº32', armarios: Array.from({ length: 8 }, (_, i) => i + 521) }, { secao: 33, titulo: 'Armário Nº33', armarios: Array.from({ length: 8 }, (_, i) => i + 529) }]
};
const layoutConfig = {
    '1': [{ type: 'sala', numero: 1 }, { type: 'secao', index: 0 }, { type: 'secao', index: 1 }, { type: 'sala', numero: 2 }, { type: 'secao', index: 2 }, { type: 'secao', index: 3 }, { type: 'secao', index: 4 }, { type: 'sala', numero: 3 }, { type: 'secao', index: 5 }, { type: 'secao', index: 6 }, { type: 'sala', numero: 4 }, { type: 'secao', index: 7 }, { type: 'sala', numero: 5 }, { type: 'secao', index: 8 }, { type: 'secao', index: 9 }, { type: 'sala', numero: 6 }, { type: 'secao', index: 10 }, { type: 'secao', index: 11 }, { type: 'sala', numero: 7 },],
    '2': [{ type: 'secao', index: 0 }, { type: 'sala', numero: 8 }, { type: 'secao', index: 1 }, { type: 'secao', index: 2 }, { type: 'secao', index: 3 }, { type: 'sala', numero: 9 }, { type: 'secao', index: 4 }, { type: 'secao', index: 5 }, { type: 'sala', numero: 10 }, { type: 'secao', index: 6 }, { type: 'secao', index: 7 }, { type: 'sala', numero: 11 }, { type: 'secao', index: 8 }, { type: 'secao', index: 9 }, { type: 'sala', numero: 12 },],
    '3': [{ type: 'sala', numero: 13 }, { type: 'secao', index: 0 }, { type: 'secao', index: 1 }, { type: 'sala', numero: 14 }, { type: 'secao', index: 2 }, { type: 'secao', index: 3 }, { type: 'secao', index: 4 }, { type: 'sala', numero: 15 }, { type: 'secao', index: 5 }, { type: 'sala', numero: 16 },],
    'mecanica': [{ type: 'secao', index: 0 }, { type: 'secao', index: 1 }, { type: 'sala', numero: 17 }, { type: 'secao', index: 2 }, { type: 'secao', index: 3 }, { type: 'secao', index: 4 }, { type: 'sala', numero: 18 },]
};

const SecaoArmario = React.memo(({ secao, armariosStatus }) => {
    const getStatusClass = (numero) => {
        const armario = armariosStatus.get(numero);
        if (!armario) return '';
        if (armario === 'Alugado') return styles.alugado;
        if (armario === 'Quebrado') return styles.quebrado;
        return '';
    };

    return (
        <div className={styles.secaoContainer}>
            <h3 className={styles.secaoTitulo}>{secao.titulo}</h3>
            <div className={styles.gridContainer}>
                {secao.armarios.map(num => (
                    <Link key={num} to={`/estoque-armarios/detalhe/${num}`} className={`${styles.botaoArmario} ${getStatusClass(num)}`}>
                        <span className={`${styles.botaoArmarioTexto} ${getStatusClass(num) ? styles.botaoTextoBranco : ''}`}>{num}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
});

const TituloSala = React.memo(({ numero }) => (
    <h2 className={styles.salaTitulo}>SALA {numero}</h2>
));

export default function DetalheCorredor() {
    const { id: corredorId } = useParams();
    const [armariosStatus, setArmariosStatus] = useState(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            const statusData = await buscarStatusArmarios();
            const statusMap = new Map(statusData.map(a => [a.N_armario, a.Status]));
            setArmariosStatus(statusMap);
            setLoading(false);
        };
        carregarDados();
    }, []);

    const renderLayout = () => {
        const currentLayout = layoutConfig[corredorId];
        const currentSecoes = secoesData[corredorId];

        if (!currentLayout || !currentSecoes) {
            return <p>Layout não encontrado.</p>;
        }

        return currentLayout.map((item, index) => {
            if (item.type === 'sala') {
                return <TituloSala key={`sala-${item.numero}-${index}`} numero={item.numero} />;
            }
            if (item.type === 'secao') {
                const secao = currentSecoes[item.index];
                if (!secao) return null;
                return (
                    <SecaoArmario
                        key={`secao-${secao.secao}-${index}`}
                        secao={secao}
                        armariosStatus={armariosStatus}
                    />
                );
            }
            return null;
        });
    };

    if (loading) {
        return (
            <main className={styles.safeArea}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                </div>
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
                <Link to="/estoque-armarios" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <img src={ArmarioIcon} alt="Ícone de Armários" className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Estoque de Armários</h1>
            </header>

            <h2 className={styles.subtitle}>Selecione um armário:</h2>

            <div className={styles.scrollContainer}>
                {renderLayout()}
            </div>
        </main>
    );
}