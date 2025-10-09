import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TelaInicio.module.css';

import pedidosIcon from '@/assets/pedidos.png';
import uniformesIcon from '@/assets/uniformes gestao.png';
import armariosIcon from '@/assets/armarios gestao.png';
import relatorioIcon from '@/assets/relatorio.png';
import contratoIcon from '@/assets/controle-contrato.png';

export default function TelaInicio() {
  return (
    <main className={styles.safeArea}>
      <div className={styles.container}>
        <div className={`${styles.circle} ${styles.circleOne}`} />
        <div className={`${styles.circle} ${styles.circleTwo}`} />
        <div className={`${styles.circle} ${styles.circleThree}`} />
        <div className={`${styles.circle} ${styles.circleFour}`} />

        <div className={styles.content}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              Bem-Vindo! {'\n'}  O que gostaria de consultar hoje?
            </h1>
          </div>

          <div className={styles.buttonContainer}>
            <Link to="/pedidos" className={styles.button}>
              <img src={pedidosIcon} alt="" className={styles.buttonIconImage} />
              <span className={styles.buttonText}>Pedidos</span>
            </Link>
            <Link to="/estoque-uniformes" className={styles.button}>
              <img src={uniformesIcon} alt="" className={styles.buttonIconImage} />
              <span className={styles.buttonText}>Estoque Uniformes</span>
            </Link>
            <Link to="/estoque-armarios" className={styles.button}>
              <img src={armariosIcon} alt="" className={styles.buttonIconImage} />
              <span className={styles.buttonText}>Estoque Armários</span>
            </Link>
            <Link to="/relatorio-vendas" className={styles.button}>
              <img src={relatorioIcon} alt="" className={styles.buttonIconImage} />
              <span className={styles.buttonText}>Relatório de Vendas</span>
            </Link>
            <Link to="/controle-contrato" className={styles.button}>
              <img src={contratoIcon} alt="" className={styles.buttonIconImage} />
              <span className={styles.buttonText}>Controle Contrato</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}