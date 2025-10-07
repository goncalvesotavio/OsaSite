import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TelaInicio.module.css';

import pedidosIcon from '@/assets/pedidos.png';
import uniformesIcon from '@/assets/uniformes gestao.png';
import armariosIcon from '@/assets/armarios gestao.png';
import relatorioIcon from '@/assets/relatorio.png';
import contratoIcon from '@/assets/controle-contrato.png';

const MenuButton = ({ iconSource, title }) => {
  return (
    <button className={styles.button}>
      <img src={iconSource} alt="" className={styles.buttonIconImage} />
      <span className={styles.buttonText}>{title}</span>
    </button>
  );
};

export default function TelaInicio() {
  return (
    <main className={styles.safeArea}>
      <div className={styles.container}>
        <div className={`${styles.circle} ${styles.circleOne}`} />
        <div className={`${styles.circle} ${styles.circleTwo}`} />
        <div className={`${styles.circle} ${styles.circleThree}`} />
        <div className={`${styles.circle} ${styles.circleFour}`} />

        <div className={styles.content}>
          <h1 className={styles.title}>
            Bem-Vindo! O que {'\n'} gostaria de consultar hoje?
          </h1>

          <div className={styles.buttonGrid}>
            <Link to="/pedidos">
              <MenuButton iconSource={pedidosIcon} title="Pedidos" />
            </Link>

            <Link to="/estoque-uniformes">
              <MenuButton iconSource={uniformesIcon} title="Estoque Uniformes" />
            </Link>

            <Link to="/estoque-armarios">
              <MenuButton iconSource={armariosIcon} title="Estoque Armários" />
            </Link>

            <Link to="/relatorio-vendas">
              <MenuButton iconSource={relatorioIcon} title="Relatório de Vendas" />
            </Link>

            <Link to="/controle-contrato">
              <MenuButton iconSource={contratoIcon} title="Controle Contrato" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}