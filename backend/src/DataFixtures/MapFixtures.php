<?php

namespace App\DataFixtures;

use App\Entity\Map;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MapFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $mapFixtures = [
            ["slug" => "customs", "image" => "customs.jpg"],
            ["slug" => "factory", "image" => "factory.webp"],
            ["slug" => "ground-zero", "image" => "ground-zero.webp"],
            ["slug" => "interchange", "image" => "interchange.jpg"],
            ["slug" => "lighthouse", "image" => "lighthouse.webp"],
            ["slug" => "reserve", "image" => "reserve.jpg"],
            ["slug" => "shoreline", "image" => "shoreline.jpg"],
            ["slug" => "streets-of-tarkov", "image" => "streets-of-tarkov.jpg"],
            ["slug" => "the-lab", "image" => "the-lab.webp"],
            ["slug" => "the-labyrinth", "image" => "the-labyrinth.png"],
            ["slug" => "woods", "image" => "woods.jpg"],
        ];

        foreach ($mapFixtures as $mapFixture) {
            $map = new Map();
            $map->setSlug($mapFixture["slug"]);
            $map->setImage($mapFixture["image"]);

            $manager->persist($map);
        }

        $manager->flush();
    }
}
