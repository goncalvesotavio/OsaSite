import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { fetchUniformes } from '@/lib/fetchUniformes.js';
import styles from './EstoqueUniformes.module.css';

import UniformeIcon from '@/assets/uniformes gestao.png';

const categorias = [
    { label: "Todos", value: "Todos" },
    { label: "Camisetas", value: "Camiseta" },
    { label: "Agasalhos", value: "Casaco" },
    { label: "Calça e Short", value: ['Calca', 'Short'] },
];

const UniformeCard = ({ item }) => (
    <div className={styles.card}>
        <img src={item.Img} alt={item.Nome} className={styles.cardImage} />
        <p className={styles.cardTitle}>{item.Nome}</p>
        <Link to={`/estoque-uniformes/${item.id_uniforme}`} className={styles.cardButton}>
            <span className={styles.cardButtonText}>Ver</span>
        </Link>
    </div>
);

export default function EstoqueUniformes() {
    const [uniformes, setUniformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [textoPesquisa, setTextoPesquisa] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');

    useEffect(() => {
        const carregarUniformes = async () => {
            setLoading(true);
            const data = await fetchUniformes();
            setUniformes(data);
            setLoading(false);
        };
        carregarUniformes();
    }, []);

    const uniformesFiltrados = useMemo(() => {
        return uniformes
            .filter(uniforme => {
                if (filtroCategoria === 'Todos') return true;
                if (Array.isArray(filtroCategoria)) {
                    return filtroCategoria.some(cat => uniforme.Categoria?.toLowerCase() === cat.toLowerCase());
                }
                return uniforme.Categoria?.toLowerCase() === filtroCategoria.toLowerCase();
            })
            .filter(uniforme => {
                return uniforme.Nome.toLowerCase().includes(textoPesquisa.toLowerCase());
            });
    }, [uniformes, textoPesquisa, filtroCategoria]);

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

            <div className={styles.content}>
                <header className={styles.header}>
                    <Link to="/" className={styles.backButton}><FaArrowLeft size={24} /></Link>
                    <img src={UniformeIcon} alt="Ícone de Uniformes" className={styles.headerIcon} />
                    <h1 className={styles.headerTitle}>Estoque de Uniformes</h1>
                </header>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Pesquise aqui..."
                        value={textoPesquisa}
                        onChange={e => setTextoPesquisa(e.target.value)}
                    />
                    <FaSearch size={20} className={styles.searchIcon} />
                </div>

                <div className={styles.categoryContainer}>
                    {categorias.map(categoria => (
                        <button
                            key={categoria.label}
                            className={`${styles.categoryButton} ${JSON.stringify(filtroCategoria) === JSON.stringify(categoria.value) ? styles.categoryButtonActive : ''}`}
                            onClick={() => setFiltroCategoria(categoria.value)}
                        >
                            <span className={`${styles.categoryButtonText} ${JSON.stringify(filtroCategoria) === JSON.stringify(categoria.value) ? styles.categoryButtonTextActive : ''}`}>
                                {categoria.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className={styles.listContainer}>
                    {uniformesFiltrados.map(item => (
                        <UniformeCard key={item.id_uniforme} item={item} />
                    ))}
                </div>
            </div>
        </main>
    );
}