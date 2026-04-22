-- =====================================================
-- Migration: academic_records table
-- =====================================================
USE `JOBHUBDIU`;

CREATE TABLE IF NOT EXISTS `academic_records` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `user_id`     VARCHAR(50)  NOT NULL,
    `semester`    INT          NOT NULL,
    `course_code` VARCHAR(20)  NOT NULL,
    `course_name` VARCHAR(150) NOT NULL,
    `credit`      FLOAT        NOT NULL DEFAULT 3.0,
    `cgpa`        FLOAT        NOT NULL DEFAULT 0.0 COMMENT 'Grade point for this course out of 4.0',
    `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_ar_user` (`user_id`),
    CONSTRAINT `fk_ar_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
