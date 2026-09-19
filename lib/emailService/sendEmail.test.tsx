import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  sendMail: vi.fn(),
  createTestAccount: vi.fn(),
  createTransport: vi.fn(),
  getTestMessageUrl: vi.fn(),
}));

vi.mock('nodemailer', () => ({
  default: {
    createTestAccount: mocks.createTestAccount,
    createTransport: mocks.createTransport,
    getTestMessageUrl: mocks.getTestMessageUrl,
  },
}));

import { sendCancellationNotificationToCustomer } from './sendEmail';

describe('cancellation email', () => {
  beforeEach(() => {
    mocks.sendMail.mockResolvedValue({});
    mocks.createTestAccount.mockResolvedValue({ user: 'test', pass: 'test' });
    mocks.createTransport.mockReturnValue({ sendMail: mocks.sendMail });
    mocks.getTestMessageUrl.mockReturnValue(false);
  });

  it('tells the client which owner cancelled, which car, and which dates', async () => {
    await sendCancellationNotificationToCustomer({
      customerEmail: 'ana@example.com',
      customerName: 'Ana',
      carName: 'Audi A4',
      startDate: new Date('2026-09-21T10:00:00.000Z'),
      endDate: new Date('2026-09-23T10:00:00.000Z'),
      cancelledByName: 'the car owner (Milan)',
    });

    expect(mocks.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ana@example.com',
        subject: 'Reservation Cancelled: Audi A4',
        text: expect.stringContaining(
          'Your reservation for Audi A4 has been cancelled by the car owner (Milan).'
        ),
        html: expect.stringContaining(
          'Pickup Date:</strong> 2026-09-21 10:00 UTC'
        ),
      })
    );
    const message = mocks.sendMail.mock.calls[0][0];
    expect(message.text).toContain('Pickup Date: 2026-09-21 10:00 UTC');
    expect(message.text).toContain('Return Date: 2026-09-23 10:00 UTC');
    expect(message.html).toContain(
      'Return Date:</strong> 2026-09-23 10:00 UTC'
    );
  });
});
