import ModalForm from "../pages/Records/ModalForm";
import { useState } from "react";

export default {
  title: "Components/ModalForm",
  component: ModalForm,
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
  },
};

const Template = (args) => {
  const [open, setOpen] = useState(args.isOpen);
  return <ModalForm {...args} isOpen={open} onClose={() => setOpen(false)} />;
};

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  formData: { id: "test-id", name: "Тест", category: "Їжа", amount: 100, description: "Обід", date_time: "2024-02-07T12:00" },
  recordType: "income",
  categories: {
    income: ["Зарплата", "Фріланс"],
    expense: ["Їжа", "Транспорт"],
  },
};

export const WithError = Template.bind({});
WithError.args = {
  isOpen: true,
  formData: { name: "", category: "", amount: 0, description: "", date_time: "" },
  recordType: "expense",
  categories: {
    income: ["Зарплата", "Фріланс"],
    expense: ["Їжа", "Транспорт"],
  },
  errorMessage: "Помилка валідації!",
};

export const Closed = Template.bind({});
Closed.args = {
  isOpen: false,
};
