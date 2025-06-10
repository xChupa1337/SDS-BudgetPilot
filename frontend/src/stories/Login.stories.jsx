import React from "react";
import { MemoryRouter } from "react-router-dom";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Login from "../pages/Login/Login.jsx";

export default {
  title: "Components/Login",
  component: Login,
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
};

const Template = (args) => <Login {...args} />;

export const Default = Template.bind({});

export const ValidationError = Template.bind({});

ValidationError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = await canvas.getByRole("button", { name: /ввійти/i });
  await userEvent.click(button);
  await expect(canvas.getByText("Будь ласка, заповніть усі поля")).toBeInTheDocument();
};

export const SuccessfulLogin = Template.bind({});

SuccessfulLogin.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByPlaceholderText("Email - xxxx@gmail.com"), "test@example.com");
  await userEvent.type(canvas.getByPlaceholderText("Пароль - xxxxxxXx"), "123456Cd");
  const button = await canvas.getByRole("button", { name: /ввійти/i });
  await userEvent.click(button);
  await expect(canvas.getByText("Вхід виконано успішно!")).toBeInTheDocument();
};
