/* CREATE DATABASE RoyougiChan */
CREATE DATABASE `RyougiChan` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE RyougiChan;

/* CREATE TABLE R_Article */
DROP TABLE IF EXISTS `R_Article`;

CREATE TABLE IF NOT EXISTS `R_Article` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(120) NOT NULL,
  `subTitle` VARCHAR(120),
  `author` VARCHAR(100) NOT NULL,
  `editor` VARCHAR(100) NOT NULL,
  `authorDesc` VARCHAR(150),
  `license` VARCHAR(100),
  `createTime` DATETIME NOT NULL,
  `updateTime` DATETIME NOT NULL,
  `abstract` VARCHAR(2000),
  `keywords` VARCHAR(200),
  `content` MEDIUMTEXT NOT NULL,
  `reference` MEDIUMTEXT,
  `thumb` VARCHAR(150),
  PRIMARY KEY `pk_id`(`id`)
) ENGINE = InnoDB;

/* CREATE TABLE R_User */
DROP TABLE IF EXISTS `R_User`;

CREATE TABLE IF NOT EXISTS `R_User` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(100),
  `password` VARCHAR(64) NOT NULL,
  `nickname` VARCHAR(100) NOT NULL,
  `gender` INT NOT NULL,
  `birthday` DATETIME,
  `region` VARCHAR(100),
  `description` VARCHAR(150),
  `regTime` DATETIME NOT NULL,
  `latestLoginTime` DATETIME NOT NULL,
  `latestLoginIP` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL,
  PRIMARY KEY `pk_id`(`id`)
) ENGINE = InnoDB;

/* CREATE TABLE R_Admin */
DROP TABLE IF EXISTS `R_Admin`;

CREATE TABLE IF NOT EXISTS `R_Admin` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(64) NOT NULL,
  `key` VARCHAR(64) NOT NULL,
  `nickname` VARCHAR(100) NOT NULL,
  `latestLoginTime` DATETIME NOT NULL,
  `latestLoginIP` VARCHAR(100) NOT NULL,
  `authority` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL,
  PRIMARY KEY `pk_id`(`id`)
) ENGINE = InnoDB;