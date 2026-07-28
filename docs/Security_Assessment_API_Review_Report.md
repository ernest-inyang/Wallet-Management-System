# Security Assessment & API Review Report

## Project

Wallet Management System

Backend Engineering Assessment

Author: Ernest Inyang

---

# Overview

This document summarises the security measures implemented within the Wallet Management System, the reasoning behind those decisions, potential risks considered during development, and recommendations for improving the application's security in a production environment.

The application was developed with security, consistency and transactional integrity as primary objectives.

---

# 1. API Endpoint Security

All sensitive endpoints are protected using JWT-based authentication.

Protected endpoints include:

- Fund Wallet
- Withdraw Funds
- Transfer Funds
- Transaction History
- User Profile

Authentication is enforced through a middleware that:

- Validates the JWT signature
- Rejects expired or malformed tokens
- Extracts the authenticated user information
- Prevents unauthenticated access to protected resources

Public endpoints are limited to:

- User Registration
- User Login

This minimises unnecessary exposure of internal functionality.

---

# 2. Authentication & Authorisation

A simplified JWT authentication mechanism was implemented for this assessment.

During login:

- User credentials are verified
- Password hashes are compared using bcrypt
- A signed JWT is generated
- The token contains only the minimum required user information

For every authenticated request:

- JWT is verified
- User identity is extracted
- Business logic relies on the authenticated user's ID instead of trusting client-supplied identifiers

This prevents users from performing actions on behalf of other users.

---

# 3. Password Security

Passwords are never stored in plain text.

Security measures include:

- bcrypt hashing
- One-way password encryption
- Password comparison using bcrypt.compare()

If the database were compromised, attackers would not have access to users' actual passwords.

---

# 4. Input Validation

Every incoming request is validated before reaching business logic.

Validation is implemented using Zod schemas.

Validation includes:

- Required fields
- Data types
- Email format
- Phone number validation
- Positive transaction amounts
- Invalid request rejection

This reduces the risk of malformed requests entering the application.

---

# 5. Database Security

The application uses Knex parameterised queries.

No raw SQL statements are constructed from user input.

This significantly reduces the risk of SQL Injection attacks.

---

# 6. Transaction Integrity

Wallet operations are executed inside database transactions.

Examples include:

- Wallet funding
- Withdrawals
- Transfers
- User registration with automatic wallet creation

If any operation fails, the transaction is rolled back automatically.

This prevents partial updates and inconsistent balances.

---

# 7. Concurrency Protection

Money movement uses row-level locking (`SELECT ... FOR UPDATE`) when accessing wallet records.

This prevents race conditions during concurrent balance updates.

For example:

If two transfer requests attempt to debit the same wallet simultaneously, only one transaction acquires the lock first. The second transaction waits until the first completes, ensuring balances remain accurate.

---

# 8. External API Validation

During registration, every user is verified against the Lendsqr Adjutor Karma blacklist.

Users appearing on the blacklist are rejected before onboarding.

This satisfies the assessment requirement while demonstrating secure integration with external services.

---

# 9. Error Handling

Application errors are centralised using custom error classes.

Examples include:

- BadRequestError
- UnauthorizedError
- ConflictError
- NotFoundError

Clients receive consistent error responses without exposing stack traces or internal implementation details.

---

# 10. Logging

Structured request logging is implemented using Pino.

Logged information includes:

- HTTP method
- Request path
- Status code
- Response time
- Error details

Sensitive information such as passwords and JWT secrets are never logged.

---

# Failure Handling & Debugging Assessment

## Handling Failures

Failures are handled through:

- Input validation
- Centralised error middleware
- Database transactions
- Repository abstraction
- Consistent HTTP error responses

Whenever an unexpected exception occurs, the request fails gracefully while preserving database consistency.

---

## Debugging Strategy

Issues are diagnosed using:

- Structured application logs
- Repository-level isolation
- Transaction rollback verification
- Unit tests
- Integration tests

This layered architecture makes it easier to isolate failures to specific components.

---

## Monitoring & Reliability

The current implementation includes:

- Structured logging (Pino)
- Database transactions
- Input validation
- Exception handling

In production, this could be extended using:

- Sentry
- Prometheus
- Grafana
- Health check endpoints
- Distributed tracing
- Alerting systems

---

## Example Failure Scenario

### Scenario

A transfer request attempts to debit a wallet with insufficient funds.

### Behaviour

1. Wallet is locked.
2. Balance is verified.
3. Insufficient balance is detected.
4. A `BadRequestError` is thrown.
5. Database transaction is rolled back.
6. No ledger entries are created.
7. No balances are modified.
8. Client receives an appropriate error response.

This guarantees that no partial transfer can occur.

---

# Future Security Improvements

For a production deployment, the following enhancements are recommended:

- Refresh token authentication
- Role-Based Access Control (RBAC)
- Rate limiting
- API key rotation
- Request throttling
- HTTPS enforcement
- Helmet CSP configuration
- Secret management using AWS Secrets Manager or HashiCorp Vault
- Audit logging
- Multi-factor authentication
- Account lockout after repeated failed logins
- Redis-backed token revocation
- OpenAPI security documentation
- Automated dependency vulnerability scanning
- CI/CD security checks
- Database encryption at rest
- End-to-end monitoring and alerting

---

# Conclusion

The application follows secure backend engineering practices appropriate for an MVP wallet service. Security considerations such as authentication, password hashing, input validation, transactional integrity, concurrency control, structured logging and external blacklist verification were incorporated into the implementation. While simplified for the scope of the assessment, the architecture provides a strong foundation that can be extended into a production-ready financial application.