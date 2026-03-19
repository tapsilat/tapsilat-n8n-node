import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createOrderMock, TapsilatSDKMock } = vi.hoisted(() => {
	const createOrderMock = vi.fn();
	const TapsilatSDKMock = vi.fn(function TapsilatSDKMock(this: { createOrder: typeof createOrderMock }) {
		this.createOrder = createOrderMock;
	});

	return { createOrderMock, TapsilatSDKMock };
});

vi.mock('@tapsilat/tapsilat-js', () => ({
	TapsilatSDK: TapsilatSDKMock,
}));

import { Tapsilat } from '../nodes/Tapsilat/Tapsilat.node';

type MockExecuteContextOptions = {
	continueOnFail?: boolean;
};

function createMockExecuteContext(
	params: Record<string, unknown>,
	options: MockExecuteContextOptions = {},
) {
	return {
		getInputData: () => [{}],
		getNodeParameter: (name: string) => params[name],
		getCredentials: async () => ({
			bearerToken: 'token',
			baseUrl: 'https://panel.tapsilat.dev/api/v1',
		}),
		continueOnFail: () => options.continueOnFail ?? false,
		getNode: () => ({
			name: 'Tapsilat',
			type: 'tapsilat',
			id: '1',
			position: [0, 0],
			parameters: {},
			typeVersion: 1,
		}),
		helpers: {
			returnJsonArray: (data: unknown) => {
				if (Array.isArray(data)) {
					return data.map((item) => ({ json: item }));
				}
				return [{ json: data }];
			},
			constructExecutionMetaData: (
				executionData: Array<{ json: unknown }>,
				metaData: { itemData: { item: number } },
			) => {
				return executionData.map((item) => ({
					...item,
					pairedItem: metaData.itemData.item,
				}));
			},
		},
	};
}

describe('Tapsilat node execute', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		createOrderMock.mockReset();
		TapsilatSDKMock.mockClear();
	});

	it('creates an order and maps additional fields correctly', async () => {
		createOrderMock.mockResolvedValueOnce({ id: 'order-1', status: 'created' });

		const node = new Tapsilat();
		const context = createMockExecuteContext({
			resource: 'order',
			operation: 'create',
			amount: 100,
			currency: 'TRY',
			locale: 'tr',
			buyerName: 'John',
			buyerSurname: 'Doe',
			buyerEmail: 'john@example.com',
			buyerPhone: '5551234567',
			additionalFields: {
				description: 'Test order',
				callbackUrl: 'https://example.com/callback',
				conversationId: 'conv-123',
				buyerIdentityNumber: '11111111111',
				buyerIp: '127.0.0.1',
				buyerCity: 'Istanbul',
				buyerCountry: 'TR',
				buyerAddress: 'Test Address',
			},
		});

		const result = await node.execute.call(context as never);

		expect(createOrderMock).toHaveBeenCalledTimes(1);
		expect(createOrderMock).toHaveBeenCalledWith({
			amount: 100,
			currency: 'TRY',
			locale: 'tr',
			buyer: {
				name: 'John',
				surname: 'Doe',
				email: 'john@example.com',
				phone: '5551234567',
				identity_number: '11111111111',
				ip: '127.0.0.1',
				city: 'Istanbul',
				country: 'TR',
				address: 'Test Address',
			},
			description: 'Test order',
			callbackUrl: 'https://example.com/callback',
			conversation_id: 'conv-123',
		});
		expect(result).toEqual([
			[
				{
					json: { id: 'order-1', status: 'created' },
					pairedItem: 0,
				},
			],
		]);
	});

	it('returns item error payload when continueOnFail is enabled', async () => {
		createOrderMock.mockRejectedValueOnce(new Error('api down'));

		const node = new Tapsilat();
		const context = createMockExecuteContext(
			{
				resource: 'order',
				operation: 'create',
				amount: 100,
				currency: 'TRY',
				locale: 'tr',
				buyerName: 'John',
				buyerSurname: 'Doe',
				buyerEmail: 'john@example.com',
				buyerPhone: '5551234567',
				additionalFields: {},
			},
			{ continueOnFail: true },
		);

		const result = await node.execute.call(context as never);

		expect(result).toEqual([
			[
				{
					json: { error: 'api down' },
					pairedItem: 0,
				},
			],
		]);
	});

	it('throws when continueOnFail is disabled', async () => {
		createOrderMock.mockRejectedValueOnce(new Error('api down'));

		const node = new Tapsilat();
		const context = createMockExecuteContext({
			resource: 'order',
			operation: 'create',
			amount: 100,
			currency: 'TRY',
			locale: 'tr',
			buyerName: 'John',
			buyerSurname: 'Doe',
			buyerEmail: 'john@example.com',
			buyerPhone: '5551234567',
			additionalFields: {},
		});

		await expect(node.execute.call(context as never)).rejects.toThrow('api down');
	});
});
