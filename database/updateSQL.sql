-- ============================================================
--  ERPHome - Script de inserción de módulos y permisos
--  Tabla: modulos + permissions (Spatie)
--  Patrón: 4 permisos por módulo (ver, crear, actualizar, eliminar)
-- ============================================================


INSERT INTO `modulos` (`nombre`, `icono`, `estado`, `created_at`, `updated_at`) VALUES
('movimiento', 'extension', 1, NOW(), NOW());

SET @id_modulo = LAST_INSERT_ID();

INSERT INTO `permissions` (`name`, `guard_name`, `id_modulo`, `created_at`, `updated_at`) VALUES
('ver_movimiento',        'web', @id_modulo, NOW(), NOW()),
('crear_movimiento',      'web', @id_modulo, NOW(), NOW()),
('actualizar_movimiento', 'web', @id_modulo, NOW(), NOW()),
('eliminar_movimiento',   'web', @id_modulo, NOW(), NOW());
