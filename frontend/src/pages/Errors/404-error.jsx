/**
 * @file 404-error.jsx
 * @description Компонент для обробки помилки 404 (Сторінку не знайдено).
 * Відображає повідомлення про відсутню сторінку та пропонує повернутися на головну.
 */

import React from "react";
import styles from "./404-error.module.css";

/**
 * Компонент для обробки помилки 404.
 *
 * @component
 * @returns {JSX.Element} Компонент помилки 404
 */
const Error404 = () => {
  return (
    <div className={styles.errorContainer}>
      {/* Заголовок із кодом помилки */}
      <h1 className={styles.errorTitle}>404</h1>

      {/* Повідомлення про помилку */}
      <p className={styles.errorMessage}>Сторінку не знайдено</p>

      {/* Посилання для повернення на головну сторінку */}
      <a href="/" className={styles.errorLink}>
        Повернутися на головну
      </a>
    </div>
  );
};

export default Error404;
