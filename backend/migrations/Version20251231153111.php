<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231153111 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Generation of the first entities needed for the v0.1.0";
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE drawing (id INT AUTO_INCREMENT NOT NULL, room_id INT DEFAULT NULL, map_id INT DEFAULT NULL, content JSON NOT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_996B9FE754177093 (room_id), INDEX IDX_996B9FE753C55F64 (map_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE map (id INT AUTO_INCREMENT NOT NULL, slug VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE room (id INT AUTO_INCREMENT NOT NULL, uuid CHAR(36) NOT NULL COMMENT \'(DC2Type:guid)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE drawing ADD CONSTRAINT FK_996B9FE754177093 FOREIGN KEY (room_id) REFERENCES room (id)');
        $this->addSql('ALTER TABLE drawing ADD CONSTRAINT FK_996B9FE753C55F64 FOREIGN KEY (map_id) REFERENCES map (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE drawing DROP FOREIGN KEY FK_996B9FE754177093');
        $this->addSql('ALTER TABLE drawing DROP FOREIGN KEY FK_996B9FE753C55F64');
        $this->addSql('DROP TABLE drawing');
        $this->addSql('DROP TABLE map');
        $this->addSql('DROP TABLE room');
    }
}
