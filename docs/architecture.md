# Root & Bloom — Digital Business System Architecture

## 1. Business problem and target users

Root & Bloom is a gardening services and retail system designed for urban customers who need reliable gardening support and quality plant products. The business problem is that many homeowners and societies do not have a single digital platform to book maintenance, manage landscaping work, and purchase gardening essentials in one place.

The system supports:
- Customers who want to book outdoor, landscaping, or plant-care services
- Managers who need to monitor bookings, service quality, inventory and profit indicators
- Retail customers who want to purchase accessories, plants and garden products quickly

### User roles
- Customer: can view services, book a service, place orders and manage personal bookings
- Manager/Admin: can review bookings, update service status, manage product inventory and track KPIs

## 2. Technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript | User interfaces for customer and manager views |
| Build tool | Vite | Fast frontend build and preview |
| Styling | CSS custom design | Responsive layout for dashboards and commerce panels |
| State handling | Local component state | Simulated persistent data for business workflow |
| Data layer | LocalStorage | Persistent browser-side storage for customers, bookings, orders and inventory |
| Business logic | JavaScript/TypeScript functions | Booking assignment, stock reorder logic, KPI aggregation |
| Deployment approach | Static web app | Easy local hosting and future cloud deployment |

## 3. Current system architecture diagram

```text
+------------------------------------------------------+
| Client Interface                                      |
| - Customer dashboard                                  |
| - Manager dashboard                                   |
| - Booking form                                        |
| - Product cart                                        |
+--------------------------+---------------------------+
                           |
                           | HTTPS / local browser interactions
                           v
+------------------------------------------------------+
| Frontend Application (React)                         |
| - Service selection                                   |
| - Product catalog                                     |
| - Booking and order workflow                          |
| - Inventory and KPI summary                          |
+--------------------------+---------------------------+
                           |
                           | Business logic and state updates
                           v
+------------------------------------------------------+
| Application Logic (TypeScript)                        |
| - match gardener algorithm                            |
| - reorder recommendation                             |
| - booking status updates                             |
| - cart checkout                                       |
+--------------------------+---------------------------+
                           |
                           | Data persistence
                           v
+------------------------------------------------------+
| Data Layer                                            |
| - Users                                               |
| - Services                                            |
| - Gardeners                                           |
| - Bookings                                            |
| - Products                                            |
| - Orders                                              |
| - Inventory                                           |
+------------------------------------------------------+
```

## 4. Frontend, backend, authentication, database, storage and external services

### Frontend
The frontend is implemented as a browser app that provides:
- Customer dashboard with booking and shopping features
- Manager dashboard with KPI cards and booking management
- Inventory editing and new product form

### Backend / application logic
The app contains business logic directly in the frontend application layer to simulate a small digital business system. The logic handles:
- service booking validation
- gardener matching
- stock calculation
- reorder recommendation
- order settlement simulation
- KPI and summary reporting

### Authentication / identification
The app simulates role-based access through a switch between Customer View and Manager View. The selected user is chosen from a list of identities, representing the user role and zone.

### Data storage
The system stores data in browser LocalStorage. This allows persistent data across refreshes, which is appropriate for a prototype digital business system.

### External services
These are not fully connected in the current prototype, but they are conceptually required for a large real-world system:
- Payment gateway: Razorpay or Stripe
- Email alerts: SendGrid or NodeMailer
- Cloud file storage: AWS S3
- Monitoring: CloudWatch / Sentry

## 5. Data flow between major components

### Service booking flow
1. Customer selects a service, date, zone and notes.
2. The app reads services, gardeners and active bookings.
3. The gardener matching algorithm ranks candidates.
4. Best gardener is assigned to the booking.
5. Booking is saved to the in-app data model.
6. Manager can update booking status from Pending to Confirmed or Completed.

### Ordering flow
1. Customer adds products to the cart.
2. Checkout calculates the total amount.
3. Order is created and stock is reduced.
4. Manager dashboard shows the updated inventory and reorder warnings.

### KPI flow
1. Booking and product data are aggregated.
2. Revenue, pending bookings and average rating are computed.
3. Dashboard displays the current status.

## 6. Current hosting and deployment approach

The current prototype is hosted locally in the browser and is designed to run with a Vite React application. This is a suitable prototype for academic demonstration and can be extended to a cloud-hosted deployment later.

### Local deployment
- Open the project folder in a JavaScript runtime environment
- Run the app with the Vite development server
- Access the interface through the local browser

## 7. Proposed cloud deployment architecture (AWS)

```text
Users
  |
  v
CloudFront CDN
  |
  v
S3 + static frontend hosting
  |
  v
Application Load Balancer
  |
  +--> EC2 / Containerized API instances
             |
             +--> PostgreSQL database
             +--> Redis cache
             +--> S3 media storage
             +--> CloudWatch monitoring
             +--> WAF / security layer
```

### Recommended AWS services
- CloudFront: deliver the frontend globally with low latency
- S3: store product images, pricing content and documents
- EC2 or ECS: host the application logic and APIs
- RDS PostgreSQL: store the relational business data
- ElastiCache Redis: cache dashboard data and frequent queries
- CloudWatch: monitor utilization, latency and errors
- WAF: filter malicious requests and protect the application
- Secrets Manager: secure API and database credentials

## 8. Scalability to 1 million and 5 million users

### For 1,000,000 users
- Use CloudFront to cache static content and reduce origin traffic
- Use multiple application instances behind a load balancer
- Use read replicas and caching for booking history and product listings
- Use autoscaling based on CPU and request volume
- Use Redis to reduce repeated database calls for dashboard summaries

