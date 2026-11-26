-- Create separate databases for each microservice
-- This runs once when the PostgreSQL container is first initialized.
-- In production, each service would have its own PostgreSQL instance.

CREATE DATABASE account_db;
CREATE DATABASE technician_verification_db;
CREATE DATABASE service_catalog_db;
CREATE DATABASE booking_db;
CREATE DATABASE pricing_quote_db;
CREATE DATABASE job_management_db;
CREATE DATABASE payment_db;
CREATE DATABASE review_complaint_db;
CREATE DATABASE notification_db;
