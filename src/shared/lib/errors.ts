export const toUserMessage = (error: unknown, fallback: string) => {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.toLowerCase();

  if (message.includes("email rate limit exceeded")) {
    return "Превышен лимит отправки писем. Попробуйте позже или отключите подтверждение почты в Supabase.";
  }
  if (message.includes("email signups are disabled") || message.includes("signup is disabled")) {
    return "Регистрация по email отключена в настройках Supabase.";
  }
  if (message.includes("invalid login credentials")) {
    return "Неверный email или пароль.";
  }
  if (message.includes("user already registered")) {
    return "Пользователь с таким email уже зарегистрирован.";
  }
  if (message.includes("email not confirmed")) {
    return "Email не подтвержден. Проверьте почту или отключите подтверждение в Supabase.";
  }
  if (message.includes("violates row-level security")) {
    return "Недостаточно прав для этого действия. Проверьте политики RLS в Supabase.";
  }

  return error.message || fallback;
};
