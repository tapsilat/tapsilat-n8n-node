# n8n-nodes-tapsilat

This is an n8n community node for [Tapsilat](https://tapsilat.com) - a payment processing platform for Turkey.

It provides seamless integration with Tapsilat's payment APIs, allowing you to automate payment workflows including orders, subscriptions, refunds, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Using npm

```bash
npm install n8n-nodes-tapsilat
```

### Using n8n Community Nodes

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-tapsilat` and confirm

## Credentials

You'll need a Tapsilat API key to use this node:

1. Create an account at [Tapsilat Dashboard](https://panel.tapsilat.dev)
2. Navigate to API settings
3. Generate a new API key
4. Copy the Bearer Token

In n8n:
1. Go to **Credentials > Add Credentials**
2. Select **Tapsilat API**
3. Paste your Bearer Token
4. Optionally adjust the Base URL (default: `https://panel.tapsilat.dev/api/v1`)

## Operations

### Order

| Operation | Description |
|-----------|-------------|
| Create | Create a new payment order |
| Get | Get an order by reference ID |
| Get Status | Get the status of an order |
| Get Many | Get multiple orders with pagination |
| Cancel | Cancel an existing order |
| Refund | Process a partial refund |
| Refund All | Process a full refund |
| Terminate | Terminate an order |
| Get Payment Details | Get payment details for an order |
| Get Transactions | Get transaction history |
| Get Checkout URL | Get the checkout URL |
| Manual Callback | Trigger manual callback |

### Payment Term

| Operation | Description |
|-----------|-------------|
| Create | Create a payment term for an order |
| Get | Get a payment term |
| Update | Update a payment term |
| Delete | Delete a payment term |
| Refund | Refund a payment term |
| Terminate | Terminate a payment term |

### Subscription

| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription |
| Get | Get a subscription by reference ID |
| Get Many | Get multiple subscriptions |
| Cancel | Cancel a subscription |
| Redirect | Get redirect URL for subscription |

### Organization

| Operation | Description |
|-----------|-------------|
| Get Settings | Get organization settings |

### Health

| Operation | Description |
|-----------|-------------|
| Check | Check API health status |

## Usage Examples

### Create an Order

1. Add the **Tapsilat** node to your workflow
2. Select **Order** as Resource
3. Select **Create** as Operation
4. Fill in the required fields:
   - Amount: `100.00`
   - Currency: `TRY`
   - Locale: `tr`
   - Buyer Name: `John`
   - Buyer Surname: `Doe`
   - Buyer Email: `john@example.com`
   - Buyer Phone: `5551234567`
5. Execute the node

### Process a Refund

1. Add the **Tapsilat** node to your workflow
2. Select **Order** as Resource
3. Select **Refund** as Operation
4. Enter the Reference ID of the order
5. Enter the refund amount
6. Optionally add a reason

## Development

```bash
# Clone the repository
git clone https://github.com/tapsilat/tapsilat-n8n-node.git

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link
```

## Resources

* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Tapsilat Documentation](https://docs.tapsilat.dev)
* [Tapsilat SDK](https://github.com/tapsilat/tapsilat-js)

## License

[MIT](LICENSE.md)
