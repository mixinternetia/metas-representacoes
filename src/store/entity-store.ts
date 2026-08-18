import { useSyncExternalStore } from "react";

export interface EntityBase {
  id: string;
  codigo: string;
}

/** Store simples em memória (Fase 2/3 — sem backend). */
export function createEntityStore<T extends EntityBase>(initial: T[]) {
  let data: T[] = initial;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  const store = {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => data,
    getById: (id: string) => data.find((d) => d.id === id),
    nextCodigo: () => String(Math.max(0, ...data.map((d) => Number(d.codigo) || 0)) + 1),
    add(item: T) {
      data = [item, ...data];
      emit();
    },
    update(item: T) {
      data = data.map((d) => (d.id === item.id ? item : d));
      emit();
    },
    remove(ids: string[]) {
      data = data.filter((d) => !ids.includes(d.id));
      emit();
    },
    setAll(next: T[]) {
      data = next;
      emit();
    },
  };

  function useAll(): T[] {
    return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  }

  function useById(id: string): T | undefined {
    return useAll().find((d) => d.id === id);
  }

  return { ...store, useAll, useById };
}

export function newId(prefix = "tmp") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
