/*
 Navicat Premium Dump SQL

 Source Server         : localhost postgreSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 150003 (150003)
 Source Host           : localhost:5432
 Source Catalog        : work_order_db
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150003 (150003)
 File Encoding         : 65001

 Date: 02/03/2025 15:19:18
*/


-- ----------------------------
-- Type structure for Role
-- ----------------------------
DROP TYPE IF EXISTS "public"."Role";
CREATE TYPE "public"."Role" AS ENUM (
  'PRODUCTION_MANAGER',
  'OPERATOR'
);
ALTER TYPE "public"."Role" OWNER TO "postgres";

-- ----------------------------
-- Type structure for WorkOrderStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."WorkOrderStatus";
CREATE TYPE "public"."WorkOrderStatus" AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELED'
);
ALTER TYPE "public"."WorkOrderStatus" OWNER TO "postgres";

-- ----------------------------
-- Table structure for StatusHistory
-- ----------------------------
DROP TABLE IF EXISTS "public"."StatusHistory";
CREATE TABLE "public"."StatusHistory" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "workOrderId" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."WorkOrderStatus" NOT NULL,
  "quantity" int4 NOT NULL,
  "notes" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" timestamp(3),
  "stage" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."StatusHistory" OWNER TO "postgres";

-- ----------------------------
-- Records of StatusHistory
-- ----------------------------
BEGIN;
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adf0003rw2lmk3u3yx9', 'cm7qt6adc0002rw2lu2rsaq7f', 'PENDING', 100, 'Notes 1', '2025-03-01 23:03:29.283', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adi0005rw2l0zkqlxwp', 'cm7qt6adh0004rw2lf49il0wd', 'PENDING', 100, 'Notes 2', '2025-03-01 23:03:29.286', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adl0007rw2l7z19k2iy', 'cm7qt6adj0006rw2l662nf5i1', 'PENDING', 100, 'Notes 3', '2025-03-01 23:03:29.288', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adn0009rw2ln0bibubj', 'cm7qt6adm0008rw2lvw1ihff9', 'PENDING', 100, 'Notes 4', '2025-03-01 23:03:29.291', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adp000brw2l6wg5ivj2', 'cm7qt6ado000arw2l92cl2n0w', 'PENDING', 100, 'Notes 5', '2025-03-01 23:03:29.293', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adr000drw2l7mjmwitv', 'cm7qt6adq000crw2l368tu4rl', 'PENDING', 100, 'Notes 6', '2025-03-01 23:03:29.295', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adt000frw2l0y1vgqfx', 'cm7qt6ads000erw2lvnbda7py', 'PENDING', 100, 'Notes 7', '2025-03-01 23:03:29.297', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adv000hrw2ldxokkka8', 'cm7qt6adu000grw2lsmnhimpd', 'PENDING', 100, 'Notes 8', '2025-03-01 23:03:29.299', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adx000jrw2l1i88xv15', 'cm7qt6adw000irw2lh0l1nqlk', 'PENDING', 100, 'Notes 9', '2025-03-01 23:03:29.301', NULL, NULL);
INSERT INTO "public"."StatusHistory" ("id", "workOrderId", "status", "quantity", "notes", "createdAt", "completedAt", "stage") VALUES ('cm7qt6adz000lrw2lz0e2700e', 'cm7qt6ady000krw2lz5e2dzgy', 'PENDING', 100, 'Notes 10', '2025-03-01 23:03:29.302', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "public"."User";
CREATE TABLE "public"."User" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" "public"."Role" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;
ALTER TABLE "public"."User" OWNER TO "postgres";

-- ----------------------------
-- Records of User
-- ----------------------------
BEGIN;
INSERT INTO "public"."User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt") VALUES ('cm7qt6ab00000rw2l7svbp201', 'manager@example.com', 'Production Manager', '$2b$10$dYgXeSNf7O3ZOfOyR1ROKeiZtyjmadK4XeaZ.ZJ8Vx.gTQ8i2IhYC', 'PRODUCTION_MANAGER', '2025-03-01 23:03:29.195', '2025-03-01 23:03:29.195');
INSERT INTO "public"."User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt") VALUES ('cm7qt6ad60001rw2lp7ygwmdk', 'operator@example.com', 'Operator 1', '$2b$10$BR.6w2Mj5YGSw4d6ptrzceDYb16zDZurqzk3ai.A4NIkWSFmK9i2q', 'OPERATOR', '2025-03-01 23:03:29.274', '2025-03-01 23:03:29.274');
COMMIT;

