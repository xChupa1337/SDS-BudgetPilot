/**
 * @file Register.jsx
 * @description Компонент форми реєстрації Register.
 * Дозволяє користувачам зареєструватися у системі, ввівши ім'я користувача, email, пароль та кодове слово.
 * Використовує бібліотеку Axios для обробки запитів API
 * та Toastify для сповіщень.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Register.module.css';

/**
 * Максимальна кількість одночасних сповіщень.
 * @constant {number}
 */
const MAX_TOASTS = 2;

/**
 * Черга для зберігання ID сповіщень.
 * @type {Array<string>}
 */
let toastQueue = [];

/**
 * Компонент форми реєстрації.
 * 
 * @component
 * @returns {JSX.Element} Компонент форми реєстрації
 */
const Register = () => {
  /**
   * Стан полів форми.
   * @type {[object, React.Dispatch<React.SetStateAction<object>>]}
   */
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    codeword: '',
  });

  const navigate = useNavigate();

  /**
   * Додає сповіщення до черги, перевіряючи, чи не перевищено ліміт.
   * 
   * @param {string} message - Текст сповіщення
   * @param {"info" | "success" | "error"} [type="info"] - Тип сповіщення
   */
  const addToast = (message, type = 'info') => {
    if (toastQueue.length >= MAX_TOASTS) {
      const firstToast = toastQueue.shift();
      toast.dismiss(firstToast);
    }
    const toastId = toast[type](message);
    toastQueue.push(toastId);
  };

  /**
   * Обробник змін у полях форми.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Подія зміни значення у полі форми
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Перевіряє коректність введеного email.
   * 
   * @param {string} email - Введений email
   * @returns {boolean} Чи відповідає email вимогам
   */
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      addToast('Email не відповідає вимогам', 'error');
      return false;
    }
    return true;
  };

  /**
   * Перевіряє коректність форми.
   * 
   * @returns {boolean} Чи валідна форма
   */
  const validateForm = () => {
    const { username, email, password, confirmPassword, codeword } = formData;

    if (!username || !email || !password || !confirmPassword || !codeword) {
      addToast('Будь ласка, заповніть усі поля', 'error');
      return false;
    }

    if (!validateEmail(email)) {
      return false;
    }

    if (password !== confirmPassword) {
      addToast('Паролі не співпадють.', 'error');
      return false;
    }

    if (!validatePassword(password)) {
      addToast('Пароль не відповідає вимогам.', 'error');
      return false;
    }

    return true;
  };

  /**
   * Перевіряє коректність введеного пароля.
   * 
   * @param {string} password - Введений пароль
   * @returns {boolean} Чи відповідає пароль вимогам
   */
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Мінімум 8 символів, одна маленька і велика буква
    return regex.test(password);
  };

  /**
   * Обробник відправлення форми.
   * Перевіряє валідність полів та надсилає запит до API.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - Подія форми
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      addToast(response.data.message || 'Реєстрація пройшла успішно! Тепер увійдіть у свій акаунт.', 'success');
      navigate('/login');
    } catch (error) {
      addToast(error.response?.data?.message || 'Помилка реєстрації.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h2>Реєстрація</h2>
        <input
          type="text"
          name="username"
          placeholder="Ім'я користувача"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email - xxxx@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль - xxxxxxXx"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Підтвердіть пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="codeword"
          placeholder="Кодове слово"
          value={formData.codeword}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Зареєструватися</button>
        <a href="/login" className={styles.link}>Вже маєте акаунт? Увійти</a>
        <a href="/" className={styles.link}>Перейти на головну</a>
      </form>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default Register;
