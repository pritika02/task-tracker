import { useCallback, useRef, useState } from "react";

let idCounter = 0;

export const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, tone = "info", duration = 3200) => {
      const id = ++idCounter;
      setToasts((current) => [...current, { id, message, tone }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
};
