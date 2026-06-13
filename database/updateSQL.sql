-- ============================================================
--  ERPHome - Script de inserción de módulos y permisos
--  Tabla: modulos + permissions (Spatie)
--  Patrón: 4 permisos por módulo (ver, crear, actualizar, eliminar)
-- ============================================================


INSERT INTO `modulos` (`nombre`, `icono`, `estado`, `created_at`, `updated_at`) VALUES
('movimiento', 'currency_exchange', 1, NOW(), NOW());

SET @id_modulo = LAST_INSERT_ID();

INSERT INTO `permissions` (`name`, `guard_name`, `id_modulo`, `created_at`, `updated_at`) VALUES
('ver_movimiento',        'web', @id_modulo, NOW(), NOW()),
('crear_movimiento',      'web', @id_modulo, NOW(), NOW()),
('actualizar_movimiento', 'web', @id_modulo, NOW(), NOW()),
('eliminar_movimiento',   'web', @id_modulo, NOW(), NOW());

CREATE TABLE `movimientos`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `cantidad` DECIMAL(10,2) NOT NULL,
    `tipo` ENUM('INGRESO', 'GASTO') NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `categoria` VARCHAR(255) NOT NULL,
    `fecha` DATE NOT NULL,
    `historial` JSON NOT NULL,
    `created_at` DATETIME NOT NULL,
    `update_at` DATETIME NOT NULL,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
)
