# Backend Development Cheatsheet — NestJS, HTTP, and Secure Authentication

This document summarizes key backend engineering concepts and best practices
using **NestJS**, **Prisma**, and **secure authentication flows**. It is
designed as an interview-ready reference and implementation guide.

---

## 1. NestJS Core Concepts

### 1.1 Controller Parameters and Decorators

Example usage in controllers:

```ts
@Post('signup')
signup(
  @Body('email') email: string,
  @Body('password') password: string,
  @Body('name') name: string,
) {
  // Handle signup logic
}
```

### 1.2 Dependency Injection with Prisma

NestJS uses dependency injection for services. The Prisma service can be
injected into other services as follows:

```ts
constructor(private readonly prisma: PrismaService) {}
```

### 1.3 Global Services

To make Prisma available globally, use the `@Global()` decorator in your Prisma
module:

```ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 1.4 Pipes (Validation and Transformation)

Pipes are used for validation and data transformation. Examples:

```ts
@Param('id', ParseIntPipe) id: number
```

Custom validation can be implemented using **class-validator** decorators in
DTOs:

```ts
export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}
```

### 1.5 Layered Architecture

Key architectural principles:

- **Controller** handles requests and responses.
- **Service layer** contains business logic only (no direct `req` or `res`
  handling).
- **Repositories (via Prisma)** handle data persistence.
- Follow **CLEAN Architecture** and **SOLID principles**.

Example guideline:

```ts
// Controller
@Post('signup')
async signup(@Body() dto: SignupDto, @Res() res: Response) {
  return this.authService.signup(dto, res);
}

// Service
async signup(dto: SignupDto) {
  this.logger.info(`Signup attempt for ${dto.email}`, AuthService.name, 'signup');
  // Logic only, no res or req here
}
```

---

## 2. Swagger / OpenAPI Documentation

NestJS integrates with Swagger for API documentation.

### 2.1 DTO Decorators

Use `@ApiProperty()` in DTOs to describe fields:

```ts
export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}
```

### 2.2 Controller Decorators

Common decorators:

```ts
@ApiOperation({ summary: 'User Signup' })
@ApiBody({ type: SignupDto })
@ApiOkResponse({ description: 'Signup successful' })
```

---

## 3. Logging Strategy

- Use a centralized **LoggerService** for consistent logs across layers.
- Log events at both **controller** and **service** levels.
- Example single-line lambda template:

```ts
this.logger.info(`Signup attempt for ${dto.email}`, AuthService.name, 'signup');
```

---

## 4. HTTP — Fundamentals for Backend Developers

### 4.1 Overview

**HTTP (HyperText Transfer Protocol)** is the standard communication protocol
between clients (like browsers) and servers (like APIs). It follows a
**request–response model**.

### 4.2 Request–Response Cycle

1. Client sends an HTTP request.
2. Server processes it.
3. Server returns an HTTP response.

Each request includes:

- **Method:** GET, POST, PUT, DELETE, etc.
- **Headers:** Metadata (Content-Type, Authorization, etc.)
- **Body:** Data (for POST/PUT)

### 4.3 HTTP and HTTPS

- **HTTP:** Plain text transmission.
- **HTTPS:** Encrypted with TLS for security.

### 4.4 Caching

Caching can be controlled through response headers:

```http
Cache-Control: max-age=3600
```

### 4.5 Cookies and Clients

| Concept               | Browser               | Curl                        |
| --------------------- | --------------------- | --------------------------- |
| **Cookie storage**    | Automatic             | Manual (`-c` & `-b` flags)  |
| **Set-Cookie header** | Sent by server        | Same, but not auto-stored   |
| **API sends cookie?** | Yes, via `Set-Cookie` | Manual persistence required |
| **Cookies used for**  | Session auth, prefs   | Same, for testing APIs      |

---

## 5. Secure Authentication Flow (Industry-Standard)

Modern web applications use **Access Tokens** and **Refresh Tokens** for secure
and scalable authentication.

### 5.1 Token Types

| Token         | Lifetime     | Storage         | Purpose                    |
| ------------- | ------------ | --------------- | -------------------------- |
| Access Token  | 5–15 minutes | In-memory       | Authenticates API requests |
| Refresh Token | 7–30 days    | HttpOnly Cookie | Issues new access tokens   |

### 5.2 Authentication Flow

1. **Login:**
   - Validate credentials.
   - Issue Access Token (short-lived JWT) and Refresh Token (long-lived,
     HttpOnly cookie).
2. **Access API:**
   - Include Access Token in `Authorization: Bearer <token>` header.
3. **Token Refresh:**
   - When access token expires, browser auto-sends refresh cookie to
     `/auth/refresh`.
   - Server verifies and rotates refresh token, issuing a new access token.
4. **Logout:**
   - Clear refresh token cookie.
   - Invalidate refresh token in database.

### 5.3 Security Best Practices

- Store refresh tokens in **HttpOnly, Secure cookies** (not in localStorage).
- Keep access tokens short-lived and store only in memory.
- Rotate refresh tokens on every use.
- Revoke tokens on logout or anomaly detection.
- Use **SameSite=Strict**, **Secure**, and **HttpOnly** cookie flags.
- Use **HTTPS** for all API communication.
- Avoid placing sensitive PII inside JWT payloads.

### 5.4 Example Cookie Configuration (Express/NestJS)

```ts
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

---

## 6. Additional Guidelines

- Always use environment variables for secrets and database credentials.
- Implement global exception filters and validation pipes.
- Centralize authentication and authorization guards.
- Validate JWTs using RS256 or ES256 with key rotation.
- Keep controllers thin, services clean, and data models consistent.

---

## Psima Command to run in this project structure:

  npm run prisma:generate 
  npx prisma generate --schema src/prisma/schema.prisma
  npx prisma db push --schema src/prisma/schema.prisma



eslint and pretier reasearch
function separation
husky and commitzne
commitzen
precommits