### For 5,000,000 users
- Deploy across multiple regions for low-latency access
- Move to a more scalable relational database setup with failover and replication
- Split workloads into independent services for bookings, products, payments and inventory
- Use async background queues for low-priority tasks such as confirmations and notifications
- Add stronger security and observability with monitoring, rate limiting and cloud-native failover

## 9. Quantitative scalability analysis

### 9.1 User growth projection
Assume 10,000 users with 25% annual growth.

Formula: Users = Initial × (1 + 0.25)^n

| Year | Formula | Values | Result |
|---|---|---|---|
| 1 | 10,000 × 1.25^1 | 10,000 × 1.25 | 12,500 |
| 2 | 10,000 × 1.25^2 | 10,000 × 1.5625 | 15,625 |
| 3 | 10,000 × 1.25^3 | 10,000 × 1.9531 | 19,531 |
| 4 | 10,000 × 1.25^4 | 10,000 × 2.4414 | 24,414 |
| 5 | 10,000 × 1.25^5 | 10,000 × 3.0518 | 30,518 |

Interpretation: Growth is steady, but the system must plan for stronger database and API scaling as the customer base rises.

### 9.2 Peak concurrent users
Assume 10% of registered users are active simultaneously.

Formula: Peak concurrent users = Registered users × 0.10

| Registered users | Formula | Result |
|---|---|---|
| 100,000 | 100,000 × 0.10 | 10,000 |
| 500,000 | 500,000 × 0.10 | 50,000 |
| 1,000,000 | 1,000,000 × 0.10 | 100,000 |
| 5,000,000 | 5,000,000 × 0.10 | 500,000 |

Interpretation: At 1 million users, the peak load is already substantial. At 5 million users, a multi-region and autoscaling architecture becomes mandatory.

### 9.3 Requests per minute and second
Assume each active user produces 5 requests per minute during peak time.

Formula: RPM = Active users × 5
Formula: RPS = RPM ÷ 60

| Active users | RPM formula | RPM | RPS formula | RPS |
|---|---|---:|---|---:|
| 10,000 | 10,000 × 5 | 50,000 | 50,000 ÷ 60 | 833 |
| 50,000 | 50,000 × 5 | 250,000 | 250,000 ÷ 60 | 4,167 |
| 100,000 | 100,000 × 5 | 500,000 | 500,000 ÷ 60 | 8,333 |
| 500,000 | 500,000 × 5 | 2,500,000 | 2,500,000 ÷ 60 | 41,667 |

Interpretation: The request load rises sharply. Without autoscaling and caching, the application layer would become the bottleneck during peak usage.

## 10. Security mechanisms

| Security mechanism | Component | Purpose | Threat addressed |
|---|---|---|---|
| Role-based user switching | Frontend | Simulates role separation between customer and manager | Unauthorised feature access |
| Local user identity model | Application layer | Distinguishes customer and manager accounts | Identity confusion |
| Input validation | Booking and form logic | Prevents invalid fields and unsafe values | Bad data entry |
| Stock validation | Inventory logic | Prevents order creation beyond available stock | Overselling |
| Browser local persistence | Data layer | Stores data in a controlled local storage container | Data loss during poor session handling |
| Rate limiting (recommended) | API / gateway | Limiting repeated requests to protect services | Brute-force or abuse |
| HTTPS (recommended) | Network layer | Secure client-server communication | Man-in-the-middle attacks |
| Secrets management (recommended) | Cloud deployment | Store tokens and passwords securely | Credential leakage |
| Audit logging (recommended) | Monitoring layer | Capture important actions and changes | Insider misuse |
| Backup strategy (recommended) | Database and storage | Reduces impact of failure | Data loss |

## 11. Failure and recovery analysis

| Failure type | Failure scenario | Impact | Detection | Recovery |
|---|---|---|---|---|
| Application/server | Frontend crashes during booking or checkout | Users cannot proceed | Browser error or UI warning | Refresh and restore from saved data |
| Database | Data corruption or loss in persistent storage | Bookings/transactions disappear | Missing records or failed reads | Restore from backup or local storage snapshot |
| Network | Connection loss during order placement | Data may be partially submitted | Failed request or no response | Retry the transaction after reconnect |
| Storage | Product image or product file missing | Product catalog appears incomplete | Broken asset references | Restore or replace the asset from backup |
| Security | Unauthorised access to manager functions | System integrity risk | Suspicious user changes or role misuse | Restrict access and reset credentials |

## 12. Business algorithm implemented

### Gardener matching and priority scoring
Problem: When a customer books a service, a fair and efficient assignment should be made instead of random allocation.

Input:
- service chosen
- customer zone
- available gardeners
- current booking records

Processing logic:
1. Filter gardeners by relevant specialization.
2. Check availability using current bookings.
3. Compute priority score using rating and zone match.
4. Choose the highest score.
5. Assign the best gardener to the booking.

Formula:
Priority score = 0.5 × rating + 0.3 × zoneMatch + 0.2 × workloadFactor

Where:
- zoneMatch = 1 if gardener zone matches customer zone, otherwise 0
- workloadFactor = 1 - min(currentBookings ÷ 6, 1)

Output:
- Assigned gardener ID and booking confirmation

Code location:
- [src/App.tsx](src/App.tsx)

### Inventory reorder logic
Problem: Products must be replenished before stock runs out.

Input:
- current stock
- reorder point

Processing logic:
- If stock is less than or equal to reorder point, recommend reorder quantity
- Otherwise, no reorder is required

Formula:
Reorder quantity = max(12, reorderPoint × 2 - stock)

Output:
- Inventory warning message for manager

Code location:
- [src/App.tsx](src/App.tsx)

## 13. Summary

The current project successfully demonstrates a working digital business system with two user roles, booking and order workflows, a manager dashboard, persistent business data, and business logic that solves real operational problems. It is structured to evolve into a cloud-hosted, scalable digital platform for larger user groups.
