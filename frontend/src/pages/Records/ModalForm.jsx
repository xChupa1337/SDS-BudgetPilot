import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Records.module.css";

const ModalForm = ({
  isOpen = false,
  onClose,
  formData = {},
  onInputChange,
  onSubmit,
  recordType = "default",
  categories = {},
  onDeleteRecord,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name) {
      toast.error("Будь ласка, введіть назву запису.");
      return;
    }
    if (!formData.category) {
      toast.error("Будь ласка, оберіть категорію.");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Сума повинна бути більше 0.");
      return;
    }
    if (!formData.date_time) {
      toast.error("Будь ласка, оберіть дату і час.");
      return;
    }
    
    onSubmit(event);
    toast.success("Дані успішно змінено!");
  };
  
  

  return (
    <>
      <ToastContainer />
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.modal}>
        <h2>{formData?.id ? "Редагувати запис" : "Додати запис"}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>Назва</label>
            <input
              type="text"
              name="name"
              value={formData?.name || ""}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label>Категорія</label>
            <select
              name="category"
              value={formData?.category || ""}
              onChange={onInputChange}
            >
              <option value="">Виберіть категорію</option>
              {categories?.[recordType]?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              )) || []}
            </select>
          </div>
          <div>
            <label>Сума</label>
            <input
              type="number"
              name="amount"
              value={formData?.amount || ""}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label>Опис</label>
            <textarea
              name="description"
              value={formData?.description || ""}
              onChange={onInputChange}
            ></textarea>
          </div>
          <div>
            <label>Дата і час</label>
            <input
              type="datetime-local"
              name="date_time"
              value={formData?.date_time || ""}
              onChange={onInputChange}
            />
          </div>
          <div className={styles.modalButtons}>
            <button type="submit">Зберегти</button>
            <button type="button" onClick={onClose}>
              Скасувати
            </button>
            {formData?.id && (
              <button type="button" onClick={onDeleteRecord}>
                Видалити
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalForm;
