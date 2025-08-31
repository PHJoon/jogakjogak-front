import { useReducer, useRef } from 'react';

import styles from './Input.module.css';

type InputState = {
  value: string;
  focused: boolean;
  readOnly: boolean;
  warning: boolean;
};

type SetFocusedAction = { type: 'SET_FOCUSED'; payload: boolean };
type SetReadOnlyAction = { type: 'SET_READONLY'; payload: boolean };
type SetWarningAction = { type: 'SET_WARNING'; payload: boolean };
type SetValueAction = { type: 'SET_VALUE'; payload: string };

type ActionType =
  | SetFocusedAction
  | SetReadOnlyAction
  | SetWarningAction
  | SetValueAction;

interface Props {
  id: string;
  label: string;
  defaultValue?: string;
  readOnly?: boolean;
  warning?: boolean;
  maxLength?: number;
  style?: React.CSSProperties;
}

export default function Input({
  id,
  label,
  readOnly = false,
  warning = false,
  defaultValue,
  maxLength = 30,
  style,
}: Props) {
  function reducer(state: InputState, action: ActionType) {
    switch (action.type) {
      case 'SET_FOCUSED':
        return { ...state, focused: action.payload };
      case 'SET_READONLY':
        return { ...state, readOnly: action.payload };
      case 'SET_WARNING':
        return { ...state, warning: action.payload };
      case 'SET_VALUE':
        return { ...state, value: action.payload };
      default:
        return state;
    }
  }

  const [inputState, dispatch] = useReducer(reducer, {
    value: defaultValue || '',
    focused: false,
    readOnly: readOnly,
    warning: warning,
  });

  return (
    <label
      className={styles.inputContainer}
      htmlFor={id}
      data-readonly={inputState.readOnly || undefined}
      data-focused={inputState.focused || undefined}
      data-warning={inputState.warning || undefined}
      data-has-value={inputState.value.length > 0 || undefined}
      style={style}
    >
      <div className={styles.floatingLabel}>{label}</div>

      <div className={styles.inputWrapper}>
        <input
          id={id}
          className={styles.input}
          type="text"
          onFocus={() => {
            dispatch({ type: 'SET_FOCUSED', payload: true });
          }}
          onBlur={() => {
            dispatch({ type: 'SET_FOCUSED', payload: false });
          }}
          onChange={(e) => {
            dispatch({ type: 'SET_VALUE', payload: e.target.value });
          }}
          value={inputState.value}
          readOnly={inputState.readOnly}
        />

        {inputState.value && !inputState.readOnly && (
          <div className={styles.inputCounter}>
            {inputState.value.length}/{maxLength}
          </div>
        )}
      </div>
    </label>
  );
}
