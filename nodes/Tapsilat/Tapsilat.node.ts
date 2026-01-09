import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { TapsilatSDK } from '@tapsilat/tapsilat-js';

export class Tapsilat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tapsilat',
		name: 'tapsilat',
		icon: 'file:tapsilat.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Tapsilat Payment Processing Platform',
		defaults: {
			name: 'Tapsilat',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tapsilatApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Payment Term',
						value: 'paymentTerm',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Health',
						value: 'health',
					},
				],
				default: 'order',
			},

			// ============ ORDER OPERATIONS ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new order',
						action: 'Create an order',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an order by reference ID',
						action: 'Get an order',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get order status',
						action: 'Get order status',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many orders',
						action: 'Get many orders',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel an order',
						action: 'Cancel an order',
					},
					{
						name: 'Refund',
						value: 'refund',
						description: 'Process a partial refund',
						action: 'Refund an order',
					},
					{
						name: 'Refund All',
						value: 'refundAll',
						description: 'Process a full refund',
						action: 'Full refund an order',
					},
					{
						name: 'Terminate',
						value: 'terminate',
						description: 'Terminate an order',
						action: 'Terminate an order',
					},
					{
						name: 'Get Payment Details',
						value: 'getPaymentDetails',
						description: 'Get payment details for an order',
						action: 'Get payment details',
					},
					{
						name: 'Get Transactions',
						value: 'getTransactions',
						description: 'Get transaction history for an order',
						action: 'Get transactions',
					},
					{
						name: 'Get Checkout URL',
						value: 'getCheckoutUrl',
						description: 'Get checkout URL for an order',
						action: 'Get checkout URL',
					},
					{
						name: 'Manual Callback',
						value: 'manualCallback',
						description: 'Trigger manual callback for an order',
						action: 'Trigger manual callback',
					},
				],
				default: 'create',
			},

			// ============ PAYMENT TERM OPERATIONS ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a payment term',
						action: 'Create a payment term',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a payment term',
						action: 'Get a payment term',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a payment term',
						action: 'Update a payment term',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a payment term',
						action: 'Delete a payment term',
					},
					{
						name: 'Refund',
						value: 'refund',
						description: 'Refund a payment term',
						action: 'Refund a payment term',
					},
					{
						name: 'Terminate',
						value: 'terminate',
						description: 'Terminate a payment term',
						action: 'Terminate a payment term',
					},
				],
				default: 'create',
			},

			// ============ SUBSCRIPTION OPERATIONS ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a subscription',
						action: 'Create a subscription',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a subscription',
						action: 'Get a subscription',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many subscriptions',
						action: 'Get many subscriptions',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a subscription',
						action: 'Cancel a subscription',
					},
					{
						name: 'Redirect',
						value: 'redirect',
						description: 'Get redirect URL for a subscription',
						action: 'Get subscription redirect URL',
					},
				],
				default: 'create',
			},

			// ============ ORGANIZATION OPERATIONS ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['organization'],
					},
				},
				options: [
					{
						name: 'Get Settings',
						value: 'getSettings',
						description: 'Get organization settings',
						action: 'Get organization settings',
					},
				],
				default: 'getSettings',
			},

			// ============ HEALTH OPERATIONS ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['health'],
					},
				},
				options: [
					{
						name: 'Check',
						value: 'check',
						description: 'Check API health status',
						action: 'Check API health',
					},
				],
				default: 'check',
			},

			// ============ ORDER CREATE FIELDS ============
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'The amount for the order',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				options: [
					{ name: 'TRY', value: 'TRY' },
					{ name: 'USD', value: 'USD' },
					{ name: 'EUR', value: 'EUR' },
					{ name: 'GBP', value: 'GBP' },
				],
				default: 'TRY',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'The currency for the order',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'options',
				options: [
					{ name: 'Turkish', value: 'tr' },
					{ name: 'English', value: 'en' },
				],
				default: 'tr',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'The locale for the order',
			},
			{
				displayName: 'Buyer Name',
				name: 'buyerName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'First name of the buyer',
			},
			{
				displayName: 'Buyer Surname',
				name: 'buyerSurname',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'Surname of the buyer',
			},
			{
				displayName: 'Buyer Email',
				name: 'buyerEmail',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'Email of the buyer',
			},
			{
				displayName: 'Buyer Phone',
				name: 'buyerPhone',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				description: 'Phone number of the buyer',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the order',
					},
					{
						displayName: 'Callback URL',
						name: 'callbackUrl',
						type: 'string',
						default: '',
						description: 'URL to redirect after payment',
					},
					{
						displayName: 'Conversation ID',
						name: 'conversationId',
						type: 'string',
						default: '',
						description: 'Your unique conversation/transaction ID',
					},
					{
						displayName: 'Buyer Identity Number',
						name: 'buyerIdentityNumber',
						type: 'string',
						default: '',
						description: 'Identity number of the buyer',
					},
					{
						displayName: 'Buyer IP',
						name: 'buyerIp',
						type: 'string',
						default: '',
						description: 'IP address of the buyer',
					},
					{
						displayName: 'Buyer City',
						name: 'buyerCity',
						type: 'string',
						default: '',
						description: 'City of the buyer',
					},
					{
						displayName: 'Buyer Country',
						name: 'buyerCountry',
						type: 'string',
						default: '',
						description: 'Country of the buyer',
					},
					{
						displayName: 'Buyer Address',
						name: 'buyerAddress',
						type: 'string',
						default: '',
						description: 'Address of the buyer',
					},
				],
			},

			// ============ ORDER GET / STATUS / CANCEL FIELDS ============
			{
				displayName: 'Reference ID',
				name: 'referenceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getStatus', 'cancel', 'refundAll', 'getPaymentDetails', 'getTransactions', 'getCheckoutUrl', 'manualCallback'],
					},
				},
				description: 'The order reference ID',
			},

			// ============ ORDER REFUND FIELDS ============
			{
				displayName: 'Reference ID',
				name: 'referenceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['refund', 'terminate'],
					},
				},
				description: 'The order reference ID',
			},
			{
				displayName: 'Amount',
				name: 'refundAmount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['refund'],
					},
				},
				description: 'The amount to refund',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['terminate'],
					},
				},
				description: 'The reason for the termination',
			},

			// ============ ORDER GET MANY FIELDS ============
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 10,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getMany'],
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getMany'],
					},
				},
				description: 'Page number',
			},

			// ============ MANUAL CALLBACK FIELDS ============
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['manualCallback'],
					},
				},
				description: 'Optional conversation ID for the callback',
			},

			// ============ PAYMENT TERM CREATE FIELDS ============
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['create'],
					},
				},
				description: 'The order reference ID',
			},
			{
				displayName: 'Term Reference ID',
				name: 'termReferenceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['create', 'get', 'update', 'delete', 'terminate'],
					},
				},
				description: 'The payment term reference ID',
			},
			{
				displayName: 'Amount',
				name: 'termAmount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['create'],
					},
				},
				description: 'The amount for the payment term',
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['create'],
					},
				},
				description: 'Due date in YYYY-MM-DD format',
			},
			{
				displayName: 'Term Sequence',
				name: 'termSequence',
				type: 'number',
				default: 1,
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['create'],
					},
				},
				description: 'Sequence number of the term',
			},
			{
				displayName: 'Additional Fields',
				name: 'termAdditionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Required',
						name: 'required',
						type: 'boolean',
						default: true,
						description: 'Whether the term is required',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: 'pending',
						description: 'Status of the payment term',
					},
					{
						displayName: 'Data',
						name: 'data',
						type: 'string',
						default: '',
						description: 'Additional data for the term',
					},
				],
			},

			// ============ PAYMENT TERM UPDATE FIELDS ============
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
						description: 'New amount for the term',
					},
					{
						displayName: 'Due Date',
						name: 'due_date',
						type: 'string',
						default: '',
						description: 'New due date in YYYY-MM-DD format',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
						description: 'New status for the term',
					},
				],
			},

			// ============ PAYMENT TERM REFUND FIELDS ============
			{
				displayName: 'Term ID',
				name: 'termId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['refund'],
					},
				},
				description: 'The payment term ID',
			},
			{
				displayName: 'Amount',
				name: 'termRefundAmount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['refund'],
					},
				},
				description: 'The amount to refund',
			},
			{
				displayName: 'Refund Reference ID',
				name: 'refundReferenceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['refund'],
					},
				},
				description: 'Reference ID for the refund',
			},

			// ============ PAYMENT TERM TERMINATE FIELDS ============
			{
				displayName: 'Reason',
				name: 'terminateReason',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['paymentTerm'],
						operation: ['terminate'],
					},
				},
				description: 'Reason for termination',
			},

			// ============ SUBSCRIPTION CREATE FIELDS ============
			{
				displayName: 'Subscriber Name',
				name: 'subscriberName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['create'],
					},
				},
				description: 'First name of the subscriber',
			},
			{
				displayName: 'Subscriber Surname',
				name: 'subscriberSurname',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['create'],
					},
				},
				description: 'Surname of the subscriber',
			},
			{
				displayName: 'Subscriber Email',
				name: 'subscriberEmail',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['create'],
					},
				},
				description: 'Email of the subscriber',
			},
			{
				displayName: 'Subscriber Phone',
				name: 'subscriberPhone',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['create'],
					},
				},
				description: 'GSM number of the subscriber',
			},
			{
				displayName: 'Pricing Amount',
				name: 'pricingAmount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['create'],
					},
				},
				description: 'The subscription amount',
			},
			{
				displayName: 'Pricing Currency',
				name: 'pricingCurrency',
				type: 'options',
				options: [
					{ name: 'TRY', value: 'TRY' },
					{ name: 'USD', value: 'USD' },
					{ name: 'EUR', value: 'EUR' },
					{ name: 'GBP', value: 'GBP' },
				],
				default: 'TRY',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['create'],
					},
				},
				description: 'The subscription currency',
			},

			// ============ SUBSCRIPTION GET/CANCEL/REDIRECT FIELDS ============
			{
				displayName: 'Reference ID',
				name: 'subscriptionReferenceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['get', 'cancel', 'redirect'],
					},
				},
				description: 'The subscription reference ID',
			},

			// ============ SUBSCRIPTION GET MANY FIELDS ============
			{
				displayName: 'Limit',
				name: 'subscriptionLimit',
				type: 'number',
				default: 10,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['getMany'],
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'subscriptionPage',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						resource: ['subscription'],
						operation: ['getMany'],
					},
				},
				description: 'Page number',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('tapsilatApi');

		const tapsilat = new TapsilatSDK({
			bearerToken: credentials.bearerToken as string,
			baseURL: credentials.baseUrl as string,
		});

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ============ ORDER OPERATIONS ============
				if (resource === 'order') {
					if (operation === 'create') {
						const amount = this.getNodeParameter('amount', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const locale = this.getNodeParameter('locale', i) as string;
						const buyerName = this.getNodeParameter('buyerName', i) as string;
						const buyerSurname = this.getNodeParameter('buyerSurname', i) as string;
						const buyerEmail = this.getNodeParameter('buyerEmail', i) as string;
						const buyerPhone = this.getNodeParameter('buyerPhone', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const orderRequest: IDataObject = {
							amount,
							currency,
							locale,
							buyer: {
								name: buyerName,
								surname: buyerSurname,
								email: buyerEmail,
								phone: buyerPhone,
								...(additionalFields.buyerIdentityNumber && { identity_number: additionalFields.buyerIdentityNumber }),
								...(additionalFields.buyerIp && { ip: additionalFields.buyerIp }),
								...(additionalFields.buyerCity && { city: additionalFields.buyerCity }),
								...(additionalFields.buyerCountry && { country: additionalFields.buyerCountry }),
								...(additionalFields.buyerAddress && { address: additionalFields.buyerAddress }),
							},
						};

						if (additionalFields.description) {
							orderRequest.description = additionalFields.description;
						}
						if (additionalFields.callbackUrl) {
							orderRequest.callbackUrl = additionalFields.callbackUrl;
						}
						if (additionalFields.conversationId) {
							orderRequest.conversation_id = additionalFields.conversationId;
						}

						const result = await tapsilat.createOrder(orderRequest as any);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'get') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.getOrder(referenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'getStatus') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.getOrderStatus(referenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', i) as number;
						const page = this.getNodeParameter('page', i) as number;
						const result = await tapsilat.getOrders({ page, per_page: limit });
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'cancel') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.cancelOrder(referenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'refund') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const amount = this.getNodeParameter('refundAmount', i) as number;
						const result = await tapsilat.refundOrder({
							reference_id: referenceId,
							amount,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'refundAll') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.refundAllOrder(referenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'terminate') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const reason = this.getNodeParameter('reason', i) as string;
						const result = await tapsilat.terminateOrder({
							reference_id: referenceId,
							reason,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'getPaymentDetails') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.getOrderPaymentDetails(referenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'getTransactions') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.getOrderTransactions(referenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'getCheckoutUrl') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const result = await tapsilat.getCheckoutUrl(referenceId);
						responseData = { checkout_url: result } as IDataObject;
					}

					if (operation === 'manualCallback') {
						const referenceId = this.getNodeParameter('referenceId', i) as string;
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						const result = await tapsilat.orderManualCallback(referenceId, conversationId || undefined);
						responseData = result as unknown as IDataObject;
					}
				}

				// ============ PAYMENT TERM OPERATIONS ============
				if (resource === 'paymentTerm') {
					if (operation === 'create') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const termReferenceId = this.getNodeParameter('termReferenceId', i) as string;
						const amount = this.getNodeParameter('termAmount', i) as number;
						const dueDate = this.getNodeParameter('dueDate', i) as string;
						const termSequence = this.getNodeParameter('termSequence', i) as number;
						const additionalFields = this.getNodeParameter('termAdditionalFields', i) as IDataObject;

						const result = await tapsilat.createOrderTerm({
							order_id: orderId,
							term_reference_id: termReferenceId,
							amount,
							due_date: dueDate,
							term_sequence: termSequence,
							required: additionalFields.required !== false,
							status: (additionalFields.status as string) || 'pending',
							data: additionalFields.data as string,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'get') {
						const termReferenceId = this.getNodeParameter('termReferenceId', i) as string;
						const result = await tapsilat.getOrderTerm(termReferenceId);
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'update') {
						const termReferenceId = this.getNodeParameter('termReferenceId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const result = await tapsilat.updateOrderTerm({
							term_reference_id: termReferenceId,
							...updateFields,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'delete') {
						const termReferenceId = this.getNodeParameter('termReferenceId', i) as string;
						const result = await tapsilat.deleteOrderTerm({
							term_reference_id: termReferenceId,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'refund') {
						const termId = this.getNodeParameter('termId', i) as string;
						const amount = this.getNodeParameter('termRefundAmount', i) as number;
						const referenceId = this.getNodeParameter('refundReferenceId', i) as string;

						const result = await tapsilat.refundOrderTerm({
							term_id: termId,
							amount,
							reference_id: referenceId,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'terminate') {
						const termReferenceId = this.getNodeParameter('termReferenceId', i) as string;
						const reason = this.getNodeParameter('terminateReason', i) as string;

						const result = await tapsilat.terminateOrderTerm({
							term_reference_id: termReferenceId,
							reason,
						});
						responseData = result as unknown as IDataObject;
					}
				}

				// ============ SUBSCRIPTION OPERATIONS ============
				if (resource === 'subscription') {
					if (operation === 'create') {
						const subscriberName = this.getNodeParameter('subscriberName', i) as string;
						const subscriberSurname = this.getNodeParameter('subscriberSurname', i) as string;
						const subscriberEmail = this.getNodeParameter('subscriberEmail', i) as string;
						const subscriberPhone = this.getNodeParameter('subscriberPhone', i) as string;
						const pricingAmount = this.getNodeParameter('pricingAmount', i) as number;
						const pricingCurrency = this.getNodeParameter('pricingCurrency', i) as string;

						const result = await tapsilat.createSubscription({
							amount: pricingAmount,
							currency: pricingCurrency,
							user: {
								first_name: subscriberName,
								last_name: subscriberSurname,
								email: subscriberEmail,
								phone: subscriberPhone,
							},
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'get') {
						const referenceId = this.getNodeParameter('subscriptionReferenceId', i) as string;
						const result = await tapsilat.getSubscription({
							reference_id: referenceId,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'getMany') {
						const limit = this.getNodeParameter('subscriptionLimit', i) as number;
						const page = this.getNodeParameter('subscriptionPage', i) as number;
						const result = await tapsilat.listSubscriptions({ page, per_page: limit });
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'cancel') {
						const referenceId = this.getNodeParameter('subscriptionReferenceId', i) as string;
						const result = await tapsilat.cancelSubscription({
							reference_id: referenceId,
						});
						responseData = result as unknown as IDataObject;
					}

					if (operation === 'redirect') {
						const referenceId = this.getNodeParameter('subscriptionReferenceId', i) as string;
						const result = await tapsilat.redirectSubscription({
							subscription_id: referenceId,
						});
						responseData = result as unknown as IDataObject;
					}
				}

				// ============ ORGANIZATION OPERATIONS ============
				if (resource === 'organization') {
					if (operation === 'getSettings') {
						const result = await tapsilat.getOrganizationSettings();
						responseData = result as unknown as IDataObject;
					}
				}

				// ============ HEALTH OPERATIONS ============
				if (resource === 'health') {
					if (operation === 'check') {
						const result = await tapsilat.healthCheck();
						responseData = result as unknown as IDataObject;
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
