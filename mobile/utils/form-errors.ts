export const handleServerErrors = (form: any, error: any) => {
  const serverData = error.response?.data;
  
  // Якщо це не помилка сервера, просто виходимо
  if (!serverData) {
    console.error('Network or Unknown Error:', error);
    return;
  }

  const { statusCode, message } = serverData;

  if (statusCode === 400 || statusCode === 401) {
    // 1. ПЕРЕТВОРЮЄМО ВСЕ В МАСИВ
    // Якщо прийшов рядок "Invalid password", робимо ["Invalid password"]
    // Якщо вже масив ["Email used", "Username used"], залишаємо як є
    const errors: string[] = Array.isArray(message) ? message : [message];

    // 2. Отримуємо назви полів твоєї форми (email, username, password...)
    const formFields = Object.keys(form.state.values);

    errors.forEach((msg: string) => {
      const lowerMsg = msg.toLowerCase();

      // 3. ШУКАЄМО ВІДПОВІДНІСТЬ
      // Перевіряємо, чи міститься назва якогось поля форми у тексті помилки
      const targetField = formFields.find((field) =>
        lowerMsg.includes(field.toLowerCase())
      );

      if (targetField) {
        form.setFieldMeta(targetField as any, (prev: any) => ({
          ...prev,
          errorMap: { onChange: msg },
        }));
      } else {
        // Якщо помилка не стосується конкретного поля (напр. "Something went wrong")
        // Можна виводити як загальний алерт або в консоль
        console.warn('Field not found for error:', msg);
      }
    });
  }
};