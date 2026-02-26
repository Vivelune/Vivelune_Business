// src/features/triggers/components/stripe-trigger/STRIPE_VARIABLES_GUIDE.md

# Stripe Trigger Variables Guide

When your workflow is triggered by a Stripe event, the following variables are available to use in subsequent nodes.

## 📦 Available Variables

### Basic Variables (Easiest to Use)
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `{{stripe.amount}}` | Payment amount in cents | `10000` (=$100.00) |
| `{{stripe.currency}}` | Currency code | `"usd"` |
| `{{stripe.customerId}}` | Stripe customer ID | `"cus_U32ItpQ6M9FKjR"` |
| `{{stripe.eventType}}` | Type of Stripe event | `"checkout.session.completed"` |
| `{{stripe.status}}` | Status of the payment | `"complete"` |
| `{{stripe.customerEmail}}` | Customer's email | `"customer@example.com"` |
| `{{stripe.customerName}}` | Customer's name | `"Atif Shafique"` |

### Customer Details
| Variable | Description | Example |
|----------|-------------|---------|
| `{{stripe.fullData.customer_details.email}}` | Customer email | `"atifshafiq2250@gmail.com"` |
| `{{stripe.fullData.customer_details.name}}` | Customer name | `"Atif Shafique"` |
| `{{stripe.fullData.customer_details.address.country}}` | Country code | `"AE"` |
| `{{stripe.fullData.customer_details.address.city}}` | City | `"Dubai"` |

### Shipping Information
| Variable | Description | Example |
|----------|-------------|---------|
| `{{stripe.shippingName}}` | Shipping recipient name | `"Atif Shafique"` |
| `{{stripe.shippingAddress.line1}}` | Address line 1 | `"Vivelune"` |
| `{{stripe.shippingAddress.city}}` | City | `"Dubai"` |
| `{{stripe.shippingAddress.country}}` | Country | `"AE"` |
| `{{stripe.shippingAddress.postal_code}}` | Postal code | `""` |

### Metadata (Custom Data You Added)
| Variable | Description | Example |
|----------|-------------|---------|
| `{{stripe.metadata.clerkUserId}}` | Your user ID | `"user_3AByRRd7d6XT69eEEaKxb1LG4pv"` |
| `{{stripe.metadata.userEmail}}` | User email | `"atifshafiq2250@gmail.com"` |
| `{{stripe.metadata.productIds}}` | Product IDs | `"15d9f554-40bb-459b-bd11-222758bfbd2f"` |
| `{{stripe.metadata.quantities}}` | Quantities | `"1"` |

### Full Data (Everything)
| Variable | Description |
|----------|-------------|
| `{{json stripe}}` | Complete Stripe event data as JSON |
| `{{json stripe.fullData}}` | Full Stripe session object |

## 🎯 Common Use Cases & Examples

### Example 1: Order Confirmation Email
```json
{
  "name": "{{stripe.customerName}}",
  "orderId": "{{stripe.id}}",
  "total": "${{stripe.amount}}",
  "items": [
    {
      "name": "Product from metadata",
      "quantity": "{{stripe.metadata.quantities}}",
      "price": "${{stripe.amount}}"
    }
  ],
  "customerEmail": "{{stripe.customerEmail}}"
}