<script setup>
import { computed, ref, watch } from "vue";

import { runRules, sanitizeLeadingWhitespace, validators } from "../../utils/validation";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  min: {
    type: [String, Number],
    default: undefined,
  },
  step: {
    type: [String, Number],
    default: undefined,
  },
  minLength: {
    type: [String, Number],
    default: undefined,
  },
  maxLength: {
    type: [String, Number],
    default: undefined,
  },
  rules: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "blur", "validation"]);
const touched = ref(false);
const internalError = ref("");

const normalizedMinLength = computed(() => {
  if (props.minLength === undefined || props.minLength === null || props.minLength === "") {
    return undefined;
  }
  const parsed = Number(props.minLength);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const normalizedMaxLength = computed(() => {
  if (props.maxLength === undefined || props.maxLength === null || props.maxLength === "") {
    return undefined;
  }
  const parsed = Number(props.maxLength);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const effectiveRules = computed(() => {
  const builtInRules = [];
  const fieldLabel = props.label || "This field";

  if (props.required) {
    builtInRules.push(validators.required(fieldLabel));
  }

  if (props.type === "email") {
    builtInRules.push(validators.email());
  }

  if (normalizedMinLength.value !== undefined) {
    builtInRules.push(validators.minLength(normalizedMinLength.value));
  }

  if (normalizedMaxLength.value !== undefined) {
    builtInRules.push(validators.maxLength(normalizedMaxLength.value));
  }

  if (isTextLikeInput()) {
    builtInRules.push(validators.noLeadingWhitespace(fieldLabel));
  }

  return [...builtInRules, ...props.rules];
});

const displayError = computed(() => props.error || internalError.value);

function validateValue(value = props.modelValue) {
  if (!effectiveRules.value.length) {
    internalError.value = "";
    emit("validation", { valid: true, error: "" });
    return true;
  }

  const error = runRules(value, effectiveRules.value);
  internalError.value = error;
  emit("validation", { valid: !error, error });
  return !error;
}

function isTextLikeInput() {
  return ["text", "email", "password", "search", "url", "tel"].includes(props.type);
}

function onInput(event) {
  let nextValue = event.target.value;

  if (isTextLikeInput()) {
    nextValue = sanitizeLeadingWhitespace(nextValue);
    if (nextValue !== event.target.value) {
      event.target.value = nextValue;
    }
  }

  emit("update:modelValue", nextValue);

  if (touched.value) {
    validateValue(nextValue);
  }
}

function onKeydown(event) {
  if (!isTextLikeInput()) {
    return;
  }

  const isSpace = event.key === " ";
  const cursorAtStart = event.target.selectionStart === 0 && event.target.selectionEnd === 0;
  const isEmpty = !event.target.value;

  if (isSpace && cursorAtStart && isEmpty) {
    event.preventDefault();
  }
}

function onBlur() {
  touched.value = true;
  validateValue(props.modelValue);
  emit("blur");
}

watch(
  () => props.modelValue,
  (value) => {
    if (touched.value) {
      validateValue(value);
    }
  }
);
</script>

<template>
  <label class="block text-sm font-medium text-slate-700">
    <span v-if="label">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :step="step"
      :minlength="normalizedMinLength"
      :maxlength="normalizedMaxLength"
      class="mt-1 w-full rounded-lg border px-3 py-2 outline-none ring-brand-500 focus:ring"
      :class="displayError ? 'border-rose-300' : 'border-slate-300'"
      @input="onInput"
      @keydown="onKeydown"
      @blur="onBlur"
    />
    <span v-if="displayError" class="mt-1 block text-xs text-rose-600">{{ displayError }}</span>
  </label>
</template>
