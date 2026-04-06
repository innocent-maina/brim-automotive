// composables/useComparison.ts
import type { CarListing } from "~/types";

const MAX_COMPARE = 3;

export const useComparison = () => {
  const compareIds = useState<string[]>("comparison:ids", () => []);

  const canAdd = computed(() => compareIds.value.length < MAX_COMPARE);
  const count = computed(() => compareIds.value.length);

  const isInComparison = (id: string) => compareIds.value.includes(id);

  const addToComparison = (id: string) => {
    if (compareIds.value.includes(id)) return;
    if (!canAdd.value) return;
    compareIds.value = [...compareIds.value, id];
  };

  const removeFromComparison = (id: string) => {
    compareIds.value = compareIds.value.filter((i) => i !== id);
  };

  const toggleComparison = (id: string) => {
    if (isInComparison(id)) removeFromComparison(id);
    else addToComparison(id);
  };

  const clearComparison = () => {
    compareIds.value = [];
  };

  return {
    compareIds,
    canAdd,
    count,
    isInComparison,
    addToComparison,
    removeFromComparison,
    toggleComparison,
    clearComparison,
    MAX_COMPARE,
  };
};
