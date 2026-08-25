import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

describe('Popover', () => {
  it('renders trigger and content elements', async () => {
    const user = userEvent.setup();
    render(
      <Popover open>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Popover content here</PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Open popover')).toBeInTheDocument();
  });

  it('applies custom className to popover content', async () => {
    const user = userEvent.setup();
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent
          className="custom-popover"
          data-testid="popover-content"
        >
          Content
        </PopoverContent>
      </Popover>
    );

    const content = screen.getByTestId('popover-content');

    expect(content).toHaveClass('custom-popover');
    expect(content).toHaveClass('z-50');
  });

  it('uses default align and sideOffset values', async () => {
    const user = userEvent.setup();
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent data-testid="popover-content">Content</PopoverContent>
      </Popover>
    );

    const content = screen.getByTestId('popover-content');

    expect(content).toHaveClass('z-50');
    expect(content).toHaveClass('w-72');
  });

  it('forwards ref to the popover content element', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>Content</PopoverContent>
      </Popover>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('trigger fires onClick handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Popover>
        <PopoverTrigger onClick={onClick}>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
