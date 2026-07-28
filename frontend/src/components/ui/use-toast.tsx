// Inspired by react-hot-toast library
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

const TOAST_LIMIT = 20;
// Tempo até remover o toast do DOM após ser fechado (ms)
const TOAST_REMOVE_DELAY = 1000;

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

// Timeouts responsible for finally removing a toast from the in‑memory state
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Timeouts responsible for auto‑dismissing a toast (closing it) after `duration`
const autoDismissTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: actionTypes.REMOVE_TOAST,
            toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

const clearFromRemoveQueue = (toastId: string | undefined) => {
    if (!toastId) return;
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
        clearTimeout(timeout);
        toastTimeouts.delete(toastId);
    }
};

type ToastItem = {
    id: string;
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    variant?: "default" | "destructive";
    className?: string;
    duration?: number;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

type ToastState = {
    toasts: ToastItem[];
};

type ToastAction =
    | { type: (typeof actionTypes)["ADD_TOAST"]; toast: ToastItem }
    | { type: (typeof actionTypes)["UPDATE_TOAST"]; toast: ToastItem }
    | { type: (typeof actionTypes)["DISMISS_TOAST"]; toastId?: string }
    | { type: (typeof actionTypes)["REMOVE_TOAST"]; toastId?: string };

export const reducer = (state: ToastState, action: ToastAction): ToastState => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action;

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t
                ),
            };
        }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            clearFromRemoveQueue(action.toastId);
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
        default:
            return state;
    }
};

const listeners: Array<(state: ToastState) => void> = [];

let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastAction) {
    if (
        action.type === actionTypes.ADD_TOAST ||
        action.type === actionTypes.DISMISS_TOAST ||
        action.type === actionTypes.REMOVE_TOAST
    ) {
        // eslint-disable-next-line no-console
        console.debug("[toast] dispatch", action.type, action);
    }
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

type ToastInput = {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    variant?: "default" | "destructive";
    className?: string;
    duration?: number;
};

function toast({ duration = 4000, ...props }: ToastInput) {
    const id = genId();

    const update = (updateProps: ToastInput) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...updateProps, id },
        });

    const dismiss = () => {
        const autoTimeout = autoDismissTimeouts.get(id);
        if (autoTimeout) {
            clearTimeout(autoTimeout);
            autoDismissTimeouts.delete(id);
        }
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
    };

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
            // Mantém a duração no próprio toast para depuração se necessário
            duration,
        },
    });

    // Auto-dismiss após "duration"
    const autoDismissTimeout = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.debug("[toast] auto-dismiss", id);
        dismiss();
    }, duration);
    autoDismissTimeouts.set(id, autoDismissTimeout);

    return {
        id,
        dismiss: () => {
            dismiss();
        },
        update,
    };
}

function useToast() {
    const [state, setState] = useState(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => {
            if (!toastId) {
                autoDismissTimeouts.forEach((timeout) => clearTimeout(timeout));
                autoDismissTimeouts.clear();
            } else {
                const autoTimeout = autoDismissTimeouts.get(toastId);
                if (autoTimeout) {
                    clearTimeout(autoTimeout);
                    autoDismissTimeouts.delete(toastId);
                }
            }

            dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
        },
    };
}

export { useToast, toast }; 