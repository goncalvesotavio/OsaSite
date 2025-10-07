import React, { useState, forwardRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import styles from './SelecionarDataRelatorio.module.css';

registerLocale('pt-BR', ptBR);

const DateInput = forwardRef(({ value, onClick, label }, ref) => (
    <button className={styles.dateButton} onClick={onClick} ref={ref}>
        <span className={styles.dateLabel}>{label}: </span>
        <span className={styles.dateValue}>{value}</span>
    </button>
));

export default function SelecionarDataRelatorio() {
    const { tipo } = useParams();
    const navigate = useNavigate();

    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());

    const formatarDataParaURL = (data) => {
        return data.toISOString().split('T')[0];
    };

    const gerarRelatorio = () => {
        const params = new URLSearchParams({
            dataInicio: formatarDataParaURL(dataInicio),
            dataFim: formatarDataParaURL(dataFim)
        });

        const basePath = "/relatorio-vendas";
        let targetPath = "";

        if (tipo === 'uniformes') {
            targetPath = `${basePath}/uniformes-resultado`;
        } else if (tipo === 'armarios') {
            targetPath = `${basePath}/armarios-resultado`;
        } else if (tipo === 'geral') {
            targetPath = `${basePath}/geral-resultado`;
        }

        if (targetPath) {
            navigate(`${targetPath}?${params.toString()}`);
        }
    };

    return (
        <main className={styles.safeArea}>
            <div className={`${styles.circle} ${styles.circleOne}`} />
            <div className={`${styles.circle} ${styles.circleTwo}`} />
            <div className={`${styles.circle} ${styles.circleThree}`} />
            <div className={`${styles.circle} ${styles.circleFour}`} />

            <header className={styles.header}>
                <Link to="/relatorio-vendas" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                <FaChartBar size={30} className={styles.headerIcon} />
                <h1 className={styles.headerTitle}>Relatório de Vendas</h1>
            </header>

            <div className={styles.content}>
                <div className={styles.card}>
                    <p className={styles.cardTitle}>Defina uma data de início e fim para gerar o relatório:</p>
                    
                    <DatePicker
                        selected={dataInicio}
                        onChange={(date) => setDataInicio(date)}
                        selectsStart
                        startDate={dataInicio}
                        endDate={dataFim}
                        dateFormat="dd/MM/yyyy"
                        locale="pt-BR"
                        customInput={<DateInput label="Início" />}
                    />
                    
                    <DatePicker
                        selected={dataFim}
                        onChange={(date) => setDataFim(date)}
                        selectsEnd
                        startDate={dataInicio}
                        endDate={dataFim}
                        minDate={dataInicio}
                        dateFormat="dd/MM/yyyy"
                        locale="pt-BR"
                        customInput={<DateInput label="Fim" />}
                    />
                    
                    <button className={styles.generateButton} onClick={gerarRelatorio}>
                        <span className={styles.generateButtonText}>Gerar Relatório</span>
                    </button>
                </div>
            </div>
        </main>
    );
}