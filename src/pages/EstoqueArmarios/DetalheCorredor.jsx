import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './DetalheCorredor.module.css';

import ArmarioIcon from '../../assets/armarios gestao.png';

const secoesCorredor1=[{secao:1,titulo:"Armário Nº1",armarios:Array.from({length:20},(_,i)=>i+1)},{secao:2,titulo:"Armário Nº2",armarios:Array.from({length:16},(_,i)=>i+21)},{secao:3,titulo:"Armário Nº3",armarios:Array.from({length:16},(_,i)=>i+37)},{secao:4,titulo:"Armário Nº4",armarios:Array.from({length:16},(_,i)=>i+53)},{secao:5,titulo:"Armário Nº5",armarios:Array.from({length:16},(_,i)=>i+69)},{secao:6,titulo:"Armário Nº6",armarios:Array.from({length:20},(_,i)=>i+85)},{secao:7,titulo:"Armário Nº7",armarios:Array.from({length:16},(_,i)=>i+105)},{secao:8,titulo:"Armário Nº8",armarios:Array.from({length:16},(_,i)=>i+121)},{secao:9,titulo:"Armário Nº9",armarios:Array.from({length:16},(_,i)=>i+137)},{secao:10,titulo:"Armário Nº10",armarios:Array.from({length:16},(_,i)=>i+153)},{secao:11,titulo:"Armário Nº11",armarios:Array.from({length:20},(_,i)=>i+169)},{secao:12,titulo:"Armário Nº12",armarios:Array.from({length:16},(_,i)=>i+189)}];
const secoesCorredor2=[{secao:13,titulo:"Armário Nº13",armarios:Array.from({length:16},(_,i)=>i+205)},{secao:14,titulo:"Armário Nº14",armarios:Array.from({length:16},(_,i)=>i+221)},{secao:15,titulo:"Armário Nº15",armarios:Array.from({length:20},(_,i)=>i+237)},{secao:16,titulo:"Armário Nº16",armarios:Array.from({length:16},(_,i)=>i+257)},{secao:17,titulo:"Armário Nº17",armarios:Array.from({length:16},(_,i)=>i+273)},{secao:18,titulo:"Armário Nº18",armarios:Array.from({length:16},(_,i)=>i+289)},{secao:19,titulo:"Armário Nº19",armarios:Array.from({length:16},(_,i)=>i+305)},{secao:20,titulo:"Armário Nº20",armarios:Array.from({length:16},(_,i)=>i+321)},{secao:21,titulo:"Armário Nº21",armarios:Array.from({length:16},(_,i)=>i+337)},{secao:22,titulo:"Armário Nº22",armarios:Array.from({length:16},(_,i)=>i+353)}];
const secoesCorredor3=[{secao:23,titulo:"Armário Nº23",armarios:Array.from({length:20},(_,i)=>i+369)},{secao:24,titulo:"Armário Nº24",armarios:Array.from({length:16},(_,i)=>i+389)},{secao:25,titulo:"Armário Nº25",armarios:Array.from({length:16},(_,i)=>i+405)},{secao:26,titulo:"Armário Nº26",armarios:Array.from({length:16},(_,i)=>i+421)},{secao:27,titulo:"Armário Nº27",armarios:Array.from({length:16},(_,i)=>i+437)},{secao:28,titulo:"Armário Nº28",armarios:Array.from({length:20},(_,i)=>i+453)}];
const secoesMecanica=[{secao:29,titulo:"Armário Nº29",armarios:Array.from({length:20},(_,i)=>i+473)},{secao:30,titulo:"Armário Nº30",armarios:Array.from({length:20},(_,i)=>i+493)},{secao:31,titulo:"Armário Nº31",armarios:Array.from({length:8},(_,i)=>i+513)},{secao:32,titulo:"Armário Nº32",armarios:Array.from({length:8},(_,i)=>i+521)},{secao:33,titulo:"Armário Nº33",armarios:Array.from({length:8},(_,i)=>i+529)}];

