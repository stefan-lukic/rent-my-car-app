import type React from 'react';

export const createTextChangeEvent = <T extends string>(
  name: T,
  value: string
): React.ChangeEvent<HTMLInputElement> => ({
  target: {
    name,
    value,
    type: 'text',
  } as unknown as EventTarget & HTMLInputElement,
  currentTarget: {
    name,
    value,
    type: 'text',
  } as unknown as HTMLInputElement,
  bubbles: false,
  cancelable: false,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: false,
  nativeEvent: new Event('input'),
  preventDefault: () => undefined,
  isDefaultPrevented: () => false,
  stopPropagation: () => undefined,
  isPropagationStopped: () => false,
  persist: () => undefined,
  timeStamp: Date.now(),
  type: 'input',
} as React.ChangeEvent<HTMLInputElement>);