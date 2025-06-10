/**
 * @file Records.jsx
 * @description Компонент для управління записами доходів та витрат.
 * Дозволяє користувачам переглядати, додавати, редагувати та видаляти записи.
 * Використовує бібліотеку Axios для обробки запитів API та Toastify для сповіщень.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import styles from "./Records.module.css";
import SearchAndFilter from "./SearchAndFilter";
import RecordsTable from "./RecordsTable";
import ModalForm from "./ModalForm";
import { categories } from "./constants";

/**
 * Компонент для управління записами доходів та витрат.
 * 
 * @component
 * @returns {JSX.Element} Компонент для управління записами
 */
const Records = () => {
  /**
   * Стан для зберігання списку записів.
   * @type {Array}
   */
  const [records, setRecords] = useState([]);

  /**
   * Стан для управління відкриттям модального вікна.
   * @type {boolean}
   */
  const [modalIsOpen, setModalIsOpen] = useState(false);

  /**
   * Стан для зберігання типу запису (дохід або витрата).
   * @type {string}
   */
  const [recordType, setRecordType] = useState("");

  /**
   * Стан для зберігання даних форми.
   * @type {Object}
   */
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    description: "",
    date_time: "",
  });

  /**
   * Стан для зберігання пошукового запиту для доходів.
   * @type {string}
   */
  const [searchIncome, setSearchIncome] = useState("");

  /**
   * Стан для зберігання пошукового запиту для витрат.
   * @type {string}
   */
  const [searchExpense, setSearchExpense] = useState("");

  /**
   * Стан для зберігання фільтрів для доходів.
   * @type {Object}
   */
  const [incomeFilter, setIncomeFilter] = useState({ operator: ">", amount: "" });

  /**
   * Стан для зберігання фільтрів для витрат.
   * @type {Object}
   */
  const [expenseFilter, setExpenseFilter] = useState({ operator: ">", amount: "" });

  /**
   * Стан для зберігання фільтрів за датою для доходів.
   * @type {Object}
   */
  const [incomeDateFilter, setIncomeDateFilter] = useState({ startDate: "", endDate: "" });

  /**
   * Стан для зберігання фільтрів за датою для витрат.
   * @type {Object}
   */
  const [expenseDateFilter, setExpenseDateFilter] = useState({ startDate: "", endDate: "" });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /**
   * Ефект для завантаження записів при монтуванні компонента.
   */
  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/records/${user.id}`);
        setRecords(response.data);
      } catch (error) {
        console.error("Помилка отримання записів:", error.message);
      }
    };

    fetchRecords();
  }, [user]);

  if (!user) {
    return (
      <div className={styles.unauthContainer}>
        <header className={styles.header}>
          <div className={styles.logo}>SpendWise</div>
          <div className={styles.authButtons}>
            <button className={styles.button} onClick={() => navigate("/login")}>
              Увійти
            </button>
            <button className={`${styles.button} ${styles.registerButton}`} onClick={() => navigate("/register")}>
              Зареєструватися
            </button>
          </div>
        </header>
        <main className={styles.mainContent}>
          <h1 className={styles.title}>Скористайтесь нашим сервісом</h1>
        </main>
      </div>
    );
  }

  /**
   * Відкриває модальне вікно для додавання або редагування запису.
   * 
   * @param {string} type - Тип запису (дохід або витрата)
   * @param {Object} [record=null] - Існуючий запис для редагування
   */
  const openModal = (type, record = null) => {
    setRecordType(type);
    if (record) {
      setFormData({
        id: record.id,
        name: record.name,
        category: record.category,
        amount: record.amount,
        description: record.description,
        date_time: formatDateForInput(record.date_time),
      });
    } else {
      setFormData({ name: "", category: "", amount: "", description: "", date_time: "" });
    }
    setModalIsOpen(true);
  };

  /**
   * Форматує дату для відображення в полі введення.
   * 
   * @param {string} date - Дата у форматі рядка
   * @returns {string} Відформатована дата
   */
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /**
   * Обробник зміни значень полів форми.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Подія зміни значення поля
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Обробник відправлення форми.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - Подія відправлення форми
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        userId: user.id,
        type: recordType,
        ...formData,
      };

      if (formData.id) {
        await axios.put("http://localhost:5000/api/records", data);
      } else {
        await axios.post("http://localhost:5000/api/records", data);
      }

      setModalIsOpen(false);
      const response = await axios.get(`http://localhost:5000/api/records/${user.id}`);
      setRecords(response.data);

      toast.success("Запис успішно збережено!", { position: "top-right" });
    } catch (error) {
      console.error("Помилка збереження запису:", error.message);
      toast.error("Помилка при збереженні запису.", { position: "top-right" });
    }
  };

  /**
   * Обробник видалення запису.
   */
  const handleDeleteRecord = async () => {
    if (window.confirm("Ви впевнені, що хочете видалити цей запис?")) {
      try {
        await axios.delete("http://localhost:5000/api/records", {
          data: { id: formData.id, type: recordType },
        });
        const response = await axios.get(`http://localhost:5000/api/records/${user.id}`);
        setRecords(response.data);
        setModalIsOpen(false);
      } catch (error) {
        console.error("Помилка видалення запису:", error.message);
      }
    }
  };

  /**
   * Скорочує текст до вказаної довжини.
   * 
   * @param {string} text - Текст для скорочення
   * @param {number} maxLength - Максимальна довжина тексту
   * @returns {string} Скорочений текст
   */
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  /**
   * Фільтрує записи за сумою.
   * 
   * @param {Array} records - Список записів
   * @param {Object} filter - Фільтр (оператор та сума)
   * @returns {Array} Відфільтровані записи
   */
  const filterByAmount = (records, filter) => {
    const { operator, amount } = filter;
    if (!amount) return records;
    const numericAmount = parseFloat(amount);

    return records.filter((record) => {
      const recordAmount = parseFloat(record.amount);
      switch (operator) {
        case ">":
          return recordAmount > numericAmount;
        case "<":
          return recordAmount < numericAmount;
        case ">=":
          return recordAmount >= numericAmount;
        case "<=":
          return recordAmount <= numericAmount;
        default:
          return true;
      }
    });
  };

  /**
   * Фільтрує записи за датою.
   * 
   * @param {Array} records - Список записів
   * @param {string} startDate - Початкова дата
   * @param {string} endDate - Кінцева дата
   * @returns {Array} Відфільтровані записи
   */
  const filterByDate = (records, startDate, endDate) => {
    if (!startDate && !endDate) return records;

    return records.filter((record) => {
      const recordDate = new Date(record.date_time);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;

      return true;
    });
  };

  const filteredIncomeRecords = filterByDate(
    filterByAmount(
      records.filter(
        (record) =>
          record.type === "income" &&
          (record.name.toLowerCase().includes(searchIncome.toLowerCase()) ||
            record.category.toLowerCase().includes(searchIncome.toLowerCase()))
      ),
      incomeFilter
    ),
    incomeDateFilter.startDate,
    incomeDateFilter.endDate
  );

  const filteredExpenseRecords = filterByDate(
    filterByAmount(
      records.filter(
        (record) =>
          record.type === "expense" &&
          (record.name.toLowerCase().includes(searchExpense.toLowerCase()) ||
            record.category.toLowerCase().includes(searchExpense.toLowerCase()))
      ),
      expenseFilter
    ),
    expenseDateFilter.startDate,
    expenseDateFilter.endDate
  );

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerLeft}>SpendWise</div>
        <div className={styles.headerRight}>
          <button className={styles.profileButton} onClick={() => navigate("/profile")}>
            Вітаємо, {user?.username}!
          </button>
          <button className={styles.logoutButton} onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }}>
            Вийти
          </button>
        </div>
      </header>
      <ToastContainer />
      <h3 className={styles.sectionTitle}>Доходи</h3>
      <SearchAndFilter
        searchValue={searchIncome}
        onSearchChange={setSearchIncome}
        filterOperator={incomeFilter.operator}
        onFilterOperatorChange={(value) => setIncomeFilter({ ...incomeFilter, operator: value })}
        filterAmount={incomeFilter.amount}
        onFilterAmountChange={(value) => setIncomeFilter({ ...incomeFilter, amount: value })}
        startDate={incomeDateFilter.startDate}
        onStartDateChange={(value) => setIncomeDateFilter({ ...incomeDateFilter, startDate: value })}
        endDate={incomeDateFilter.endDate}
        onEndDateChange={(value) => setIncomeDateFilter({ ...incomeDateFilter, endDate: value })}
        onAddRecord={() => openModal("income")}
        buttonLabel={<><FaPlus style={{ marginRight: "8px" }} /> Додати дохід</>}
        buttonClass={styles.income}
      />
      <RecordsTable
        records={filteredIncomeRecords}
        onEditRecord={(record) => openModal(record.type, record)}
        truncateText={truncateText}
      />

      <h3 className={styles.sectionTitle}>Витрати</h3>
      <SearchAndFilter
        searchValue={searchExpense}
        onSearchChange={setSearchExpense}
        filterOperator={expenseFilter.operator}
        onFilterOperatorChange={(value) => setExpenseFilter({ ...expenseFilter, operator: value })}
        filterAmount={expenseFilter.amount}
        onFilterAmountChange={(value) => setExpenseFilter({ ...expenseFilter, amount: value })}
        startDate={expenseDateFilter.startDate}
        onStartDateChange={(value) => setExpenseDateFilter({ ...expenseDateFilter, startDate: value })}
        endDate={expenseDateFilter.endDate}
        onEndDateChange={(value) => setExpenseDateFilter({ ...expenseDateFilter, endDate: value })}
        onAddRecord={() => openModal("expense")}
        buttonLabel={<><FaPlus style={{ marginRight: "8px" }} /> Додати витрату</>}
        buttonClass={styles.expense}
      />
      <RecordsTable
        records={filteredExpenseRecords}
        onEditRecord={(record) => openModal(record.type, record)}
        truncateText={truncateText}
      />

      <ModalForm
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        recordType={recordType}
        categories={categories}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
};

export default Records;