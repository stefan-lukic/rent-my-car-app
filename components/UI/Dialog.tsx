'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const openDialogs: HTMLElement[] = [];

interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string;
  overlayClassName?: string;
  panelClassName?: string;
  closeOnBackdrop?: boolean;
  dismissible?: boolean;
}

export function Dialog({
  children,
  onClose,
  ariaLabelledBy,
  ariaDescribedBy,
  overlayClassName = '',
  panelClassName = '',
  closeOnBackdrop = false,
  dismissible = true,
}: DialogProps) {
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(
    null
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const dismissibleRef = useRef(dismissible);

  onCloseRef.current = onClose;
  dismissibleRef.current = dismissible;

  useEffect(() => {
    const element = document.createElement('div');
    element.dataset.dialogPortal = 'true';
    document.body.appendChild(element);
    setPortalElement(element);

    return () => {
      element.remove();
    };
  }, []);

  useEffect(() => {
    if (!portalElement) return;

    // Keep focus, scrolling, and assistive technology inside the topmost dialog.
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const backgroundElements = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== portalElement
    );
    const backgroundStates = backgroundElements.map((element) => ({
      element,
      inert: element.inert === true,
      ariaHidden: element.getAttribute('aria-hidden'),
    }));

    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = 'hidden';
    openDialogs.push(portalElement);
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1] !== portalElement) return;

      if (event.key === 'Escape' && dismissibleRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          document.activeElement === panelRef.current)
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const dialogIndex = openDialogs.lastIndexOf(portalElement);
      if (dialogIndex >= 0) openDialogs.splice(dialogIndex, 1);
      document.body.style.overflow = previousOverflow;
      backgroundStates.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      previouslyFocused?.focus();
    };
  }, [portalElement]);

  if (!portalElement) return null;

  return createPortal(
    <div
      role="presentation"
      className={`fixed inset-0 flex items-center justify-center overflow-y-auto overscroll-contain ${overlayClassName}`}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          closeOnBackdrop &&
          dismissibleRef.current
        ) {
          onCloseRef.current();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={`overscroll-contain outline-none ${panelClassName}`}
      >
        {children}
      </div>
    </div>,
    portalElement
  );
}