const SecaoArmario = ({ secao }) => (
    <div className={styles.secaoContainer}>
        <h3 className={styles.secaoTitulo}>{secao.titulo}</h3>
        <div className={styles.gridContainer}>
            {secao.armarios.map(num => (
                <Link key={num} to={`/estoque-armarios/detalhe/${num}`} className={styles.botaoArmario}>
                    <span className={styles.botaoArmarioTexto}>{num}</span>
                </Link>
            ))}
        </div>
    </div>
);

const LinhaSala = ({ numero }) => (
    <div className={styles.linhaSala}>
        <div className={styles.sidebarNumero}>
            <span className={styles.sidebarTexto}>SALA</span>
            <span className={styles.sidebarTexto}>{numero}</span>
        </div>
        <div className={styles.secaoEspaco} />
    </div>
);

const LayoutCorredor1 = () => <><LinhaSala numero={1} /><SecaoArmario secao={secoesCorredor1[0]} /><SecaoArmario secao={secoesCorredor1[1]} /><LinhaSala numero={2} /><SecaoArmario secao={secoesCorredor1[2]} /><SecaoArmario secao={secoesCorredor1[3]} /><SecaoArmario secao={secoesCorredor1[4]} /><LinhaSala numero={3} /><SecaoArmario secao={secoesCorredor1[5]} /><SecaoArmario secao={secoesCorredor1[6]} /><LinhaSala numero={4} /><SecaoArmario secao={secoesCorredor1[7]} /><LinhaSala numero={5} /><SecaoArmario secao={secoesCorredor1[8]} /><SecaoArmario secao={secoesCorredor1[9]} /><LinhaSala numero={6} /><SecaoArmario secao={secoesCorredor1[10]} /><SecaoArmario secao={secoesCorredor1[11]} /><LinhaSala numero={7} /></>;
const LayoutCorredor2 = () => <><SecaoArmario secao={secoesCorredor2[0]} /><LinhaSala numero={8} /><SecaoArmario secao={secoesCorredor2[1]} /><SecaoArmario secao={secoesCorredor2[2]} /><SecaoArmario secao={secoesCorredor2[3]} /><LinhaSala numero={9} /><SecaoArmario secao={secoesCorredor2[4]} /><SecaoArmario secao={secoesCorredor2[5]} /><LinhaSala numero={10} /><SecaoArmario secao={secoesCorredor2[6]} /><SecaoArmario secao={secoesCorredor2[7]} /><LinhaSala numero={11} /><SecaoArmario secao={secoesCorredor2[8]} /><SecaoArmario secao={secoesCorredor2[9]} /><LinhaSala numero={12} /></>;
const LayoutCorredor3 = () => <><LinhaSala numero={13} /><SecaoArmario secao={secoesCorredor3[0]} /><SecaoArmario secao={secoesCorredor3[1]} /><LinhaSala numero={14} /><SecaoArmario secao={secoesCorredor3[2]} /><SecaoArmario secao={secoesCorredor3[3]} /><SecaoArmario secao={secoesCorredor3[4]} /><LinhaSala numero={15} /><SecaoArmario secao={secoesCorredor3[5]} /><LinhaSala numero={16} /></>;
const LayoutMecanica = () => <><SecaoArmario secao={secoesMecanica[0]} /><SecaoArmario secao={secoesMecanica[1]} /><LinhaSala numero={17} /><SecaoArmario secao={secoesMecanica[2]} /><SecaoArmario secao={secoesMecanica[3]} /><SecaoArmario secao={secoesMecanica[4]} /><LinhaSala numero={18} /></>;

export default function DetalheCorredor() {
    const { id: corredorId } = useParams();

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
                <div className={styles.linhaConectora} />
                {corredorId === '1' && <LayoutCorredor1 />}
                {corredorId === '2' && <LayoutCorredor2 />}
                {corredorId === '3' && <LayoutCorredor3 />}
                {corredorId === 'mecanica' && <LayoutMecanica />}
            </div>
        </main>
    );
}