-- ----------------------------
-- Table structure for WorkOrder
-- ----------------------------
DROP TABLE IF EXISTS "public"."WorkOrder";
CREATE TABLE "public"."WorkOrder" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "orderNumber" text COLLATE "pg_catalog"."default" NOT NULL,
  "productName" text COLLATE "pg_catalog"."default" NOT NULL,
  "quantity" int4 NOT NULL,
  "deadline" timestamp(3) NOT NULL,
  "status" "public"."WorkOrderStatus" NOT NULL DEFAULT 'PENDING'::"WorkOrderStatus",
  "operatorId" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;
ALTER TABLE "public"."WorkOrder" OWNER TO "postgres";

-- ----------------------------
-- Records of WorkOrder
-- ----------------------------
BEGIN;
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adc0002rw2lu2rsaq7f', 'WO-1', 'Product 1', 100, '2025-03-08 23:03:29.276', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.277', '2025-03-01 23:03:29.277');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adh0004rw2lf49il0wd', 'WO-2', 'Product 2', 100, '2025-03-08 23:03:29.285', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.285', '2025-03-01 23:03:29.285');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adj0006rw2l662nf5i1', 'WO-3', 'Product 3', 100, '2025-03-08 23:03:29.287', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.287', '2025-03-01 23:03:29.287');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adm0008rw2lvw1ihff9', 'WO-4', 'Product 4', 100, '2025-03-08 23:03:29.289', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.289', '2025-03-01 23:03:29.289');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6ado000arw2l92cl2n0w', 'WO-5', 'Product 5', 100, '2025-03-08 23:03:29.292', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.292', '2025-03-01 23:03:29.292');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adq000crw2l368tu4rl', 'WO-6', 'Product 6', 100, '2025-03-08 23:03:29.294', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.294', '2025-03-01 23:03:29.294');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6ads000erw2lvnbda7py', 'WO-7', 'Product 7', 100, '2025-03-08 23:03:29.296', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.296', '2025-03-01 23:03:29.296');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adu000grw2lsmnhimpd', 'WO-8', 'Product 8', 100, '2025-03-08 23:03:29.298', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.298', '2025-03-01 23:03:29.298');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6adw000irw2lh0l1nqlk', 'WO-9', 'Product 9', 100, '2025-03-08 23:03:29.3', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.3', '2025-03-01 23:03:29.3');
INSERT INTO "public"."WorkOrder" ("id", "orderNumber", "productName", "quantity", "deadline", "status", "operatorId", "createdAt", "updatedAt") VALUES ('cm7qt6ady000krw2lz5e2dzgy', 'WO-10', 'Product 10', 100, '2025-03-08 23:03:29.302', 'PENDING', 'cm7qt6ad60001rw2lp7ygwmdk', '2025-03-01 23:03:29.302', '2025-03-01 23:03:29.302');
COMMIT;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS "public"."_prisma_migrations";
CREATE TABLE "public"."_prisma_migrations" (
  "id" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
  "checksum" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "finished_at" timestamptz(6),
  "migration_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "logs" text COLLATE "pg_catalog"."default",
  "rolled_back_at" timestamptz(6),
  "started_at" timestamptz(6) NOT NULL DEFAULT now(),
  "applied_steps_count" int4 NOT NULL DEFAULT 0
)
;
ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
BEGIN;
INSERT INTO "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES ('26cff06c-e0f9-4c17-8544-9e682822ca2a', 'df64a201b80b31eb08acaef769ff16f0b815d7e4ac1cf6e86255b7a56b7f30ad', '2025-03-02 01:51:41.170153+07', '20250301185141_init', NULL, NULL, '2025-03-02 01:51:41.162144+07', 1);
INSERT INTO "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES ('5ce8a034-bb22-4cbd-a322-847b7872c1f2', '2a5263606e877aad9f025c7d8a7c9b08b91a4c30929d2dae54fb0f350e40fa4c', '2025-03-02 04:52:37.567807+07', '20250301215237_update_stage', NULL, NULL, '2025-03-02 04:52:37.564932+07', 1);
COMMIT;

-- ----------------------------
-- Primary Key structure for table StatusHistory
-- ----------------------------
ALTER TABLE "public"."StatusHistory" ADD CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table User
-- ----------------------------
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table WorkOrder
-- ----------------------------
CREATE UNIQUE INDEX "WorkOrder_orderNumber_key" ON "public"."WorkOrder" USING btree (
  "orderNumber" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table WorkOrder
-- ----------------------------
ALTER TABLE "public"."WorkOrder" ADD CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table _prisma_migrations
-- ----------------------------
ALTER TABLE "public"."_prisma_migrations" ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table StatusHistory
-- ----------------------------
ALTER TABLE "public"."StatusHistory" ADD CONSTRAINT "StatusHistory_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "public"."WorkOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table WorkOrder
-- ----------------------------
ALTER TABLE "public"."WorkOrder" ADD CONSTRAINT "WorkOrder_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
