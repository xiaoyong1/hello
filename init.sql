CREATE DATABASE `avio-spider` /*!40100 COLLATE 'utf8_general_ci' */;
use `avio-spider`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;

CREATE TABLE `info` (
	`id` VARCHAR(50) NOT NULL COMMENT '唯一标识符',
	`name` VARCHAR(500) NULL DEFAULT NULL COMMENT '名称',
	`url` VARCHAR(500) NULL DEFAULT NULL COMMENT '地址',
	`photo` VARCHAR(500) NULL DEFAULT NULL COMMENT '头像',
	`local` VARCHAR(500) NULL DEFAULT NULL COMMENT '本地头像地址',
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;