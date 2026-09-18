import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

function DialogHarness({ onClose = vi.fn() }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open dialog
      </button>
      {isOpen ? (
        <Dialog
          onClose={() => {
            onClose();
            setIsOpen(false);
          }}
          ariaLabelledBy="test-dialog-title"
        >
          <h2 id="test-dialog-title">Test dialog</h2>
          <button type="button">First action</button>
          <button type="button">Last action</button>
        </Dialog>
      ) : null}
    </div>
  );
}

describe('Dialog', () => {
  it('moves focus inside, traps Tab, and makes the background inert', async () => {
    const user = userEvent.setup();
    const { container } = render(<DialogHarness />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    const dialog = screen.getByRole('dialog', { name: 'Test dialog' });
    expect(dialog).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    expect(container).toHaveAttribute('aria-hidden', 'true');
    expect(container).toHaveProperty('inert', true);

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Last action' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
  });

  it('closes with Escape and restores focus and the background', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<DialogHarness onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
    expect(container).not.toHaveAttribute('aria-hidden');
    expect(container).toHaveProperty('inert', false);
  });
});
