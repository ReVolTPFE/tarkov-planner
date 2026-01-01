<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260101183256 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Added maps to database through migration as they are not supposed to change.";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("
            INSERT INTO map (slug, image) VALUES
            ('customs', 'customs.jpg'),
            ('factory', 'factory.webp'),
            ('ground-zero', 'ground-zero.webp'),
            ('interchange', 'interchange.jpg'),
            ('lighthouse', 'lighthouse.webp'),
            ('reserve', 'reserve.jpg'),
            ('shoreline', 'shoreline.jpg'),
            ('streets-of-tarkov', 'streets-of-tarkov.jpg'),
            ('the-lab', 'the-lab.webp'),
            ('the-labyrinth', 'the-labyrinth.png'),
            ('woods', 'woods.jpg')
        ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("
            DELETE FROM map WHERE slug IN (
                'customs',
                'factory',
                'ground-zero',
                'interchange',
                'lighthouse',
                'reserve',
                'shoreline',
                'streets-of-tarkov',
                'the-lab',
                'the-labyrinth',
                'woods'
            )
        ");
    }
}
