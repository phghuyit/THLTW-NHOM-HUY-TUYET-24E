CREATE DATABASE IF NOT EXISTS `thltweb_huy_tuyet` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `thltweb_huy_tuyet`;

CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `role` ENUM('admin', 'member') NOT NULL DEFAULT 'member',
    `fullname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `status` ENUM('active', 'locked') DEFAULT 'active',
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(100) PRIMARY KEY,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL
);

CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `parent_id` INT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
);

CREATE TABLE `brands` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `logo` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `brand_id` INT NULL,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL UNIQUE,
    `thumbnail` VARCHAR(255) NOT NULL,
    `short_description` VARCHAR(500) NULL,
    `description` LONGTEXT NULL,
    `rent_price_per_day` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `original_value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `is_featured` TINYINT(1) DEFAULT 0,
    `view_count` INT DEFAULT 0,
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
);

CREATE TABLE `product_images` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `sort_order` INT DEFAULT 0,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);

CREATE TABLE `product_sizes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `size` ENUM('XS', 'S', 'M', 'L', 'XL', '2XL', 'FreeSize') NOT NULL DEFAULT 'FreeSize',
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_product_size` (`product_id`, `size`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);

CREATE TABLE `coupons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    `discount_amount` DECIMAL(12, 2) NOT NULL,
    `min_order_value` DECIMAL(12, 2) DEFAULT 0.00,
    `usage_limit` INT DEFAULT 100,
    `used_count` INT DEFAULT 0,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME NOT NULL,
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `orders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_code` VARCHAR(30) NOT NULL UNIQUE,
    `user_id` BIGINT NOT NULL,
    `coupon_id` INT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `customer_email` VARCHAR(100) NULL,
    `delivery_type` ENUM('store_pickup', 'delivery') DEFAULT 'delivery',
    `shipping_address` VARCHAR(255) NULL,
    `customer_note` TEXT NULL,
    `total_rent_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_deposit_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `shipping_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `grand_total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `refunded_deposit` DECIMAL(12, 2) DEFAULT 0.00,
    `payment_method` ENUM('cash', 'vnpay') DEFAULT 'cash',
    `payment_status` ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    `order_status` ENUM('pending', 'confirmed', 'delivering', 'renting', 'returning', 'completed', 'cancelled') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL
);

CREATE TABLE `order_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT NOT NULL,
    `product_size_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `rent_start_date` DATE NOT NULL,
    `rent_end_date` DATE NOT NULL,
    `rent_days` INT NOT NULL,
    `price_per_day` DECIMAL(12, 2) NOT NULL,
    `deposit_per_item` DECIMAL(12, 2) NOT NULL,
    `total_item_rent` DECIMAL(12, 2) NOT NULL,
    `total_item_deposit` DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_size_id`) REFERENCES `product_sizes` (`id`) ON DELETE RESTRICT
);

CREATE TABLE `rent_returns` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT NOT NULL,
    `staff_id` BIGINT NULL,
    `actual_return_date` DATE NOT NULL,
    `penalty_fee` DECIMAL(12, 2) DEFAULT 0.00,
    `penalty_reason` VARCHAR(255) NULL,
    `deposit_refund_amount` DECIMAL(12, 2) NOT NULL,
    `return_note` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
);

CREATE TABLE `payments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT NOT NULL,
    `transaction_id` VARCHAR(100) NULL,
    `payment_gateway` ENUM('cash', 'vnpay') NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `type` ENUM('payment', 'deposit_refund') DEFAULT 'payment',
    `status` ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
);

CREATE TABLE `stock_receipts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `receipt_code` VARCHAR(30) NOT NULL UNIQUE,
    `user_id` BIGINT NOT NULL,
    `receipt_type` ENUM('import', 'export') NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `total_amount` DECIMAL(12, 2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
);

CREATE TABLE `stock_receipt_details` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `receipt_id` BIGINT NOT NULL,
    `product_size_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(12, 2) DEFAULT 0.00,
    FOREIGN KEY (`receipt_id`) REFERENCES `stock_receipts` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_size_id`) REFERENCES `product_sizes` (`id`) ON DELETE RESTRICT
);

CREATE TABLE `menus` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `parent_id` INT NULL,
    `sort_order` INT DEFAULT 0,
    `position` ENUM('header', 'footer') DEFAULT 'header',
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE
);

CREATE TABLE `banners` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `link_url` VARCHAR(255) NULL,
    `position` VARCHAR(50) DEFAULT 'home_main_slider',
    `sort_order` INT DEFAULT 0,
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `pages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `content` LONGTEXT NOT NULL,
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `post_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `status` ENUM('active', 'hidden') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `posts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `thumbnail` VARCHAR(255) NULL,
    `summary` VARCHAR(500) NULL,
    `content` LONGTEXT NOT NULL,
    `status` ENUM('published', 'draft', 'hidden') DEFAULT 'published',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `post_categories` (`id`) ON DELETE RESTRICT
);

CREATE TABLE `reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `rating` TINYINT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `contacts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `fullname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `admin_reply` TEXT NULL,
    `status` ENUM('pending', 'replied') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
