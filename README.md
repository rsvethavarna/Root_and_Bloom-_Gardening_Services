# Root & Bloom Gardening Services

Root & Bloom is a digital business information system for a gardening services
and retail business. It connects customers with gardening services and gives
managers an operational view of bookings, revenue and inventory.

This repository contains the working CIA III prototype for **Digital Business
Systems | ECD223-3**.

## What the system demonstrates

The application follows the complete business flow:

```text
Customer input -> React application logic -> persistent LocalStorage data
					-> booking/order result -> customer or manager output
```

### Customer operations

- Select a customer identity and zone
- Book a gardening service for a future date
- Add booking notes and receive validation feedback
- View booking history, assigned gardener and booking status
- Cancel non-completed bookings
- Search the product catalogue by name or category
- Add products to a persistent cart
- Complete checkout with stock-aware validation
- View order history and transaction totals

### Manager operations

- Switch to the manager view
- Monitor revenue, pending bookings and average gardener rating
- Update booking statuses
- Delete business records when required
- Update product stock levels
- Identify low-stock products and recommended reorder quantities
- Add new products to the catalogue

## Business logic

The prototype includes two business-processing mechanisms rather than only
static screens:

1. **Gardener matching:** available gardeners are filtered by service
	specialization and workload, then ranked using rating, zone match and
	current workload.
2. **Inventory reorder recommendation:** products at or below their reorder
	point receive a recommended replenishment quantity.

The implementation and examples are documented in
[`docs/architecture.md`](docs/architecture.md). The relevant application logic
is in [`src/App.tsx`](src/App.tsx).

## Data model

The browser-backed prototype persists a structured business dataset containing
these entities:

| Entity | Purpose |
| --- | --- |
| Users | Customer and manager identities, roles and zones |
| Services | Gardening service catalogue and pricing |
| Gardeners | Staff specialization, rating and availability |
| Bookings | Customer requests, assignments, dates and statuses |
| Products | Retail catalogue, prices and stock |
| Orders | Customer transactions and order statuses |
| Order items | Products and quantities belonging to an order |
| Inventory | Stock, reorder points and update dates |

Data is persisted in the browser using the `root-bloom-cia3-data` key. The
shopping cart uses `root-bloom-cart`.

## Technology

- React 18
- TypeScript
- Vite
- CSS
- Browser LocalStorage for prototype persistence

The proposed production architecture, cloud deployment and million-user
scalability plan are documented in
[`docs/architecture.md`](docs/architecture.md).

## Run locally

Prerequisite: Node.js 18 or newer and npm.

From the repository root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

For a production build:

```bash
npm run build
npm run preview
```

## Demonstration checklist

1. Open Customer View and select a customer.
2. Submit an empty booking to demonstrate validation.
3. Submit a valid future booking with a zone and notes.
4. Confirm the assigned gardener and booking status appear.
5. Search for a product and add it to the cart.
6. Refresh the page and confirm the cart remains available.
7. Checkout and verify the order in Order History.
8. Open Manager View and update a booking status.
9. Change stock below its reorder point and verify the recommendation.
10. Add a new product and confirm it appears in the catalogue.

## Repository documentation

- [`docs/architecture.md`](docs/architecture.md): system architecture,
  database design, data flow, algorithms, security, recovery and scalability.
- [`docs/project-implementation.md`](docs/project-implementation.md): the
  mandatory task tracker, work log and contribution evidence.

The implementation tracker is the source of truth for task status. Tasks should
only be marked `Completed` after the responsible student has tested them and
recorded evidence.

## Contribution workflow

Use a personal branch and a GitHub account-linked email for each contribution:

```bash
git checkout -b feature/your-feature-name
git config user.name "Your Name"
git config user.email "your-verified-github-email"
git add .
git commit -m "feat: describe the verified change"
git push -u origin feature/your-feature-name
```

Open a pull request into `main`. Do not use empty commits to inflate activity;
each commit should represent reviewed work and should be recorded in the
implementation tracker.

## Student A contribution

Soumili Rakshit owns the customer experience improvements on the current
feature branch, including booking validation and feedback, persistent cart
behaviour, stock-aware customer shopping, product search, booking cancellation,
and related responsive interface states.

## Project limitations and next steps

This is an academic prototype. LocalStorage provides persistence for browser
demonstration, but it is not a multi-user production database. A production
release should replace it with an authenticated API, PostgreSQL, server-side
inventory transactions, payment-provider webhooks, encrypted secrets,
automated tests and cloud monitoring.
