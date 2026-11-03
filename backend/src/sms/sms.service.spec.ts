import {
  BadGatewayException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Environment } from '../config/env.validation.js';
import { SmsService } from './sms.service.js';

const ACCOUNT_SID = `AC${'a'.repeat(32)}`;
const AUTH_TOKEN = 'b'.repeat(32);
const MESSAGING_SERVICE_SID = `MG${'c'.repeat(32)}`;
const FROM = '+15005550006';

function createService(
  values: Partial<Environment> = {
    TWILIO_ACCOUNT_SID: ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: AUTH_TOKEN,
    TWILIO_MESSAGING_SERVICE_SID: MESSAGING_SERVICE_SID,
  },
): SmsService {
  const config = {
    get: (key: keyof Environment) => values[key],
  } as ConfigService<Environment, true>;

  return new SmsService(config);
}

describe('SmsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('refuse d’envoyer lorsque Twilio n’est pas configuré', async () => {
    const service = createService({});

    await expect(
      service.send({ to: '+243810000001', body: 'Essai' }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('envoie le message à l’API Twilio', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        sid: 'SM123',
        status: 'queued',
        to: '+243810000001',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const service = createService();

    const receipt = await service.send({
      to: '+243810000001',
      body: 'Essai Kubagest',
    });

    expect(receipt).toEqual({
      sid: 'SM123',
      status: 'queued',
      to: '+243810000001',
    });

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
    );
    expect(request.method).toBe('POST');
    expect(request.headers).toMatchObject({
      Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
    });
    expect(String(request.body)).toContain('To=%2B243810000001');
    expect(String(request.body)).toContain(
      `MessagingServiceSid=${MESSAGING_SERVICE_SID}`,
    );
    expect(String(request.body)).not.toContain('From=');
    expect(String(request.body)).toContain('Body=Essai+Kubagest');
  });

  it('utilise un numéro expéditeur lorsque aucun service de messagerie n’est configuré', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ sid: 'SM456', status: 'queued' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await createService({
      TWILIO_ACCOUNT_SID: ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: AUTH_TOKEN,
      TWILIO_FROM_NUMBER: FROM,
    }).send({ to: '+243810000001', body: 'Essai' });

    expect(String(fetchMock.mock.calls[0][1].body)).toContain(
      `From=${encodeURIComponent(FROM)}`,
    );
  });

  it('traduit un refus Twilio sur le numéro', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'The number is unverified',
        }),
      }),
    );

    await expect(
      createService().send({ to: '+243810000001', body: 'Essai' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('signale des identifiants refusés sans les reproduire', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: `token ${AUTH_TOKEN}` }),
      }),
    );

    await expect(
      createService().send({ to: '+243810000001', body: 'Essai' }),
    ).rejects.toThrow('Identifiants Twilio refusés');
  });

  it('signale un service injoignable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down')),
    );

    await expect(
      createService().send({ to: '+243810000001', body: 'Essai' }),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});
